import { NextResponse } from "next/server";
import { getAlerts } from "@/lib/alertsCache";

export async function GET() {
  const data = await getAlerts();
  return NextResponse.json(data);
}
