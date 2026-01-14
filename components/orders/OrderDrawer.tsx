"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/data"
import { Package, CreditCard, Calendar, User, MapPin, CheckCircle, Clock, XCircle, Loader } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderDrawerProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
}

const statusIcons = {
  pending: Clock,
  processing: Loader,
  completed: CheckCircle,
  cancelled: XCircle,
}

const timeline = [
  { status: "pending", label: "Order Placed", time: "2024-01-15 10:30 AM" },
  { status: "processing", label: "Processing", time: "2024-01-15 11:00 AM" },
  { status: "completed", label: "Completed", time: "2024-01-15 14:30 PM" },
]

export function OrderDrawer({ order, open, onOpenChange }: OrderDrawerProps) {
  if (!order) return null

  const StatusIcon = statusIcons[order.status]
  const currentStatusIndex = ["pending", "processing", "completed"].indexOf(order.status)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>View complete order information and status timeline</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold">{order.id}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={cn("capitalize gap-1.5", statusColors[order.status])}>
                <StatusIcon className="h-3 w-3" />
                {order.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Order Timeline */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Order Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const Icon = statusIcons[item.status as keyof typeof statusIcons]

                return (
                  <div key={item.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className={cn("w-0.5 h-12 transition-colors", isCompleted ? "bg-primary" : "bg-border")} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={cn("font-medium", isCurrent && "text-primary")}>{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Customer Information
            </h3>
            <div className="space-y-3 rounded-lg bg-accent/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{order.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{order.customer.toLowerCase().replace(" ", ".")}@company.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                <p className="font-medium flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span>123 Business St, Suite 100, San Francisco, CA 94105</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Order Details
            </h3>
            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-medium text-right">{order.product}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">1</p>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <p className="font-semibold">Total Amount</p>
                <p className="font-bold text-primary">${(order.amount / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment Information
            </h3>
            <div className="space-y-3 rounded-lg bg-accent/50 p-4">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Transaction Date</p>
                <p className="font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {order.date}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Process Order</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Print Invoice
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
