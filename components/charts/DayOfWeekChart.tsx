"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency } from "@/lib/utils";

interface DayBucket {
  day: string;
  amount: number;
  orders: number;
}

export function DayOfWeekChart({ data }: { data: DayBucket[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
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
          formatter={(value: number) => [formatCompactCurrency(value), "Spend"]}
        />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#b083ff" fillOpacity={0.75} />
      </BarChart>
    </ResponsiveContainer>
  );
}
