"use client";

import { SafetyVerdict, useLanguage, type SafetyRecommendation, type PreAlertStatus } from "best-time-ui";

interface Props {
  recommendation: SafetyRecommendation | null;
  preAlertStatus: PreAlertStatus | null;
}

export default function SafetyVerdictWithPreAlerts({
  recommendation,
  preAlertStatus,
}: Props) {
  const { lang } = useLanguage();

  // Show the label when pre-alert data is actively influencing the score
  const isFactoredIn =
    preAlertStatus !== null &&
    (preAlertStatus.warningCount2h > 0 || preAlertStatus.hasRecentExit);

  return (
    <div className="relative">
      {/* Amber ring glow when active warnings are factored in */}
      {isFactoredIn && preAlertStatus.warningCount2h > 0 && (
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div
            className="w-44 h-44 mt-6 rounded-full"
            style={{
              boxShadow: "0 0 24px 2px rgba(251, 191, 36, 0.12)",
            }}
          />
        </div>
      )}

      <SafetyVerdict recommendation={recommendation} />

      {/* "Pre-alert data factored in" label */}
      {isFactoredIn && recommendation && (
        <div className="flex justify-center -mt-2 mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-1 border border-amber-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-wider">
              {lang === "he"
                ? "נתוני התרעה מוקדמת משפיעים על הציון"
                : "Pre-alert data factored in"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
