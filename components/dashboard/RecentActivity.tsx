"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, UserPlus, TrendingUp, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "order",
    user: "Sarah Johnson",
    action: "placed a new order",
    value: "$2,499",
    time: "5 mins ago",
    icon: ShoppingBag,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 2,
    type: "user",
    user: "Michael Chen",
    action: "joined the platform",
    time: "15 mins ago",
    icon: UserPlus,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 3,
    type: "revenue",
    user: "System",
    action: "revenue milestone reached",
    value: "$100K",
    time: "1 hour ago",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    id: 4,
    type: "alert",
    user: "System",
    action: "inventory alert triggered",
    time: "2 hours ago",
    icon: AlertCircle,
    color: "bg-orange-500/10 text-orange-500",
  },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest platform activities</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-4 group">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
              {activity.value && <Badge variant="secondary">{activity.value}</Badge>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
