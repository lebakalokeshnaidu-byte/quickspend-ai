"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Platform } from "@/lib/types";
import { formatCompactCurrency } from "@/lib/utils";

interface Slice {
  platform: Platform;
  amount: number;
  orders: number;
}

export function PlatformBreakdownChart({ data }: { data: Slice[] }) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <ResponsiveContainer width={160} height={160} className="shrink-0">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="platform.name"
            innerRadius={50}
            outerRadius={78}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.platform.id} fill={slice.platform.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(10,12,20,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value: number, _name: unknown, entry: { payload?: Slice }) => [
              formatCompactCurrency(value),
              entry?.payload?.platform.name ?? "",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex w-full flex-col gap-2.5">
        {data.map((slice) => (
          <div key={slice.platform.id} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.platform.color }} />
              {slice.platform.name}
              <span className="text-xs text-white/30">· {slice.orders} orders</span>
            </div>
            <span className="font-medium text-white">{formatCompactCurrency(slice.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
