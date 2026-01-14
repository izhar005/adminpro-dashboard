"use client"

import { useState } from "react"
import { Search, Bell, Moon, Sun, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useApp } from "@/contexts/AppContext"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
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
  const { notifications, markNotificationRead, settings } = useApp()
  const { user, logout } = useAuth()
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

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
        "fixed top-0 right-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border transition-all duration-300",
        "left-0 md:left-64",
        isCollapsed && "md:left-16",
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6 gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className={cn("relative transition-all duration-200", searchFocused && "scale-[1.02]")}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 h-10 bg-accent/50 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
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
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-2">
                <Link
                  href="/notifications"
                  className="flex h-9 items-center justify-center rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => setNotificationOpen(false)}
                >
                  View all notifications
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
