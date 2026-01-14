"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { Order } from "@/lib/data"
import { cn } from "@/lib/utils"

interface OrdersTableProps {
  orders: Order[]
  onViewOrder: (order: Order) => void
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-accent/50 transition-colors">
              <TableCell>
                <p className="font-mono font-medium text-sm">{order.id}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium">{order.customer}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm">{order.product}</p>
              </TableCell>
              <TableCell>
                <p className="font-semibold">${(order.amount / 100).toFixed(2)}</p>
              </TableCell>
              <TableCell>
                <Badge className={cn("capitalize", statusColors[order.status])}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">{order.date}</p>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewOrder(order)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
