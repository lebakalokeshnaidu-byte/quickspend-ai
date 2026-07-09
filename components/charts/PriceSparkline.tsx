"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PriceSparkline({ history }: { history: { date: string; price: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <LineChart data={history} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
        <Tooltip
          contentStyle={{
            background: "rgba(10,12,20,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 11,
            padding: "6px 10px",
          }}
          labelFormatter={(v) => formatDate(v)}
          formatter={(value: number) => [formatCurrency(value), "Price"]}
        />
        <Line type="monotone" dataKey="price" stroke="#ff9f5a" strokeWidth={2} dot={{ r: 3, fill: "#ff9f5a" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
