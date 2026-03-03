import { NextResponse } from "next/server";
import { ProcessedAlert } from "@/lib/types";

let cache: { data: ProcessedAlert[]; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const response = await fetch(
      "https://api.tzevaadom.co.il/alerts-history",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const rawGroups = await response.json();

    // API returns alert groups: [{ id, alerts: [{ time, cities, threat, isDrill }] }]
    // Flatten into individual alerts
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

        const ts = typeof alert.time === "number"
          ? alert.time * 1000  // API returns Unix seconds, convert to ms
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

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Failed to fetch alerts:", error);

    // Return cached data if available, even if stale
    if (cache) {
      return NextResponse.json(cache.data);
    }

    return NextResponse.json([]);
  }
}
