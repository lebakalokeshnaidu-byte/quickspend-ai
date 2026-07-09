import Link from "next/link";
import type { Order } from "@/lib/types";
import { PlatformBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Moon } from "lucide-react";

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="flex flex-col divide-y divide-white/[0.06]">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders?highlight=${order.id}`}
          className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:opacity-80"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <PlatformBadge name={order.platform.name} color={order.platform.color} />
              {order.is_late_night ? <Moon className="h-3.5 w-3.5 text-accent-purple-bright" /> : null}
            </div>
            <p className="mt-1.5 truncate text-xs text-white/40">
              {formatDateTime(order.ordered_at)} · {order.item_count} items
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-white">{formatCurrency(order.total_amount)}</span>
        </Link>
      ))}
    </div>
  );
}
