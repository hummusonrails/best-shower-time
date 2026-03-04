import { NextRequest, NextResponse } from "next/server";
import { getAlerts } from "@/lib/alertsCache";
import { computeStats, getRecommendation } from "@/lib/safety";
import { filterAlertsByRegion } from "@/lib/regions";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const region = searchParams.get("region") || "all";
  const city = searchParams.get("city") || null;
  const duration = Number(searchParams.get("duration")) || 10;

  const alerts = await getAlerts();

  // Filter by location (same logic as client-side)
  const filtered = city
    ? alerts.filter((a) => a.cities.some((c) => c.includes(city)))
    : alerts.filter((a) => filterAlertsByRegion(a.cities, region));

  const stats = computeStats(filtered);
  const rec = getRecommendation(stats, duration);

  return NextResponse.json({
    level: rec.level,
    score: rec.score,
    message: rec.message,
    messageHe: rec.messageHe,
  });
}
