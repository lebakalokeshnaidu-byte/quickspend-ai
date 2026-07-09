"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatDate } from "@/lib/utils";

interface Point {
  date: string;
  amount: number;
}

export function SpendTrendChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9b5cff" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#9b5cff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDate(v).replace(/,.*/, "")}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(v) => formatCompactCurrency(v)}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(10,12,20,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          formatter={(value: number) => [formatCompactCurrency(value), "Spend"]}
          labelFormatter={(v) => formatDate(v)}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#b083ff"
          strokeWidth={2}
          fill="url(#spendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
