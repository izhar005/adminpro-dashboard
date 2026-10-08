"use client"

import { useState } from "react"
import { Search, Bell, Moon, Sun, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useApp } from "@/contexts/AppContext"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { formatDateTime, relativeTime } from "@/lib/relative-time"
import { useHasMounted } from "@/lib/use-has-mounted"
import { SIDEBAR_OFFSET_CLASS } from "@/lib/sidebar-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { notifications, markNotificationRead, markAllNotificationsRead, settings } =
    useApp()
  const { user, logout } = useAuth()
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  // The bell's relative labels read the wall clock, so they can only be computed
  // once the client has hydrated. See the note in `lib/relative-time.ts`.
  const hasMounted = useHasMounted()

  const unreadCount = notifications.filter((n) => !n.read).length
  const isCollapsed = settings.sidebarCollapsed

  const userInitials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border",
        // Offsets come from the shared sidebar geometry so the header can never
        // slide under the rail or leave a gap.
        "left-0 transition-[left] duration-300 ease-in-out",
        isCollapsed ? SIDEBAR_OFFSET_CLASS.collapsed : SIDEBAR_OFFSET_CLASS.expanded,
      )}
    >
      {/* `min-w-0` on the search wrapper is what stops the placeholder from being
          clipped: as a flex child it will otherwise refuse to shrink below its
          content width when the sidebar toggles.

          `sm:px-6` rather than `md:` so the padding steps up on tablets too. */}
      <div className="flex h-full items-center gap-4 px-4 sm:px-6">
        <button
          onClick={onMenuClick}
          className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex min-w-0 flex-1 md:max-w-xl">
          <div className={cn("relative w-full transition-all duration-200", searchFocused && "scale-[1.02]")}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="w-full pl-10 pr-4 h-10 bg-accent/50 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* `ml-auto` is load-bearing, and it is not a stylistic choice.

            The search wrapper below is `flex-1 md:max-w-xl`, and those two
            properties fight each other: `flex-grow` hands the search every spare
            pixel on the row until `max-w-xl` stops it at 576px. Whatever space is
            left over after that is never claimed by anyone, and a flex row with
            the default `justify-content: flex-start` parks the remainder to the
            right of the *last* item — which pushed this whole group 300px away
            from the right edge on a 1440px screen.

            `ml-auto` claims that leftover instead, so the slack lands between the
            search and this group, where it belongs. */}
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                    You&apos;re all caught up.
                  </p>
                )}

                {notifications.slice(0, 5).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => {
                      markNotificationRead(notification.id)
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-0",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 rounded-full shrink-0",
                          !notification.read ? "bg-primary" : "bg-muted",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hasMounted
                            ? relativeTime(notification.createdAt)
                            : formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border p-2">
                <button
                  type="button"
                  onClick={() => {
                    markAllNotificationsRead()
                    setNotificationOpen(false)
                  }}
                  disabled={unreadCount === 0}
                  className="flex h-9 flex-1 items-center justify-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                  {unreadCount === 0 ? "All caught up" : "Mark all as read"}
                </button>
                {/* The dropdown still previews 5; the full history lives on its
                    own page. Without this the user has no way past the cap. */}
                <Link
                  href="/notifications"
                  onClick={() => setNotificationOpen(false)}
                  className="flex h-9 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View all
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl hover:bg-accent px-2 md:px-3 py-2 transition-all duration-200 hover:scale-[1.02]">
                <Avatar className="h-8 w-8">
                  {user?.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium leading-tight">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
