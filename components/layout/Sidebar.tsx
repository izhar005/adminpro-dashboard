"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/AppContext"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Kanban,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  Bell,
  BarChart3,
  X,
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Kanban",
    href: "/kanban",
    icon: Kanban,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { settings, updateSettings } = useApp()
  const [isHovered, setIsHovered] = useState(false)

  const isCollapsed = settings.sidebarCollapsed && !isHovered

  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose()
    }
  }, [pathname])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
          // Mobile: slide in from left
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: normal width behavior
          isCollapsed ? "md:w-16" : "md:w-64",
          // Mobile: always full sidebar width when open
          "w-64",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              isCollapsed ? "md:opacity-0" : "md:opacity-100",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg">AdminPro</span>
          </div>

          <button
            onClick={onMobileClose}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={() => updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed })}
            className={cn(
              "hidden md:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors",
              isCollapsed && "mx-auto",
            )}
            aria-label="Toggle sidebar"
          >
            {settings.sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground",
                  isCollapsed && "md:justify-center",
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "animate-pulse")} />
                <span
                  className={cn(
                    "transition-opacity duration-200 whitespace-nowrap",
                    isCollapsed ? "md:opacity-0 md:w-0" : "md:opacity-100",
                  )}
                >
                  {item.title}
                </span>
                {isActive && !isCollapsed && <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-accent/50 px-3 py-2.5",
              isCollapsed && "md:justify-center",
            )}
          >
            <Bell className="h-5 w-5 text-muted-foreground shrink-0" />
            <div
              className={cn(
                "flex-1 transition-opacity duration-200",
                isCollapsed ? "md:opacity-0 md:w-0" : "md:opacity-100",
              )}
            >
              <p className="text-xs font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">3 new updates</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
