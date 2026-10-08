"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useApp,
  type Notification,
  type NotificationType,
} from "@/contexts/AppContext"
import { cn } from "@/lib/utils"
import { relativeTime, formatDateTime } from "@/lib/relative-time"
import { useHasMounted } from "@/lib/use-has-mounted"
import {
  CheckCheck,
  CheckCircle2,
  CircleAlert,
  Info,
  Inbox,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Filter = "all" | "unread" | "read"

/**
 * Colour + icon per notification type.
 *
 * Tailwind's `dark:` variant is the only one this project has, so these are
 * written as base + `dark:` overrides rather than paired light/dark classes.
 */
const TYPE_STYLES: Record<
  NotificationType,
  { icon: LucideIcon; container: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    container: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  error: {
    icon: CircleAlert,
    container: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  warning: {
    icon: TriangleAlert,
    container: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    container: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
]

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    removeNotification,
    clearAllNotifications,
  } = useApp()

  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [confirmClear, setConfirmClear] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const counts = useMemo(
    () => ({
      all: notifications.length,
      unread: unreadCount,
      read: notifications.length - unreadCount,
    }),
    [notifications.length, unreadCount],
  )

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    return notifications.filter((n) => {
      if (filter === "unread" && n.read) return false
      if (filter === "read" && !n.read) return false
      if (!term) return true
      return (
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term)
      )
    })
  }, [notifications, filter, search])

  const handleClearAll = () => {
    clearAllNotifications()
    setConfirmClear(false)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Everything the app has raised for you, newest first.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                onClick={markAllNotificationsRead}
                disabled={unreadCount === 0}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmClear(true)}
                disabled={notifications.length === 0}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </Button>
            </div>
          </div>

          {/* Counts + filter. Derived from state rather than hardcoded, so the
              badges stay correct after marking or clearing. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                  className="gap-2"
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs tabular-nums",
                      filter === option.value
                        ? "bg-primary-foreground/20"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {counts[option.value]}
                  </span>
                </Button>
              ))}
            </div>

            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
                aria-label="Search notifications"
                className="h-10 rounded-xl border-0 bg-accent/50 pl-10 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <Card className="overflow-hidden">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <Inbox className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Nothing here</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notifications.length === 0
                      ? "You have no notifications yet."
                      : "No notifications match this filter."}
                  </p>
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilter("all")
                      setSearch("")
                    }}
                  >
                    Reset filters
                  </Button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {visible.map((notification) => {
                  const style = TYPE_STYLES[notification.type]
                  const Icon = style.icon

                  return (
                    <li key={notification.id}>
                      <NotificationRow
                        notification={notification}
                        icon={Icon}
                        containerClass={style.container}
                        iconClass={style.iconColor}
                        onToggleRead={() =>
                          notification.read
                            ? markNotificationUnread(notification.id)
                            : markNotificationRead(notification.id)
                        }
                        onRemove={() => removeNotification(notification.id)}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          {notifications.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {visible.length} of {notifications.length} notifications
              {unreadCount > 0 && ` · ${unreadCount} unread`}
            </p>
          )}
        </div>
      </DashboardLayout>

      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear all notifications?</DialogTitle>
            <DialogDescription>
              This removes all {notifications.length} notifications from this
              device. It cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Clear all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}

interface NotificationRowProps {
  notification: Notification
  icon: LucideIcon
  containerClass: string
  iconClass: string
  onToggleRead: () => void
  onRemove: () => void
}

function NotificationRow({
  notification,
  icon: Icon,
  containerClass,
  iconClass,
  onToggleRead,
  onRemove,
}: NotificationRowProps) {
  // `relativeTime` reads the wall clock, and the server and client renders are
  // milliseconds apart — enough for a notification sitting near the "just now" /
  // "1 min ago" boundary to render two different strings. Render the absolute
  // date until hydration completes, then switch to the relative label.
  const hasMounted = useHasMounted()

  return (
    // `group` so the hover-revealed actions stay out of the way until the row
    // is actually under the cursor. `focus-within` does the same for keyboard
    // users, who can't hover.
    <div
      className={cn(
        "group flex items-start gap-4 p-4 transition-colors hover:bg-accent/40 focus-within:bg-accent/40 sm:p-5",
        !notification.read && "bg-primary/[0.04]",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          containerClass,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-5 w-5", iconClass)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "text-sm leading-tight",
              notification.read ? "font-medium" : "font-semibold",
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
          )}
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>

        <p className="mt-2 text-xs text-muted-foreground" title={formatDateTime(notification.createdAt)}>
          {hasMounted ? relativeTime(notification.createdAt) : formatDateTime(notification.createdAt)}
        </p>
      </div>

      {/* Always visible on touch — there is no hover to reveal them there. */}
      <div className="flex shrink-0 items-center gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRead}
          aria-label={notification.read ? "Mark as unread" : "Mark as read"}
          title={notification.read ? "Mark as unread" : "Mark as read"}
          className="h-9 w-9"
        >
          <CheckCheck className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label="Delete notification"
          title="Delete notification"
          className="h-9 w-9 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
