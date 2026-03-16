import { type ProcessedAlert } from "best-time-ui";
import { createClient } from "@libsql/client/http";

let cache: { data: ProcessedAlert[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

const TZEVA_ADOM_API = "https://api.tzevaadom.co.il/alerts-history";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface RawAlert {
  time?: number;
  cities?: string[];
  threat?: number;
  isDrill?: boolean;
}
interface RawGroup {
  id?: number;
  alerts?: RawAlert[];
}

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

async function fetchFromTzevaAdom(): Promise<ProcessedAlert[]> {
  const response = await fetch(TZEVA_ADOM_API, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Tzeva Adom API: ${response.status}`);

  const rawGroups: RawGroup[] = await response.json();
  const processed: ProcessedAlert[] = [];

  for (const group of rawGroups) {
    if (!Array.isArray(group.alerts)) continue;
    for (const alert of group.alerts) {
      if (alert.isDrill) continue;
      const ts = typeof alert.time === "number" ? alert.time * 1000 : Date.now();
      processed.push(
        toProcessed(
          `${group.id ?? 0}-${ts}`,
          ts,
          Array.isArray(alert.cities) ? alert.cities : ["Unknown"],
          typeof alert.threat === "number" ? alert.threat : 0
        )
      );
    }
  }
  return processed;
}

async function fetchFromTurso(): Promise<ProcessedAlert[]> {
  const rawUrl = process.env.TURSO_DB_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!rawUrl || !token) {
    console.log("[alertsCache] Turso env vars missing:", { hasUrl: !!rawUrl, hasToken: !!token });
    return [];
  }

  const url = rawUrl.trim().replace("libsql://", "https://");
  console.log("[alertsCache] Turso connecting to:", url.substring(0, 30) + "...");

  const db = createClient({
    url,
    authToken: token.trim(),
  });

  const since = Date.now() - SEVEN_DAYS_MS;
  const result = await db.execute({
    sql: "SELECT id, timestamp, cities, threat FROM alerts WHERE timestamp > ? ORDER BY timestamp DESC LIMIT 5000",
    args: [since],
  });

  return result.rows.map((r) =>
    toProcessed(
      r.id as string,
      r.timestamp as number,
      JSON.parse(r.cities as string),
      r.threat as number
    )
  );
}

export async function getAlerts(): Promise<ProcessedAlert[]> {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    // Primary: Tzeva Adom API (~28h of recent data)
    const primary = await fetchFromTzevaAdom();

    // Supplemental: Turso DB (7 days of historical data)
    let supplemental: ProcessedAlert[] = [];
    try {
      supplemental = await fetchFromTurso();
      console.log(`[alertsCache] Turso returned ${supplemental.length} alerts`);
    } catch (tursoErr) {
      console.error("[alertsCache] Turso fetch failed:", tursoErr);
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

    cache = { data: merged, timestamp: now };
    return merged;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    if (cache) return cache.data;
    return [];
  }
}
