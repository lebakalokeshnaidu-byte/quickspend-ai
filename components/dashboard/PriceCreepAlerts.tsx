import type { PriceCreepAlert } from "@/lib/types";
import { PlatformBadge } from "@/components/ui/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function PriceCreepAlerts({ alerts }: { alerts: PriceCreepAlert[] }) {
  if (alerts.length === 0) {
    return <p className="text-sm text-white/40">No price creep detected on your repeat items yet.</p>;
  }
  return (
    <div className="flex flex-col divide-y divide-white/[0.06]">
      {alerts.map((alert) => (
        <div key={`${alert.platform.id}-${alert.item_name}`} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="truncate text-sm text-white/85">{alert.item_name}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <PlatformBadge name={alert.platform.name} color={alert.platform.color} />
              <span className="text-xs text-white/35">
                {formatCurrency(alert.first_price)} → {formatCurrency(alert.latest_price)}
              </span>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-orange-400/25 bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
            <ArrowUpRight className="h-3 w-3" />
            {formatPercent(alert.percent_increase, 1)}
          </span>
        </div>
      ))}
    </div>
  );
}
