import type { RecurringItem } from "@/lib/types";
import { PlatformBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

export function RecurringSuggestions({ items }: { items: RecurringItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-white/40">Keep ordering — we&apos;ll surface repeat baskets once patterns emerge.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-white/85">{item.item_name}</p>
            <RefreshCw className="h-3.5 w-3.5 shrink-0 text-accent-lime" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <PlatformBadge name={item.platform.name} color={item.platform.color} />
            <span className="text-xs text-white/35">every ~{item.frequency_days}d</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-white/40">Next expected {formatDate(item.next_expected_at)}</span>
            <span className="font-medium text-white/80">{formatCurrency(item.avg_price)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
