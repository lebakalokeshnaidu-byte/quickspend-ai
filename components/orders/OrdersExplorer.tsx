"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Moon, Search } from "lucide-react";
import type { Order } from "@/lib/types";
import { PlatformBadge, ClassificationBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { PLATFORM_LIST } from "@/lib/mock-data";

export function OrdersExplorer({ orders, highlightId }: { orders: Order[]; highlightId?: string }) {
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(highlightId ?? null);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => platformFilter === "all" || o.platform.slug === platformFilter)
      .filter((o) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return o.items.some((it) => it.name.toLowerCase().includes(q));
      })
      .sort((a, b) => b.ordered_at.localeCompare(a.ordered_at));
  }, [orders, platformFilter, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPlatformFilter("all")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              platformFilter === "all"
                ? "border-white/20 bg-white/[0.1] text-white"
                : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white/80",
            )}
          >
            All platforms
          </button>
          {PLATFORM_LIST.map((p) => (
            <button
              key={p.slug}
              onClick={() => setPlatformFilter(p.slug)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                platformFilter === p.slug
                  ? "border-white/20 bg-white/[0.1] text-white"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white/80",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-accent-purple/50 focus:outline-none sm:w-56"
          />
        </div>
      </div>

      <div className="glass-panel divide-y divide-white/[0.06] overflow-hidden p-0">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-white/40">No orders match these filters.</p>
        ) : (
          filtered.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className={cn(order.id === highlightId && "bg-accent-purple/[0.06]")}>
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PlatformBadge name={order.platform.name} color={order.platform.color} />
                    {order.is_late_night ? <Moon className="h-3.5 w-3.5 shrink-0 text-accent-purple-bright" /> : null}
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white/85">
                        {order.items.map((i) => i.name).join(", ")}
                      </p>
                      <p className="mt-0.5 text-xs text-white/35">
                        {formatDateTime(order.ordered_at)} · {order.item_count} items
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-white">{formatCurrency(order.total_amount)}</span>
                    <ChevronDown className={cn("h-4 w-4 text-white/40 transition-transform", isOpen && "rotate-180")} />
                  </div>
                </button>
                {isOpen ? (
                  <div className="border-t border-white/[0.06] bg-black/20 px-5 py-4">
                    <div className="flex flex-col gap-2.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-white/75">
                              {item.name} <span className="text-white/30">× {item.quantity}</span>
                            </span>
                            <ClassificationBadge label={item.classification} />
                          </div>
                          <span className="shrink-0 text-white/70">
                            {formatCurrency(item.unit_price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
