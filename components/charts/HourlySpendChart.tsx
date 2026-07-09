"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency } from "@/lib/utils";

interface HourBucket {
  hour: number;
  amount: number;
  orders: number;
}

function isLateNightHour(hour: number) {
  return hour >= 23 || hour < 5;
}

function formatHour(hour: number) {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

export function HourlySpendChart({ data }: { data: HourBucket[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="hour"
          tickFormatter={formatHour}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={2}
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
          labelFormatter={(hour: number) => formatHour(hour)}
          formatter={(value: number) => [formatCompactCurrency(value), "Spend"]}
        />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {data.map((bucket) => (
            <Cell key={bucket.hour} fill={isLateNightHour(bucket.hour) ? "#c6f135" : "#9b5cff"} fillOpacity={isLateNightHour(bucket.hour) ? 0.85 : 0.55} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
