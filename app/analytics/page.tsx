"use client"

import dynamic from "next/dynamic"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { StatCard } from "@/components/dashboard/StatCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockOrders } from "@/lib/data"
import { downloadCsv } from "@/lib/csv"
import {
  ArrowRight,
  DollarSign,
  Receipt,
  ShoppingCart,
  Target,
} from "lucide-react"

// Same reasoning as the dashboard: recharts is heavy and these sit below the fold.
const ChartFallback = () => <Skeleton className="h-[350px] w-full rounded-xl" />

const ProductRevenueChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((m) => m.ProductRevenueChart),
  { ssr: false, loading: ChartFallback },
)
const PaymentMethodChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((m) => m.PaymentMethodChart),
  { ssr: false, loading: ChartFallback },
)
const OrderFunnelChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((m) => m.OrderFunnelChart),
  { ssr: false, loading: ChartFallback },
)

/** The previous period is defined as the first half vs second half of the data. */
function halfStats(orders: typeof mockOrders) {
  const midpoint = Math.floor(orders.length / 2)
  const sum = (list: typeof orders) => list.reduce((total, o) => total + o.amount, 0) / 100
  const count = (list: typeof orders) => list.length

  const current = orders.slice(midpoint)
  const previous = orders.slice(0, midpoint)

  return {
    currentRevenue: sum(current),
    previousRevenue: sum(previous),
    currentOrders: count(current),
    previousOrders: count(previous),
  }
}

export default function AnalyticsPage() {
  const half = halfStats(mockOrders)

  const revenue = mockOrders.reduce((total, order) => total + order.amount, 0) / 100
  const completed = mockOrders.filter((order) => order.status === "completed")
  const completedRevenue = completed.reduce((total, order) => total + order.amount, 0) / 100
  const averageOrderValue = revenue / mockOrders.length
  const completionRate = (completed.length / mockOrders.length) * 100

  // Ranking customers by lifetime value is the kind of thing a buyer will
  // immediately want, so the list ships with the page.
  const topCustomers = Array.from(
    mockOrders.reduce((acc, order) => {
      const existing = acc.get(order.customer)
      acc.set(order.customer, (existing ?? 0) + order.amount / 100)
      return acc
    }, new Map<string, number>()),
  )
    .map(([customer, value]) => ({ customer, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const handleExport = () => {
    const date = new Date().toISOString().split("T")[0]
    downloadCsv(`analytics-top-customers-${date}.csv`, topCustomers, [
      { key: "customer", header: "Customer" },
      { key: "value", header: "Lifetime Value (USD)" },
    ])
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Every figure below is computed from the orders dataset — swap the source and the
              whole page follows.
            </p>
          </div>

          {/* Matches the dashboard grid — see the note there. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6 lg:grid-cols-4">
            <StatCard
              title="Gross Revenue"
              value={revenue}
              previousValue={half.previousRevenue}
              trend={half.currentRevenue >= half.previousRevenue ? "up" : "down"}
              icon={DollarSign}
              prefix="$"
              decimals={2}
            />
            <StatCard
              title="Average Order Value"
              value={averageOrderValue}
              previousValue={half.previousRevenue / half.previousOrders}
              trend={half.currentRevenue / half.currentOrders >= half.previousRevenue / half.previousOrders ? "up" : "down"}
              icon={Receipt}
              prefix="$"
              decimals={2}
            />
            <StatCard
              title="Completion Rate"
              value={completionRate}
              previousValue={75}
              trend={completionRate >= 75 ? "up" : "down"}
              icon={Target}
              suffix="%"
              decimals={1}
            />
            <StatCard
              title="Recognized Revenue"
              value={completedRevenue}
              previousValue={revenue * 0.7}
              trend={completedRevenue >= revenue * 0.7 ? "up" : "down"}
              icon={ShoppingCart}
              prefix="$"
              decimals={2}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <ProductRevenueChart />
            </div>
            <OrderFunnelChart />
            <PaymentMethodChart />
          </div>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Top Customers by Lifetime Value</h3>
                <p className="text-sm text-muted-foreground">
                  Ranked across all {mockOrders.length} orders
                </p>
              </div>
              <Button variant="outline" onClick={handleExport} className="gap-2">
                Export CSV
              </Button>
            </div>

            <div className="space-y-2">
              {topCustomers.map((entry, index) => {
                const share = (entry.value / topCustomers[0].value) * 100

                return (
                  <div
                    key={entry.customer}
                    className="flex items-center gap-4 rounded-lg px-2 py-2 hover:bg-accent/50 transition-colors"
                  >
                    <span className="w-6 text-sm font-semibold text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium">{entry.customer}</span>
                    <div className="hidden sm:block w-40 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <span className="w-24 text-right text-sm font-medium tabular-nums">
                      ${entry.value.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="w-16 justify-center tabular-nums">
                      {share.toFixed(0)}%
                    </Badge>
                  </div>
                )
              })}
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3" />
              Replace <code className="font-mono">mockOrders</code> with a database query and
              every chart, stat and rank on this page updates from the same source.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}