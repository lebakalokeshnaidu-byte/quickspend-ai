import { NextResponse } from "next/server";
import { getRecurringItems } from "@/lib/data";

export async function GET() {
  const items = await getRecurringItems();
  return NextResponse.json({ items });
}
