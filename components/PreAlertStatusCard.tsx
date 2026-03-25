"use client";

import { useState } from "react";
import { useTranslation, useLanguage, type PreAlertStatus } from "best-time-ui";

interface Props {
  preAlertStatus: PreAlertStatus;
  selectedRegion: string;
}

export default function PreAlertStatusCard({ preAlertStatus, selectedRegion }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const isHe = lang === "he";

  const { warningCount2h, warningCount6h, lastWarningMinutesAgo, hasActiveWarning, hasRecentExit } =
    preAlertStatus;

  if (warningCount6h === 0 && !hasRecentExit) return null;

  const formatTimeAgo = (minutes: number | null): string => {
    if (minutes === null) return "—";
    if (minutes < 1) return isHe ? "עכשיו" : "now";
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  const isRegionSpecific = selectedRegion !== "all";

  // Severity level for styling
  const severity = hasActiveWarning ? "high" : warningCount2h >= 2 ? "elevated" : "low";

  const borderColor = severity === "high"
    ? "border-amber-500/40"
    : severity === "elevated"
    ? "border-amber-500/25"
    : "border-cream/8";

  const getScoreImpact = (): string => {
    if (hasActiveWarning) return t("prealert.scoreImpact.active");
    if (warningCount2h >= 2) return t("prealert.scoreImpact.multi");
    if (hasRecentExit) return t("prealert.scoreImpact.exit");
    return t("prealert.scoreImpact.low");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`w-full px-5 py-3 rounded-xl border ${borderColor} bg-surface-1/50 hover:bg-surface-1/80 transition-colors text-left`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Warning indicator */}
            <div className={`w-2 h-2 rounded-full ${severity === "low" ? "bg-amber-400/40" : "bg-amber-400"} ${severity === "high" ? "animate-pulse" : ""}`} />

            {/* Count */}
            <span className="font-mono text-sm text-amber-400">
              {warningCount2h > 0 ? warningCount2h : warningCount6h}
            </span>
            <span className="font-mono text-xs text-cream/40">
              {warningCount2h > 0
                ? (isHe ? "אזהרות (2 שע׳)" : "warnings (2h)")
                : (isHe ? "אזהרות (6 שע׳)" : "warnings (6h)")}
            </span>

            {/* Exit indicator */}
            {hasRecentExit && (
              <span className="font-mono text-xs text-emerald-400">
                {isHe ? "· ירידת מתח" : "· cleared"}
              </span>
            )}
          </div>

          {/* Right side: time ago + tap hint */}
          <div className="flex items-center gap-2">
            {lastWarningMinutesAgo !== null && (
              <span className="font-mono text-xs text-cream/25">
                {formatTimeAgo(lastWarningMinutesAgo)} {isHe ? "לפני" : "ago"}
              </span>
            )}
            <span className="font-mono text-[9px] text-cream/20">›</span>
          </div>
        </div>
      </button>

      {/* Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-1 border-t sm:border border-cream/10 rounded-t-2xl sm:rounded-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-base text-cream">
              {t("prealert.modalTitle")}
            </h2>

            <p className="text-xs text-cream/50 leading-relaxed">
              {t("prealert.modalDesc")}
            </p>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-surface-2 rounded-lg p-3 text-center">
                <div className="font-mono text-xl text-amber-400">{warningCount2h}</div>
                <div className="font-mono text-[8px] text-cream/30 uppercase tracking-wider mt-0.5">
                  {isHe ? "2 שעות" : "2 hours"}
                </div>
              </div>
              <div className="flex-1 bg-surface-2 rounded-lg p-3 text-center">
                <div className="font-mono text-xl text-cream/50">{warningCount6h}</div>
                <div className="font-mono text-[8px] text-cream/30 uppercase tracking-wider mt-0.5">
                  {isHe ? "6 שעות" : "6 hours"}
                </div>
              </div>
              <div className="flex-1 bg-surface-2 rounded-lg p-3 text-center">
                <div className={`font-mono text-xl ${hasRecentExit ? "text-emerald-400" : "text-cream/20"}`}>
                  {hasRecentExit ? "✓" : "—"}
                </div>
                <div className="font-mono text-[8px] text-cream/30 uppercase tracking-wider mt-0.5">
                  {isHe ? "סיום" : "All clear"}
                </div>
              </div>
            </div>

            {/* Region context */}
            <p className="text-[11px] text-cream/30 italic">
              {isRegionSpecific
                ? t("prealert.regionNote.regional")
                : t("prealert.regionNote.nationwide")}
            </p>

            {/* Score impact */}
            <div className="bg-amber-950/20 border border-amber-900/20 rounded-lg p-3">
              <div className="font-mono text-[9px] text-amber-400/60 uppercase tracking-wider mb-1.5">
                {t("prealert.scoreImpact")}
              </div>
              <p className="text-xs text-cream/60 leading-relaxed">
                {getScoreImpact()}
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-surface-2 hover:bg-surface-2/80 rounded-lg font-mono text-xs text-cream/40 transition-colors"
            >
              {t("prealert.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
