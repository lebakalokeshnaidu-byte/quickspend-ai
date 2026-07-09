import { NextResponse } from "next/server";
import { getOrders } from "@/lib/data";
import { computeDashboardStats, computeTopImpulseCategories } from "@/lib/mock-data";

export async function GET() {
  const orders = await getOrders();
  const stats = computeDashboardStats(orders);
  const categories = computeTopImpulseCategories(orders, 10);
  return NextResponse.json({ stats, categories });
}
