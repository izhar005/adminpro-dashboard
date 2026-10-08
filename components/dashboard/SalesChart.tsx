"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { salesByCategory } from "@/lib/data"
import { chartColors, tooltipProps } from "@/lib/chart-theme"

export function SalesChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Sales by Category</h3>
        <p className="text-sm text-muted-foreground">Product category distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={salesByCategory}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {salesByCategory.map((entry, index) => (
              // Colors come from the theme tokens rather than a hardcoded hex on
              // the data, so the slices follow light/dark mode.
              <Cell key={`cell-${entry.name}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipProps}
            formatter={(value, name) => [`${Number(value ?? 0)}%`, String(name)]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}