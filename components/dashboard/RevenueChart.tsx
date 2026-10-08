"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { revenueData } from "@/lib/data"
import { chartColors, tooltipProps, axisTickStyle } from "@/lib/chart-theme"

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
              <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors[1]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColors[1]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
          <XAxis
            dataKey="month"
            tick={axisTickStyle}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--border))"
          />
          <YAxis
            tick={axisTickStyle}
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--border))"
            tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
          />
          <Tooltip {...tooltipProps} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={chartColors[0]}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={chartColors[1]}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}