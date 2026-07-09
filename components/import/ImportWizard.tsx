"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import type { ExtractedItem, ImportJob, Platform } from "@/lib/types";
import { PlatformSelector } from "@/components/import/PlatformSelector";
import { UploadDropzone } from "@/components/import/UploadDropzone";
import { ExtractedItemsTable } from "@/components/import/ExtractedItemsTable";
import { Button } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/Badge";
import { formatDateTime, formatCurrency } from "@/lib/utils";

type Step = "select" | "processing" | "review" | "saved";

export function ImportWizard({ platforms, recentJobs }: { platforms: Platform[]; recentJobs: ImportJob[] }) {
  const [step, setStep] = useState<Step>("select");
  const [platformId, setPlatformId] = useState<string | null>(platforms[0]?.id ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<ExtractedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedOrderTotal, setSavedOrderTotal] = useState(0);

  const selectedPlatform = platforms.find((p) => p.id === platformId) ?? null;

  async function handleProcess() {
    if (!file || !platformId) {
      setError("Pick a platform and a file first.");
      return;
    }
    setError(null);
    setStep("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("platformId", platformId);
      const res = await fetch("/api/import", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Extraction failed");
      const data = await res.json();
      setItems(data.extractedItems);
      setStep("review");
    } catch (e) {
      setError("Couldn't process this file. Try again.");
      setStep("select");
    }
  }

  async function handleSave() {
    if (!platformId) return;
    const res = await fetch("/api/import/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platformId, fileName: file?.name ?? "manual-entry", items }),
    });
    const data = await res.json();
    setSavedOrderTotal(items.reduce((s, it) => s + it.unit_price * it.quantity, 0));
    setStep("saved");
    void data;
  }

  function reset() {
    setStep("select");
    setFile(null);
    setItems([]);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-5 sm:p-6">
        {step === "select" || step === "processing" ? (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2.5 text-sm font-medium text-white/85">1. Select platform</p>
              <PlatformSelector platforms={platforms} selected={platformId} onSelect={setPlatformId} />
            </div>
            <div>
              <p className="mb-2.5 text-sm font-medium text-white/85">2. Upload invoice or screenshot</p>
              <UploadDropzone file={file} onFileSelected={setFile} />
            </div>
            {error ? <p className="text-sm text-orange-300">{error}</p> : null}
            <Button onClick={handleProcess} disabled={step === "processing" || !file} className="self-start">
              {step === "processing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Extracting items…
                </>
              ) : (
                <>
                  Process with mock OCR <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-white/30">
              TODO(real-ocr): this MVP uses a deterministic mock parser instead of real OCR. Swap in
              Vision/Textract + LLM extraction here for production.
            </p>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/85">3. Review & edit extracted items</p>
              {selectedPlatform ? <PlatformBadge name={selectedPlatform.name} color={selectedPlatform.color} /> : null}
            </div>
            <ExtractedItemsTable items={items} onChange={setItems} />
            <div className="flex gap-3">
              <Button onClick={handleSave}>
                Save to orders <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button variant="secondary" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Start over
              </Button>
            </div>
          </div>
        ) : null}

        {step === "saved" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-lime/15 text-accent-lime">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-base font-medium text-white">Order saved — {formatCurrency(savedOrderTotal)}</p>
            <p className="max-w-sm text-sm text-white/45">
              Items were classified and added to your orders. Insights will refresh on next load.
            </p>
            <div className="mt-2 flex gap-3">
              <Link href="/orders">
                <Button variant="secondary">View orders</Button>
              </Link>
              <Button onClick={reset}>Import another</Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="glass-panel p-5 sm:p-6">
        <p className="mb-4 text-sm font-medium text-white/85">Recent imports</p>
        {recentJobs.length === 0 ? (
          <p className="text-sm text-white/40">No imports yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white/80">{job.file_name}</p>
                  <p className="mt-0.5 text-xs text-white/35">{formatDateTime(job.created_at)}</p>
                </div>
                <span className="shrink-0 rounded-full border border-accent-lime/25 bg-accent-lime/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-lime">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
