"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { SafetyStats } from "@/lib/types";
import { formatDuration } from "@/lib/safety";
import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  stats: SafetyStats | null;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card px-5 py-5 flex flex-col gap-1 hover:bg-surface-2 transition-colors duration-200">
      <span className="font-mono text-xs text-cream/40 uppercase tracking-wider">
        {label}
      </span>
      <span className="font-mono text-2xl text-cream">{value}</span>
      {sub && (
        <span className="font-mono text-xs text-cream/30">{sub}</span>
      )}
    </div>
  );
}

function AlertCountCard({
  label,
  count,
  sub,
}: {
  label: string;
  count: number;
  sub?: string;
}) {
  const displayCount = useCountUp(count, true);

  return (
    <div className="card px-5 py-5 flex flex-col gap-1 hover:bg-surface-2 transition-colors duration-200">
      <span className="font-mono text-xs text-cream/40 uppercase tracking-wider">
        {label}
      </span>
      <span className="font-mono text-2xl text-cream">{displayCount}</span>
      {sub && (
        <span className="font-mono text-xs text-cream/30">{sub}</span>
      )}
    </div>
  );
}

export default function StatsGrid({ stats }: Props) {
  const { lang } = useLanguage();

  if (!stats) {
    return (
      <section className="grid grid-cols-2 gap-3 w-full px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card px-5 py-5 animate-pulse">
            <div className="h-3 w-20 bg-cream/10 rounded mb-2" />
            <div className="h-7 w-16 bg-cream/10 rounded" />
          </div>
        ))}
      </section>
    );
  }

  const trendArrow =
    stats.trend === "increasing" ? "↑" : stats.trend === "decreasing" ? "↓" : "→";
  const trendColor =
    stats.trend === "increasing"
      ? "text-danger"
      : stats.trend === "decreasing"
        ? "text-safety"
        : "text-warning";

  return (
    <section className="grid grid-cols-2 gap-3 w-full px-4">
      <StatCard
        label={t(lang, "timeSinceLastAlert")}
        value={formatDuration(stats.timeSinceLastAlert)}
        sub={stats.lastAlertTime ?? t(lang, "noAlerts")}
      />
      <StatCard
        label={t(lang, "averageGap")}
        value={formatDuration(stats.averageGap)}
      />
      <AlertCountCard
        label={t(lang, "alertCount")}
        count={stats.alertCount24h}
        sub={t(lang, "alerts")}
      />
      <div className="card px-5 py-5 flex flex-col gap-1 hover:bg-surface-2 transition-colors duration-200">
        <span className="font-mono text-xs text-cream/40 uppercase tracking-wider">
          {t(lang, "trendLabel")}
        </span>
        <span className={`font-mono text-2xl ${trendColor}`}>
          {trendArrow}{" "}
          <span className="text-base">{t(lang, stats.trend)}</span>
        </span>
      </div>
    </section>
  );
}
