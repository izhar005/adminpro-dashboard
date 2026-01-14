"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { salesByCategory } from "@/lib/data"

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
          >
            {salesByCategory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(var(--card))",
              border: "1px solid oklch(var(--border))",
              borderRadius: "0.75rem",
              padding: "8px 12px",
            }}
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
