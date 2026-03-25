"use client";

import { useState } from "react";
import { useTranslation, useLanguage, type PreAlertStatus } from "best-time-ui";

interface Props {
  preAlertStatus: PreAlertStatus;
}

export default function PreAlertStatusCard({ preAlertStatus }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const { warningCount2h, warningCount6h, lastWarningMinutesAgo, hasActiveWarning, hasRecentExit } =
    preAlertStatus;

  if (warningCount6h === 0 && !hasRecentExit) return null;

  const formatTimeAgo = (minutes: number | null): string => {
    if (minutes === null) return "—";
    if (minutes < 1) return lang === "he" ? "עכשיו" : "just now";
    if (minutes < 60)
      return lang === "he" ? `לפני ${Math.round(minutes)} דק׳` : `${Math.round(minutes)}m ago`;
    const hours = Math.floor(minutes / 60);
    return lang === "he" ? `לפני ${hours} שע׳` : `${hours}h ago`;
  };

  // Determine score impact description
  const getScoreImpact = (): string => {
    if (hasActiveWarning) return t("prealert.scoreImpact.active");
    if (warningCount2h >= 2) return t("prealert.scoreImpact.multi");
    if (hasRecentExit) return t("prealert.scoreImpact.exit");
    return t("prealert.scoreImpact.low");
  };

  // Determine if warnings are region-specific or nationwide
  const regionNote = t("prealert.regionNote.nationwide");

  return (
    <>
      <section className="w-full px-4">
        <button
          onClick={() => setShowModal(true)}
          className="card px-5 py-4 w-full text-left cursor-pointer hover:border-amber-600/30 transition-colors"
        >
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
            <span className="font-mono text-[10px] text-amber-400/50 ltr:ml-auto rtl:mr-auto">
              {t("prealert.tapDetails")} →
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-mono text-lg text-amber-400">{warningCount2h}</span>
              <span className="font-mono text-xs text-cream/40">{t("prealert.warnings2h")}</span>
            </div>

            <div className="w-px h-6 bg-cream/10" />

            <div className="flex items-center gap-2">
              <span className="font-mono text-lg text-cream/60">{warningCount6h}</span>
              <span className="font-mono text-xs text-cream/40">{t("prealert.warnings6h")}</span>
            </div>

            {lastWarningMinutesAgo !== null && (
              <>
                <div className="w-px h-6 bg-cream/10" />
                <span className="font-mono text-xs text-cream/30">
                  {formatTimeAgo(lastWarningMinutesAgo)}
                </span>
              </>
            )}

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
        </button>
      </section>

      {/* Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-1 border border-amber-600/20 rounded-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
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
              <h2 className="font-serif text-lg text-cream">{t("prealert.modalTitle")}</h2>
            </div>

            {/* Explanation */}
            <p className="text-sm text-cream/60 leading-relaxed">
              {t("prealert.modalDesc")}
            </p>

            {/* Stats breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className="font-mono text-2xl text-amber-400">{warningCount2h}</div>
                <div className="font-mono text-[9px] text-cream/40 uppercase tracking-wider mt-1">
                  {lang === "he" ? "אזהרות (2 שע׳)" : "Warnings (2h)"}
                </div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className="font-mono text-2xl text-cream/60">{warningCount6h}</div>
                <div className="font-mono text-[9px] text-cream/40 uppercase tracking-wider mt-1">
                  {lang === "he" ? "אזהרות (6 שע׳)" : "Warnings (6h)"}
                </div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <div className={`font-mono text-2xl ${hasRecentExit ? "text-emerald-400" : "text-cream/30"}`}>
                  {hasRecentExit ? "✓" : "—"}
                </div>
                <div className="font-mono text-[9px] text-cream/40 uppercase tracking-wider mt-1">
                  {lang === "he" ? "סיום אירוע" : "All Clear"}
                </div>
              </div>
            </div>

            {/* Region note */}
            <p className="text-xs text-cream/40 italic">
              {regionNote}
            </p>

            {/* Score impact */}
            <div className="bg-amber-900/10 border border-amber-600/15 rounded-xl p-4">
              <div className="font-mono text-xs text-amber-400/80 uppercase tracking-wider mb-2">
                {t("prealert.scoreImpact")}
              </div>
              <p className="text-sm text-cream/70 leading-relaxed">
                {getScoreImpact()}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-surface-2 hover:bg-surface-2/80 rounded-xl font-mono text-sm text-cream/60 transition-colors"
            >
              {t("prealert.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
