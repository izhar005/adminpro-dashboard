"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { revenueData } from "@/lib/data"

export function RevenueChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground">Monthly revenue and expenses comparison</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.73 0.12 199)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.73 0.12 199)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.18 30)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.18 30)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(var(--card))",
              border: "1px solid oklch(var(--border))",
              borderRadius: "0.75rem",
              padding: "8px 12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.73 0.12 199)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="oklch(0.65 0.18 30)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
