import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orders = await getOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: "order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
