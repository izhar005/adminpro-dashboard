"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/ui/card"
import { mockOrders, type Order } from "@/lib/data"
import { chartColors, tooltipProps, axisTickStyle } from "@/lib/chart-theme"

/**
 * Revenue by product, derived from the orders rather than stored separately so
 * the two can't drift apart.
 */
const revenueByProduct = Array.from(
  mockOrders.reduce((acc, order) => {
    acc.set(order.product, (acc.get(order.product) ?? 0) + order.amount)
    return acc
  }, new Map<string, number>()),
  ([product, cents]) => ({ product, revenue: cents / 100 }),
).sort((a, b) => b.revenue - a.revenue)

export function ProductRevenueChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Revenue by Product</h3>
        <p className="text-sm text-muted-foreground">Which products actually earn</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={revenueByProduct} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number"
            tick={axisTickStyle}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(value: number) => `$${Math.round(value)}`}
          />
          <YAxis
            type="category"
            dataKey="product"
            tick={axisTickStyle}
            stroke="hsl(var(--muted-foreground))"
            width={120}
          />
          <Tooltip
            {...tooltipProps}
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(value, name) => [`$${Number(value ?? 0).toLocaleString()}`, name]}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {revenueByProduct.map((entry, index) => (
              <Cell key={entry.product} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

/** Order counts split by how the customer paid. */
const ordersByPaymentMethod = Array.from(
  mockOrders.reduce((acc, order) => {
    acc.set(order.paymentMethod, (acc.get(order.paymentMethod) ?? 0) + 1)
    return acc
  }, new Map<string, number>()),
  ([method, count]) => ({ method, count }),
).sort((a, b) => b.count - a.count)

export function PaymentMethodChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Orders by Payment Method</h3>
        <p className="text-sm text-muted-foreground">How customers are paying</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ordersByPaymentMethod} margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="method" tick={axisTickStyle} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={axisTickStyle} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <Tooltip {...tooltipProps} cursor={{ fill: "hsl(var(--muted))" }} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="count" name="Orders" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {ordersByPaymentMethod.map((entry, index) => (
              <Cell key={entry.method} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

/**
 * A funnel-style breakdown of the order pipeline.
 *
 * Ordered by how far along the pipeline each stage is, so the bars descend
 * naturally instead of being alphabetised by status name.
 */
const PIPELINE_ORDER: Order["status"][] = ["pending", "processing", "completed", "cancelled"]

const pipeline = PIPELINE_ORDER.map((status) => ({
  status,
  count: mockOrders.filter((order) => order.status === status).length,
  value: mockOrders
    .filter((order) => order.status === status)
    .reduce((sum, order) => sum + order.amount, 0) / 100,
}))

export function OrderFunnelChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Order Pipeline</h3>
        <p className="text-sm text-muted-foreground">Where every order currently sits</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={pipeline} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={axisTickStyle} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="status"
            tick={axisTickStyle}
            stroke="hsl(var(--muted-foreground))"
            width={90}
            tickFormatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
          <Tooltip
            {...tooltipProps}
            cursor={{ fill: "hsl(var(--muted))" }}
            formatter={(value, name) =>
              name === "value"
                ? [`$${Number(value ?? 0).toLocaleString()}`, "Value"]
                : [`${value}`, "Orders"]
            }
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="count" name="Orders" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {pipeline.map((entry, index) => (
              <Cell key={entry.status} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
          <Bar
            dataKey="value"
            name="Value"
            radius={[0, 6, 6, 0]}
            maxBarSize={20}
            fill="hsl(var(--muted-foreground))"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}