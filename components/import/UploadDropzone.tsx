"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadDropzone({
  onFileSelected,
  file,
}: {
  onFileSelected: (file: File) => void;
  file: File | null;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFileSelected(dropped);
  }

  const isPdf = file?.type === "application/pdf";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
        isDragging
          ? "border-accent-purple bg-accent-purple/[0.06]"
          : "border-white/[0.12] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) onFileSelected(selected);
        }}
      />
      {file ? (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-lime/15 text-accent-lime">
            {isPdf ? <FileText className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
          </div>
          <p className="mt-3 text-sm font-medium text-white">{file.name}</p>
          <p className="mt-1 text-xs text-white/40">{(file.size / 1024).toFixed(0)} KB · click to replace</p>
        </>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-purple/15 text-accent-purple-bright">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-white/85">Drop a screenshot or PDF invoice</p>
          <p className="mt-1 text-xs text-white/40">or click to browse · PNG, JPG, PDF</p>
        </>
      )}
    </div>
  );
}
