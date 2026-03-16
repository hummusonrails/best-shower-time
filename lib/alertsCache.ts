import { type ProcessedAlert } from "best-time-ui";

let cache: { data: ProcessedAlert[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

// Fetch last 7 days of alerts from SirenWise (backed by Turso DB)
const SIRENWISE_API = "https://sirenwise.com/api/alerts";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface SirenWiseAlert {
  id: string;
  timestamp: number;
  cities: string[];
  threat: number;
}

export async function getAlerts(): Promise<ProcessedAlert[]> {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    const since = now - SEVEN_DAYS_MS;
    const response = await fetch(
      `${SIRENWISE_API}?since=${since}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const alerts: SirenWiseAlert[] = await response.json();

    const processed: ProcessedAlert[] = alerts.map((alert) => {
      const date = new Date(alert.timestamp);
      return {
        id: alert.id,
        timestamp: alert.timestamp,
        date: date.toLocaleDateString("en-US"),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        cities: alert.cities,
        threat: alert.threat,
      };
    });

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
