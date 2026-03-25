"use client";

import { StatsGrid, useTranslation, useLanguage, type SafetyStats, type PreAlertStatus } from "best-time-ui";

interface Props {
  stats: SafetyStats | null;
  preAlertStatus: PreAlertStatus | null;
}

export default function StatsGridWithPreAlerts({ stats, preAlertStatus }: Props) {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const showPreAlertRow =
    preAlertStatus && (preAlertStatus.warningCount2h > 0 || preAlertStatus.hasRecentExit);

  return (
    <div className="w-full">
      <StatsGrid stats={stats} />

      {/* Pre-alert row below the grid */}
      {showPreAlertRow && (
        <div className="px-4 mt-3">
          <div className="card px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
                {lang === "he" ? "התרעות מוקדמות" : "Pre-alerts"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {preAlertStatus.warningCount2h > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-mono text-sm text-amber-400">
                    {preAlertStatus.warningCount2h}
                  </span>
                  <span className="font-mono text-xs text-cream/30">
                    {lang === "he" ? "ב-2 שע׳" : "in 2h"}
                  </span>
                </div>
              )}
              {preAlertStatus.hasRecentExit && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs text-emerald-400">
                    {lang === "he" ? "ירידת מתח" : "Cleared"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
