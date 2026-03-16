import { type ProcessedAlert } from "best-time-ui";

let cache: { data: ProcessedAlert[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function getAlerts(): Promise<ProcessedAlert[]> {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    const response = await fetch(
      "https://api.tzevaadom.co.il/alerts-history",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const rawGroups = await response.json();

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

    const groups: RawGroup[] = Array.isArray(rawGroups) ? rawGroups : [];

    const processed: ProcessedAlert[] = [];
    for (const group of groups) {
      if (!Array.isArray(group.alerts)) continue;
      for (const alert of group.alerts) {
        if (alert.isDrill) continue;

        const ts =
          typeof alert.time === "number"
            ? alert.time * 1000
            : Date.now();

        const date = new Date(ts);

        processed.push({
          id: `${group.id ?? 0}-${ts}`,
          timestamp: ts,
          date: date.toLocaleDateString("en-US"),
          time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cities: Array.isArray(alert.cities) ? alert.cities : ["Unknown"],
          threat: typeof alert.threat === "number" ? alert.threat : 0,
        });
      }
    }

    cache = { data: processed, timestamp: now };
    return processed;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);

    // Return cached data if available, even if stale
    if (cache) {
      return cache.data;
    }

    return [];
  }
}
