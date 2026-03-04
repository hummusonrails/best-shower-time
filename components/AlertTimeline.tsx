"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { t } from "@/lib/i18n";
import { ProcessedAlert } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface Props {
  alerts: ProcessedAlert[];
}

interface HourBucket {
  hour: string;
  count: number;
  isNow: boolean;
}

export default function AlertTimeline({ alerts }: Props) {
  const { lang } = useLanguage();

  // Bucket alerts into hourly bins over the last 24h
  const now = new Date();
  const buckets: HourBucket[] = [];

  for (let i = 23; i >= 0; i--) {
    const bucketStart = new Date(now);
    bucketStart.setHours(now.getHours() - i, 0, 0, 0);
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setHours(bucketStart.getHours() + 1);

    const count = alerts.filter(
      (a) => a.timestamp >= bucketStart.getTime() && a.timestamp < bucketEnd.getTime()
    ).length;

    const hourLabel = bucketStart.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    buckets.push({
      hour: hourLabel,
      count,
      isNow: i === 0,
    });
  }

  const nowIndex = buckets.findIndex((b) => b.isNow);

  return (
    <section className="w-full px-4">
      <h3 className="font-serif italic text-lg text-cream/70 mb-4">
        {t(lang, "timeline")}
      </h3>
      <div className="card p-5">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={buckets} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="hour"
              tick={{ fill: "rgba(255,238,200,0.3)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: "rgba(255,238,200,0.1)" }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(255,238,200,0.3)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface-2)",
                border: "none",
                borderRadius: 8,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 12,
                color: "#FFEEC8",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#FFEEC8", fontWeight: 500 }}
              itemStyle={{ color: "#FFEEC8" }}
              cursor={{ fill: "rgba(255,238,200,0.06)" }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={20}>
              {buckets.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.count === 0
                      ? "rgba(255,238,200,0.06)"
                      : entry.count > 3
                        ? "#EF4444"
                        : entry.count > 1
                          ? "#FBBF24"
                          : "rgba(239,68,68,0.5)"
                  }
                />
              ))}
            </Bar>
            {nowIndex >= 0 && (
              <ReferenceLine
                x={buckets[nowIndex].hour}
                stroke="#FFEEC8"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: t(lang, "now"),
                  position: "top",
                  fill: "rgba(255,238,200,0.5)",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
