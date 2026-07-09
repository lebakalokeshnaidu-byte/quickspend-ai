import { Flame, Wallet, Percent } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ImpulseCategories } from "@/components/dashboard/ImpulseCategories";
import { PlatformBadge } from "@/components/ui/Badge";
import { getOrders } from "@/lib/data";
import {
  computeDashboardStats,
  computeImpulseTaxByPlatform,
  computeTopImpulseCategories,
  computeTopImpulseItems,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function ImpulseTaxPage() {
  const orders = await getOrders();
  const stats = computeDashboardStats(orders);
  const categories = computeTopImpulseCategories(orders, 8);
  const byPlatform = computeImpulseTaxByPlatform(orders);
  const topItems = computeTopImpulseItems(orders, 8);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Impulse Tax"
        subtitle="The premium you pay for unplanned, in-the-moment purchases."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Impulse Tax %" value={`${stats.impulseTaxPercent.toFixed(1)}%`} icon={Percent} accent="lime" />
        <StatCard label="Impulse Spend" value={formatCurrency(stats.impulseSpend)} icon={Flame} accent="purple" />
        <StatCard label="Total Spend" value={formatCurrency(stats.totalSpend)} icon={Wallet} accent="neutral" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="By category" subtitle="Where impulse spend concentrates" />
          <ImpulseCategories categories={categories} />
        </Card>
        <Card>
          <CardHeader title="By platform" subtitle="Which app tempts you most" />
          <div className="flex flex-col gap-4">
            {byPlatform.map((row) => (
              <div key={row.platform.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <PlatformBadge name={row.platform.name} color={row.platform.color} />
                  <span className="font-medium text-white">{row.impulseTaxPercent.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(row.impulseTaxPercent, 100)}%`,
                      backgroundColor: row.platform.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Top impulse items" subtitle="Your most frequent unplanned buys" />
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {topItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm text-white/85">{item.name}</p>
                <p className="mt-0.5 text-xs text-white/35">{item.category} · ordered {item.count}×</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-white">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
