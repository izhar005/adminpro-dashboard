"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { StatCard } from "@/components/dashboard/StatCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { TrafficChart } from "@/components/dashboard/TrafficChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { dashboardStats } from "@/lib/data"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your business today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
