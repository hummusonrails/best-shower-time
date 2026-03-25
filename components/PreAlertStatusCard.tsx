"use client";

import { useTranslation, useLanguage, type PreAlertStatus } from "best-time-ui";

interface Props {
  preAlertStatus: PreAlertStatus;
}

export default function PreAlertStatusCard({ preAlertStatus }: Props) {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const { warningCount2h, warningCount6h, lastWarningMinutesAgo, hasRecentExit } =
    preAlertStatus;

  // Don't render if no pre-alert activity at all
  if (warningCount6h === 0 && !hasRecentExit) return null;

  const formatTimeAgo = (minutes: number | null): string => {
    if (minutes === null) return lang === "he" ? "—" : "—";
    if (minutes < 1) return lang === "he" ? "עכשיו" : "just now";
    if (minutes < 60)
      return lang === "he" ? `לפני ${Math.round(minutes)} דק׳` : `${Math.round(minutes)}m ago`;
    const hours = Math.floor(minutes / 60);
    return lang === "he" ? `לפני ${hours} שע׳` : `${hours}h ago`;
  };

  return (
    <section className="w-full px-4">
      <div className="card px-5 py-4">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
            {t("prealert.title")}
          </span>
          {lastWarningMinutesAgo !== null && (
            <span className="font-mono text-xs text-cream/30 ltr:ml-auto rtl:mr-auto">
              {formatTimeAgo(lastWarningMinutesAgo)}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          {/* Warnings */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-lg text-amber-400">{warningCount2h}</span>
            <span className="font-mono text-xs text-cream/40">
              {t("prealert.warnings2h")}
            </span>
          </div>

          <div className="w-px h-6 bg-cream/10" />

          {/* 6h total */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg text-cream/60">{warningCount6h}</span>
            <span className="font-mono text-xs text-cream/40">
              {t("prealert.warnings6h")}
            </span>
          </div>

          {/* Recent exit indicator */}
          {hasRecentExit && (
            <>
              <div className="w-px h-6 bg-cream/10" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs text-emerald-400">
                  {t("prealert.exitCleared")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
