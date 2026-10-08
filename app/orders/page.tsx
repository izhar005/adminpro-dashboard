"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrderDrawer } from "@/components/orders/OrderDrawer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrders, type Order } from "@/lib/data"
import { downloadCsv } from "@/lib/csv"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type StatusFilter = "all" | Order["status"]

const ORDER_STATUSES: Order["status"][] = ["pending", "processing", "completed", "cancelled"]

export default function OrdersPage() {
  const orders = mockOrders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  /** Derived, not stored — see the note in `users/page.tsx` for why. */
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false
      if (!query) return true

      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query)
      )
    })
  }, [orders, searchQuery, statusFilter])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setDrawerOpen(true)
  }

  /**
   * Exports exactly what's on screen, not the full list — a user who filtered to
   * "Pending" and then hits Export expects the pending rows in the file.
   */
  const handleExport = () => {
    const date = new Date().toISOString().split("T")[0]
    const scope = statusFilter === "all" ? "all" : statusFilter

    downloadCsv(`orders-${scope}-${date}.csv`, filteredOrders, [
      { key: "id", header: "Order ID" },
      { key: "customer", header: "Customer" },
      { key: "product", header: "Product" },
      { key: "amount", header: "Amount (cents)" },
      { key: "status", header: "Status" },
      { key: "paymentMethod", header: "Payment Method" },
      { key: "date", header: "Date" },
    ])
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Orders & Transactions</h1>
              <p className="text-muted-foreground">Track and manage customer orders and payments</p>
            </div>
            <Button className="gap-2" onClick={handleExport} disabled={filteredOrders.length === 0}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer, or product..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by order status">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold mt-1">{orders.length}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1 text-primary">
                ${(orders.reduce((sum, o) => sum + o.amount, 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>

          <OrdersTable orders={filteredOrders} onViewOrder={handleViewOrder} />
          <OrderDrawer order={selectedOrder} open={drawerOpen} onOpenChange={setDrawerOpen} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
