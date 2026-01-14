"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { trafficData } from "@/lib/data"

export function TrafficChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Website Traffic</h3>
        <p className="text-sm text-muted-foreground">Hourly visitor analytics</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trafficData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(var(--card))",
              border: "1px solid oklch(var(--border))",
              borderRadius: "0.75rem",
              padding: "8px 12px",
            }}
            cursor={{ fill: "oklch(var(--accent))" }}
          />
          <Bar dataKey="visitors" fill="oklch(0.73 0.12 199)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
