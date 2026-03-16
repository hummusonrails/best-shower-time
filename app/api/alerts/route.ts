import { NextResponse } from "next/server";
import { type ProcessedAlert } from "best-time-ui";
import { createServerClient } from "@/lib/db";

export const dynamic = "force-dynamic";

const TZEVA_ADOM_API = "https://api.tzevaadom.co.il/alerts-history";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function toProcessed(id: string, ts: number, cities: string[], threat: number): ProcessedAlert {
  const date = new Date(ts);
  return {
    id,
    timestamp: ts,
    date: date.toLocaleDateString("en-US"),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    cities,
    threat,
  };
}

export async function GET() {
  try {
    // Primary: Tzeva Adom API (~28h of recent data)
    const tzevaRes = await fetch(TZEVA_ADOM_API, {
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      cache: "no-store",
    });

    let primary: ProcessedAlert[] = [];
    if (tzevaRes.ok) {
      interface RawAlert { time?: number; cities?: string[]; threat?: number; isDrill?: boolean }
      interface RawGroup { id?: number; alerts?: RawAlert[] }
      const rawGroups: RawGroup[] = await tzevaRes.json();

      for (const group of rawGroups) {
        if (!Array.isArray(group.alerts)) continue;
        for (const alert of group.alerts) {
          if (alert.isDrill) continue;
          const ts = typeof alert.time === "number" ? alert.time * 1000 : Date.now();
          primary.push(
            toProcessed(
              `${group.id ?? 0}-${ts}`,
              ts,
              Array.isArray(alert.cities) ? alert.cities : ["Unknown"],
              typeof alert.threat === "number" ? alert.threat : 0
            )
          );
        }
      }
    }

    // Supplemental: Turso DB (7 days of historical data)
    let supplemental: ProcessedAlert[] = [];
    try {
      const db = createServerClient();
      const since = Date.now() - SEVEN_DAYS_MS;
      const result = await db.execute({
        sql: "SELECT id, timestamp, cities, threat FROM alerts WHERE timestamp > ? ORDER BY timestamp DESC LIMIT 5000",
        args: [since],
      });
      supplemental = result.rows.map((r) =>
        toProcessed(
          r.id as string,
          r.timestamp as number,
          JSON.parse(r.cities as string),
          r.threat as number
        )
      );
    } catch {
      // Turso unavailable — use primary only
    }

    // Merge: deduplicate by timestamp
    const seen = new Set(primary.map((a) => `${a.timestamp}`));
    const merged = [...primary];
    for (const alert of supplemental) {
      if (!seen.has(`${alert.timestamp}`)) {
        seen.add(`${alert.timestamp}`);
        merged.push(alert);
      }
    }
    merged.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(merged, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" },
    });
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=10" },
    });
  }
}
