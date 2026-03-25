"use client";

import { AlertTimeline, useLanguage, type ProcessedAlert, type PreAlert } from "best-time-ui";
import { useMemo } from "react";

interface Props {
  alerts: ProcessedAlert[];
  preAlerts: PreAlert[];
}

interface PreAlertMarker {
  hourIndex: number;
  type: "early_warning" | "exit_notification";
  x: number;
}

export default function AlertTimelineWithPreAlerts({ alerts, preAlerts }: Props) {
  const { lang } = useLanguage();

  // Compute which hour buckets have pre-alert events
  const preAlertHours = useMemo(() => {
    if (preAlerts.length === 0) return new Map<number, { warnings: number; exits: number }>();

    const now = new Date();
    const hourMap = new Map<number, { warnings: number; exits: number }>();

    for (const pa of preAlerts) {
      const paDate = new Date(pa.timestamp);
      // Calculate how many hours ago (0 = current hour, 23 = 23 hours ago)
      const hoursAgo = Math.floor((now.getTime() - paDate.getTime()) / (1000 * 60 * 60));
      if (hoursAgo < 0 || hoursAgo > 23) continue;

      // In the chart, index 0 = 23 hours ago, index 23 = now
      const bucketIndex = 23 - hoursAgo;

      const existing = hourMap.get(bucketIndex) || { warnings: 0, exits: 0 };
      if (pa.alert_type === "early_warning") {
        existing.warnings++;
      } else {
        existing.exits++;
      }
      hourMap.set(bucketIndex, existing);
    }

    return hourMap;
  }, [preAlerts]);

  const hasPreAlerts = preAlertHours.size > 0;

  return (
    <div className="relative w-full">
      <AlertTimeline alerts={alerts} />

      {/* Pre-alert marker overlay */}
      {hasPreAlerts && (
        <div className="px-4">
          <div className="card px-5 py-3 -mt-1 rounded-t-none border-t border-cream/5">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span className="font-mono text-xs text-cream/40">
                {lang === "he" ? "אירועי התרעה מוקדמת" : "Pre-alert events"}
              </span>
            </div>

            {/* 24-hour strip of markers */}
            <div className="flex items-center h-5">
              {Array.from({ length: 24 }, (_, i) => {
                const data = preAlertHours.get(i);
                if (!data) {
                  return (
                    <div key={i} className="flex-1 flex justify-center">
                      <div className="w-1 h-1 rounded-full bg-cream/5" />
                    </div>
                  );
                }
                return (
                  <div key={i} className="flex-1 flex justify-center gap-0.5">
                    {data.warnings > 0 && (
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <polygon
                          points="4,0 8,8 0,8"
                          fill="#FBBF24"
                          opacity={Math.min(0.4 + data.warnings * 0.3, 1)}
                        />
                      </svg>
                    )}
                    {data.exits > 0 && (
                      <svg width="6" height="6" viewBox="0 0 6 6">
                        <circle cx="3" cy="3" r="3" fill="#4ADE80" opacity="0.7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <svg width="6" height="6" viewBox="0 0 6 6">
                  <polygon points="3,0 6,6 0,6" fill="#FBBF24" />
                </svg>
                <span className="font-mono text-[10px] text-cream/30">
                  {lang === "he" ? "אזהרה" : "Warning"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="5" height="5" viewBox="0 0 5 5">
                  <circle cx="2.5" cy="2.5" r="2.5" fill="#4ADE80" />
                </svg>
                <span className="font-mono text-[10px] text-cream/30">
                  {lang === "he" ? "ירידת מתח" : "All clear"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
