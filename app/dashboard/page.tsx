import { Wallet, Flame, Percent, Moon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { SpendTrendChart } from "@/components/charts/SpendTrendChart";
import { PlatformBreakdownChart } from "@/components/charts/PlatformBreakdownChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { ImpulseCategories } from "@/components/dashboard/ImpulseCategories";
import { PriceCreepAlerts } from "@/components/dashboard/PriceCreepAlerts";
import { RecurringSuggestions } from "@/components/dashboard/RecurringSuggestions";
import { getOrders, getRecurringItems } from "@/lib/data";
import {
  computeDashboardStats,
  computePlatformBreakdown,
  computePriceCreepAlerts,
  computeSpendTrend,
  computeTopImpulseCategories,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const [orders, recurringItems] = await Promise.all([getOrders(), getRecurringItems()]);

  const stats = computeDashboardStats(orders);
  const spendTrend = computeSpendTrend(orders);
  const platformBreakdown = computePlatformBreakdown(orders);
  const impulseCategories = computeTopImpulseCategories(orders);
  const priceCreepAlerts = computePriceCreepAlerts(orders).slice(0, 4);
  const recentOrders = [...orders]
    .sort((a, b) => b.ordered_at.localeCompare(a.ordered_at))
    .slice(0, 6);
  const recurringSuggestions = recurringItems.slice(0, 4);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Your quick-commerce spend across Blinkit, Zepto, Instamart & BigBasket."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Spend"
          value={formatCurrency(stats.totalSpend)}
          delta={formatPercent(stats.spendChangePercent, 1)}
          deltaTone={stats.spendChangePercent > 0 ? "up-bad" : "down-good"}
          icon={Wallet}
          accent="purple"
        />
        <StatCard
          label="Impulse Spend"
          value={formatCurrency(stats.impulseSpend)}
          icon={Flame}
          accent="purple"
        />
        <StatCard
          label="Impulse Tax %"
          value={`${stats.impulseTaxPercent.toFixed(1)}%`}
          delta={stats.impulseTaxPercent > 25 ? "High" : "Healthy"}
          deltaTone={stats.impulseTaxPercent > 25 ? "up-bad" : "down-good"}
          icon={Percent}
          accent="lime"
        />
        <StatCard
          label="Late Night Orders"
          value={String(stats.lateNightOrderCount)}
          delta={`of ${stats.totalOrderCount} total`}
          icon={Moon}
          accent="neutral"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Spend trend" subtitle="Daily spend across all platforms" />
          <SpendTrendChart data={spendTrend} />
        </Card>
        <Card>
          <CardHeader title="Platform breakdown" subtitle="Share of total spend" />
          <PlatformBreakdownChart data={platformBreakdown} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top impulse categories" subtitle="Where the unplanned money goes" />
          <ImpulseCategories categories={impulseCategories} />
        </Card>
        <Card>
          <CardHeader title="Price creep alerts" subtitle="Same item, creeping price on the same platform" />
          <PriceCreepAlerts alerts={priceCreepAlerts} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent orders" />
          <RecentOrders orders={recentOrders} />
        </Card>
        <Card>
          <CardHeader title="Recurring basket suggestions" subtitle="Order before you run out" />
          <RecurringSuggestions items={recurringSuggestions} />
        </Card>
      </div>
    </div>
  );
}
