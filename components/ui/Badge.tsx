import type { ClassificationLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

const CLASSIFICATION_STYLES: Record<ClassificationLabel, string> = {
  "Planned Grocery": "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  "Impulse Buy": "bg-accent-purple/15 text-accent-purple-bright border-accent-purple/30",
  "Junk/Snack": "bg-orange-400/10 text-orange-300 border-orange-400/20",
  "Recurring Staple": "bg-accent-lime/15 text-accent-lime border-accent-lime/30",
  "Household Need": "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Unclear: "bg-white/[0.06] text-white/50 border-white/10",
};

export function ClassificationBadge({ label, className }: { label: ClassificationLabel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        CLASSIFICATION_STYLES[label],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function PlatformBadge({ name, color, className }: { name: string; color: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}
