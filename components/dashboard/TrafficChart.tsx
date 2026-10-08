"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { trafficData } from "@/lib/data"
import { chartColors, tooltipProps, axisTickStyle } from "@/lib/chart-theme"

export function TrafficChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Website Traffic</h3>
        <p className="text-sm text-muted-foreground">Hourly visitor analytics</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trafficData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
          <XAxis
            dataKey="time"
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
          />
          <Tooltip
            {...tooltipProps}
            cursor={{ fill: "hsl(var(--accent))", opacity: 0.5 }}
          />
          <Bar dataKey="visitors" fill={chartColors[0]} radius={[8, 8, 0, 0]} name="Visitors" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}