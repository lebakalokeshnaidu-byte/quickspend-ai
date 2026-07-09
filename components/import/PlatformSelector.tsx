"use client";

import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PlatformSelector({
  platforms,
  selected,
  onSelect,
}: {
  platforms: Platform[];
  selected: string | null;
  onSelect: (platformId: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {platforms.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
            selected === p.id
              ? "border-white/25 bg-white/[0.1] text-white"
              : "border-white/10 bg-white/[0.02] text-white/55 hover:text-white/85",
          )}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}
        </button>
      ))}
    </div>
  );
}
