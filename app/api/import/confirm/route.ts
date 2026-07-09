import { NextRequest, NextResponse } from "next/server";
import { saveImportJob } from "@/lib/data";
import type { ExtractedItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    platformId: string;
    fileName: string;
    fileUrl?: string | null;
    items: ExtractedItem[];
  };

  if (!body.platformId || !body.items?.length) {
    return NextResponse.json({ error: "platformId and items are required" }, { status: 400 });
  }

  const result = await saveImportJob({
    platform_id: body.platformId,
    file_name: body.fileName,
    file_url: body.fileUrl ?? null,
    items: body.items,
  });

  return NextResponse.json(result);
}
