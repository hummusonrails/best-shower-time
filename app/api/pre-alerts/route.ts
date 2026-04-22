import { NextResponse, type NextRequest } from "next/server";
import { type PreAlert } from "best-time-ui";
import { createServerClient } from "@/lib/db";

export const revalidate = 30; // ISR: re-run at most once per 30 seconds

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const sinceParam = request.nextUrl.searchParams.get("since");
    const since = sinceParam ? Number(sinceParam) : Date.now() - SIX_HOURS_MS;

    const db = createServerClient();
    const result = await db.execute({
      sql: `SELECT id, timestamp, title_he, body_he, city_ids, regions, alert_type, created_at
            FROM pre_alerts WHERE timestamp > ? ORDER BY timestamp DESC LIMIT 200`,
      args: [since],
    });

    const preAlerts: PreAlert[] = result.rows.map((r) => ({
      id: r.id as string,
      timestamp: r.timestamp as number,
      title_he: r.title_he as string,
      body_he: r.body_he as string,
      city_ids: JSON.parse((r.city_ids as string) || "[]"),
      regions: JSON.parse((r.regions as string) || "[]"),
      alert_type: r.alert_type as PreAlert["alert_type"],
      created_at: r.created_at as number,
    }));

    return NextResponse.json(preAlerts, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    // Graceful degradation — table may not exist yet
    console.error("[pre-alerts] Failed:", error instanceof Error ? error.message : error);
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=10" },
    });
  }
}
