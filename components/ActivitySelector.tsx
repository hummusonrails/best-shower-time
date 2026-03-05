"use client";

import { useLanguage, useTranslation, useHaptics } from "best-time-ui";
import { ActivityType } from "@/lib/types";

interface Props {
  activity: ActivityType;
  duration: number;
  exitTime: number;
  onActivityChange: (activity: ActivityType) => void;
  onDurationChange: (duration: number) => void;
  onExitTimeChange: (exitTime: number) => void;
}

export default function ActivitySelector({
  activity,
  duration,
  exitTime,
  onActivityChange,
  onDurationChange,
  onExitTimeChange,
}: Props) {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const { trigger } = useHaptics();

  const maxDuration = activity === "shower" ? 20 : 30;

  return (
    <section className="w-full max-w-md mx-auto px-4">
      {/* Activity toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => {
            trigger("light");
            onActivityChange("shower");
            onDurationChange(Math.min(duration, 20));
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-500 ease-smooth ${
            activity === "shower"
              ? "bg-surface-2 text-cream"
              : "text-cream/40 hover:text-cream/60"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-mono text-sm">{t("shower")}</span>
        </button>

        <button
          onClick={() => { trigger("light"); onActivityChange("toilet"); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-500 ease-smooth ${
            activity === "toilet"
              ? "bg-surface-2 text-cream"
              : "text-cream/40 hover:text-cream/60"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12l1 6h12l1-6" />
          </svg>
          <span className="font-mono text-sm">{t("toilet")}</span>
        </button>
      </div>

      {/* Duration slider */}
      <div className="card px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
            {t("activityDuration")}
          </span>
          <span className="font-mono text-lg text-cream">
            {duration} {t("minutes")}
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={maxDuration}
          value={duration}
          onChange={(e) => { trigger("selection"); onDurationChange(Number(e.target.value)); }}
          className="slider w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-xs text-cream/30">3</span>
          <span className="font-mono text-xs text-cream/30">{maxDuration}</span>
        </div>
      </div>

      {/* Exit time slider — shower only */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-smooth ${
          activity === "shower" ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="card px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
              {t("exitTime")}
            </span>
            <span className="font-mono text-lg text-cream">
              {exitTime} {t("minutes")}
            </span>
          </div>
          <p className="font-mono text-xs text-cream/25 mb-3">
            {t("exitTimeDesc")}
          </p>
          <input
            type="range"
            min={1}
            max={5}
            value={exitTime}
            onChange={(e) => { trigger("selection"); onExitTimeChange(Number(e.target.value)); }}
            className="slider w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="font-mono text-xs text-cream/30">1</span>
            <span className="font-mono text-xs text-cream/30">5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
