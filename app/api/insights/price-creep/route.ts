import { NextResponse } from "next/server";
import { getOrders } from "@/lib/data";
import { computePriceCreepAlerts } from "@/lib/mock-data";

export async function GET() {
  const orders = await getOrders();
  const alerts = computePriceCreepAlerts(orders);
  return NextResponse.json({ alerts });
}
