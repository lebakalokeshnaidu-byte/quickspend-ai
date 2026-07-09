import { NextResponse } from "next/server";
import { getOrders } from "@/lib/data";
import { computeTimePatterns } from "@/lib/mock-data";

export async function GET() {
  const orders = await getOrders();
  const patterns = computeTimePatterns(orders);
  return NextResponse.json(patterns);
}
