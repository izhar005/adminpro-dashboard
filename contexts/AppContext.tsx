"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AppSettings {
  sidebarCollapsed: boolean
  primaryColor: string
  fontSize: "small" | "medium" | "large"
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

interface AppContextType {
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addNotification: (notification: Omit<Notification, "id">) => void
}

const defaultSettings: AppSettings = {
  sidebarCollapsed: false,
  primaryColor: "#03C9D7",
  fontSize: "medium",
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #12345 has been placed successfully",
    time: "5 mins ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "System Update",
    message: "A new system update is available",
    time: "1 hour ago",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Low Stock Alert",
    message: "Product inventory is running low",
    time: "2 hours ago",
    read: true,
    type: "warning",
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("appSettings")
    if (stored) {
      setSettings(JSON.parse(stored))
    }
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("appSettings", JSON.stringify(settings))
    }
  }, [settings, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications, mounted])

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotif = { ...notification, id: Date.now().toString() }
    setNotifications((prev) => [newNotif, ...prev])
  }

  if (!mounted) return null

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
