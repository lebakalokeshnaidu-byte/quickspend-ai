import { PageHeader } from "@/components/layout/PageHeader";
import { OrdersExplorer } from "@/components/orders/OrdersExplorer";
import { getOrders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ highlight?: string }>;
}) {
  const [orders, params] = await Promise.all([getOrders(), searchParams]);
  const totalSpend = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} orders · ${formatCurrency(totalSpend)} total spend`}
      />
      <OrdersExplorer orders={orders} highlightId={params.highlight} />
    </div>
  );
}
