"use client"

import dynamic from "next/dynamic"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { StatCard } from "@/components/dashboard/StatCard"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { dashboardStats } from "@/lib/data"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Recharts is ~100 KB gzipped. Importing the charts statically put all of it in
 * the dashboard's initial payload even though the charts sit below the fold.
 * Loading them dynamically keeps it out of the first paint and splits it into a
 * chunk that only downloads when the charts are actually rendered.
 */
const ChartFallback = () => <Skeleton className="h-[350px] w-full rounded-xl" />

const RevenueChart = dynamic(
  () => import("@/components/dashboard/RevenueChart").then((m) => m.RevenueChart),
  { ssr: false, loading: ChartFallback },
)
const SalesChart = dynamic(
  () => import("@/components/dashboard/SalesChart").then((m) => m.SalesChart),
  { ssr: false, loading: ChartFallback },
)
const TrafficChart = dynamic(
  () => import("@/components/dashboard/TrafficChart").then((m) => m.TrafficChart),
  { ssr: false, loading: ChartFallback },
)

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your business today.</p>
          </div>

          {/* Stats Grid */}
          {/* `grid-cols-1` explicit, and the gap only widens at `xl` — four
              cards across a narrowed viewport (sidebar expanded) need breathing
              room rather than touching. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={dashboardStats.revenue.current}
              previousValue={dashboardStats.revenue.previous}
              trend={dashboardStats.revenue.trend}
              icon={DollarSign}
              prefix="$"
            />
            <StatCard
              title="Total Sales"
              value={dashboardStats.sales.current}
              previousValue={dashboardStats.sales.previous}
              trend={dashboardStats.sales.trend}
              icon={ShoppingCart}
            />
            <StatCard
              title="Total Customers"
              value={dashboardStats.customers.current}
              previousValue={dashboardStats.customers.previous}
              trend={dashboardStats.customers.trend}
              icon={Users}
            />
            <StatCard
              title="Conversion Rate"
              value={dashboardStats.conversion.current}
              previousValue={dashboardStats.conversion.previous}
              trend={dashboardStats.conversion.trend}
              icon={TrendingUp}
              suffix="%"
              decimals={2}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <SalesChart />
            <TrafficChart />
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
