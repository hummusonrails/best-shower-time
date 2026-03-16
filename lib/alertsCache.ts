import { type ProcessedAlert } from "best-time-ui";

let cache: { data: ProcessedAlert[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

const TZEVA_ADOM_API = "https://api.tzevaadom.co.il/alerts-history";
const SIRENWISE_API = "https://sirenwise.com/api/alerts";
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

interface SirenWiseAlert {
  id: string;
  timestamp: number;
  cities: string[];
  threat: number;
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

async function fetchFromSirenWise(): Promise<ProcessedAlert[]> {
  const since = Date.now() - SEVEN_DAYS_MS;
  const response = await fetch(`${SIRENWISE_API}?since=${since}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`SirenWise API: ${response.status}`);

  const alerts: SirenWiseAlert[] = await response.json();
  return alerts.map((a) => toProcessed(a.id, a.timestamp, a.cities, a.threat));
}

export async function getAlerts(): Promise<ProcessedAlert[]> {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    // Primary: Tzeva Adom API (~28h of recent data, always works)
    const primary = await fetchFromTzevaAdom();

    // Supplemental: SirenWise API (7 days of data, may fail)
    let supplemental: ProcessedAlert[] = [];
    try {
      supplemental = await fetchFromSirenWise();
    } catch {
      // SirenWise unavailable — use primary only
    }

    // Merge: deduplicate by keeping unique timestamps+cities combos
    const seen = new Set(primary.map((a) => `${a.timestamp}`));
    const merged = [...primary];
    for (const alert of supplemental) {
      if (!seen.has(`${alert.timestamp}`)) {
        seen.add(`${alert.timestamp}`);
        merged.push(alert);
      }
    }

    // Sort newest first
    merged.sort((a, b) => b.timestamp - a.timestamp);

    cache = { data: merged, timestamp: now };
    return merged;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);

    if (cache) {
      return cache.data;
    }
    return [];
  }
}
