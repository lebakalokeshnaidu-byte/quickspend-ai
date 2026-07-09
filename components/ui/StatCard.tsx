import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up-bad" | "up-good" | "down-bad" | "down-good" | "neutral";
  icon: LucideIcon;
  accent?: "purple" | "lime" | "neutral";
}

const ACCENT_STYLES = {
  purple: "text-accent-purple-bright bg-accent-purple/15",
  lime: "text-accent-lime bg-accent-lime/15",
  neutral: "text-white/70 bg-white/[0.06]",
};

const DELTA_STYLES = {
  "up-bad": "text-orange-300",
  "up-good": "text-accent-lime",
  "down-bad": "text-orange-300",
  "down-good": "text-accent-lime",
  neutral: "text-white/45",
};

export function StatCard({ label, value, delta, deltaTone = "neutral", icon: Icon, accent = "neutral" }: StatCardProps) {
  return (
    <div className="glass-panel glass-panel-hover p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-white/45">{label}</span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", ACCENT_STYLES[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-white">{value}</span>
        {delta ? <span className={cn("text-xs font-medium", DELTA_STYLES[deltaTone])}>{delta}</span> : null}
      </div>
    </div>
  );
}
