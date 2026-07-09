import { NextRequest, NextResponse } from "next/server";
import { getPlatforms } from "@/lib/data";
import { mockParseReceipt } from "@/lib/mock-data";
import type { PlatformSlug } from "@/lib/types";

/**
 * TODO(real-ocr): swap mockParseReceipt for a real pipeline — e.g. upload to
 * Vercel Blob, run OCR (Google Vision / AWS Textract) on screenshots or
 * pdf-parse on invoices, then an LLM extraction pass to structure line items.
 * TODO(gmail-import): add an OAuth-gated route that pulls order confirmation
 * emails from Gmail and feeds them through the same extraction step.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const platformId = formData.get("platformId") as string | null;

  if (!file || !platformId) {
    return NextResponse.json({ error: "file and platformId are required" }, { status: 400 });
  }

  const platforms = await getPlatforms();
  const platform = platforms.find((p) => p.id === platformId);
  if (!platform) {
    return NextResponse.json({ error: "unknown platform" }, { status: 400 });
  }

  let fileUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`imports/${Date.now()}-${file.name}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      fileUrl = blob.url;
    } catch {
      // Blob upload is best-effort for this MVP — extraction still proceeds.
      fileUrl = null;
    }
  }

  const extractedItems = mockParseReceipt(platform.slug as PlatformSlug, file.name);

  return NextResponse.json({ extractedItems, fileUrl, fileName: file.name });
}
