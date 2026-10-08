"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/AppContext"
import { SIDEBAR_WIDTH_CLASS } from "@/lib/sidebar-layout"
import { LogoMark } from "@/components/brand/LogoMark"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Kanban,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Bell,
  BarChart3,
  X,
} from "lucide-react"

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Users", href: "/users", icon: Users },
  { title: "Orders", href: "/orders", icon: ShoppingBag },
  { title: "Kanban", href: "/kanban", icon: Kanban },
  { title: "Calendar", href: "/calendar", icon: Calendar },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { settings, updateSettings, notifications } = useApp()

  const isCollapsed = settings.sidebarCollapsed
  const unreadCount = notifications.filter((n) => !n.read).length

  // Close the mobile drawer on navigation. `mobileOpen` deliberately isn't a
  // dependency here — adding it would close the drawer the instant it opened.
  // Comparing against the previous path fires only when the route actually
  // changes.
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname
      onMobileClose?.()
    }
  }, [pathname, onMobileClose])

  const toggle = () => updateSettings({ sidebarCollapsed: !isCollapsed })

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-card border-r border-border",
        // No `overflow-hidden` here: the toggle hangs off the right edge at
        // `-right-3` and would be clipped by it. Nothing inside needs clipping
        // — the nav already scrolls and hides its own overflow, and collapsed
        // labels are removed from the DOM rather than hidden behind a mask.
        "transition-[width] duration-300 ease-in-out",
        "md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? SIDEBAR_WIDTH_CLASS.collapsed : SIDEBAR_WIDTH_CLASS.expanded,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "relative flex h-16 shrink-0 items-center border-b border-border px-4",
          // Mobile always shows the full drawer regardless of the desktop
          // preference, so the collapse styling is `md:`-scoped throughout.
          isCollapsed && "md:justify-center md:px-0",
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isCollapsed && "md:min-w-0 md:gap-0",
          )}
          aria-label="AdminPro home"
        >
          {/* The mark paints its own black/white split, so no background class
              here — an inherited `bg-primary` would sit behind the halves and
              wash out whichever one matched the theme. */}
          <LogoMark className="shrink-0" />
          {/* `md:hidden` rather than conditional rendering: an element hidden
              with `opacity-0` still occupies width, which is what used to push
              the old header toggle out over the navbar. */}
          <span className={cn("truncate text-lg font-semibold", isCollapsed && "md:hidden")}>
            AdminPro
          </span>
        </Link>

        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="md:hidden absolute right-3 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Vertical edge handle — a tab on the sidebar's right border, halfway down.

          A tab shape rather than a round button because a 64px collapsed rail
          can't fit a control next to the logo, and straddling the border keeps
          the header uncluttered. `rounded-r-md` with no left rounding gives the
          flat edge that sits flush against the border. */}
      <button
        onClick={toggle}
        className={cn(
          "hidden md:flex absolute -right-4 top-1/2 z-30 h-12 w-5 -translate-y-1/2",
          "items-center justify-center rounded-r-md border border-l-0",
          // Light values are the base and `dark:` overrides them, because the
          // project's only variant is `dark` (class-based, via `@custom-variant`
          // in globals.css) — there is no `light:` variant to lean on.
          "border-zinc-300 bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
          "dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:hover:text-white",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <TooltipProvider>
        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const link = (
              <Link
                href={item.href}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "md:justify-center md:gap-0 md:px-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "animate-pulse")} />
                <span className={cn("truncate", isCollapsed && "md:hidden")}>
                  {item.title}
                </span>
                {isActive && (
                  <span
                    className={cn(
                      "ml-auto h-2 w-2 shrink-0 rounded-full bg-primary-foreground",
                      isCollapsed && "md:hidden",
                    )}
                  />
                )}
              </Link>
            )

            if (!isCollapsed) return <div key={item.href}>{link}</div>

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </TooltipProvider>

      {/* Footer — a link, not a dead summary card. The nav item above carries
          the same destination; this one is the glanceable unread count. */}
      <div className="shrink-0 border-t border-border p-3">
        <Link
          href="/notifications"
          title={isCollapsed ? "Notifications" : undefined}
          className={cn(
            "flex h-10 items-center gap-3 rounded-xl bg-accent/50 px-3 transition-colors hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isCollapsed && "md:justify-center md:gap-0 md:px-0",
          )}
        >
          <span className="relative flex shrink-0 items-center justify-center">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </span>

          <div className={cn("min-w-0 flex-1", isCollapsed && "md:hidden")}>
            <p className="truncate text-xs font-medium">Notifications</p>
            <p className="truncate text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} new ${unreadCount === 1 ? "update" : "updates"}`
                : "All caught up"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  )
}