import { Moon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { HourlySpendChart } from "@/components/charts/HourlySpendChart";
import { DayOfWeekChart } from "@/components/charts/DayOfWeekChart";
import { PlatformBadge } from "@/components/ui/Badge";
import { getOrders } from "@/lib/data";
import { computeTimePatterns } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function TimePatternsPage() {
  const orders = await getOrders();
  const { byHour, byDayOfWeek } = computeTimePatterns(orders);
  const lateNightOrders = orders
    .filter((o) => o.is_late_night)
    .sort((a, b) => b.ordered_at.localeCompare(a.ordered_at));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Time Patterns"
        subtitle="When you actually order — and how late-night ordering shows up in your spend."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Spend by hour of day" subtitle="Lime bars mark the 11pm–5am danger zone" />
          <HourlySpendChart data={byHour} />
        </Card>
        <Card>
          <CardHeader title="Spend by day of week" />
          <DayOfWeekChart data={byDayOfWeek} />
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Late night orders"
          subtitle={`${lateNightOrders.length} orders placed between 11pm and 5am`}
        />
        {lateNightOrders.length === 0 ? (
          <p className="text-sm text-white/40">No late night orders in this period.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {lateNightOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <Moon className="h-4 w-4 shrink-0 text-accent-purple-bright" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <PlatformBadge name={order.platform.name} color={order.platform.color} />
                    </div>
                    <p className="mt-1 truncate text-xs text-white/40">{formatDateTime(order.ordered_at)}</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-white">{formatCurrency(order.total_amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
