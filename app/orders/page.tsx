"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrderDrawer } from "@/components/orders/OrderDrawer"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrders, type Order } from "@/lib/data"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterOrders(query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterOrders(searchQuery, status)
  }

  const filterOrders = (query: string, status: string) => {
    let filtered = orders

    if (query) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.customer.toLowerCase().includes(query.toLowerCase()) ||
          order.product.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status)
    }

    setFilteredOrders(filtered)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setDrawerOpen(true)
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
            <Button className="gap-2">
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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
