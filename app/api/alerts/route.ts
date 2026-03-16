import { NextResponse } from "next/server";
import { getAlerts } from "@/lib/alertsCache";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAlerts();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
