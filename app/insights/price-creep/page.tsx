import { ArrowUpRight, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { PlatformBadge } from "@/components/ui/Badge";
import { PriceSparkline } from "@/components/charts/PriceSparkline";
import { getOrders } from "@/lib/data";
import { computePriceCreepAlerts } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

export default async function PriceCreepPage() {
  const orders = await getOrders();
  const alerts = computePriceCreepAlerts(orders, 3);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Price Creep"
        subtitle="Items you buy repeatedly that have quietly gotten more expensive."
      />

      {alerts.length === 0 ? (
        <Card>
          <p className="text-sm text-white/40">No price creep detected yet — keep importing orders to build history.</p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {alerts.map((alert) => (
            <Card key={`${alert.platform.id}-${alert.item_name}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white/90">{alert.item_name}</p>
                  <div className="mt-1.5">
                    <PlatformBadge name={alert.platform.name} color={alert.platform.color} />
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-orange-400/25 bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                  <ArrowUpRight className="h-3 w-3" />
                  {formatPercent(alert.percent_increase, 1)}
                </span>
              </div>

              <div className="mt-4">
                <PriceSparkline history={alert.history} />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>{formatDate(alert.first_seen_at)}</span>
                <span>{formatDate(alert.latest_seen_at)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-sm">
                <div className="flex items-center gap-2 text-white/50">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {alert.occurrences} orders tracked
                </div>
                <div className="text-white/80">
                  {formatCurrency(alert.first_price)}{" "}
                  <span className="text-white/30">→</span> <span className="font-semibold text-white">{formatCurrency(alert.latest_price)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
