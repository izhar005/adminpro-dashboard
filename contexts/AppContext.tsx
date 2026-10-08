"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useLocalStorage } from "@/lib/use-local-storage"

export interface AppSettings {
  sidebarCollapsed: boolean
  fontSize: "small" | "medium" | "large"
  /** Notification preferences — previously rendered as switches whose state was
   *  never stored, so every toggle reset on remount. */
  orderNotifications: boolean
  userActivityNotifications: boolean
  systemNotifications: boolean
}

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  type: NotificationType
  /**
   * Epoch milliseconds.
   *
   * This used to be a `time: string` holding literal text like "5 mins ago",
   * which could never age or sort. Anything timestamp-like now derives from
   * this field via `lib/relative-time`.
   */
  createdAt: number
}

interface AppContextType {
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markNotificationUnread: (id: string) => void
  markAllNotificationsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  addNotification: (notification: Omit<Notification, "id">) => void
}

const defaultSettings: AppSettings = {
  // `primaryColor` used to live here but nothing ever read it — the theme's
  // colors come from the CSS custom properties in globals.css, so changing a
  // hex string here could not have changed anything on screen.
  sidebarCollapsed: false,
  fontSize: "medium",
  orderNotifications: true,
  userActivityNotifications: true,
  systemNotifications: false,
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/**
 * The fallback the server renders with.
 *
 * `useSyncExternalStore` requires a stable server snapshot, so this anchor is a
 * fixed constant rather than `Date.now()` — two renders milliseconds apart can
 * land on opposite sides of a "1 minute ago" boundary and throw a hydration
 * mismatch. The real, fresh-looking timestamps are written on mount instead (see
 * `seedIfEmpty`); by then the browser is past hydration and nothing is compared.
 */
const SSR_ANCHOR = 1_700_000_000_000

/**
 * Seed notifications, built from offsets relative to `now`.
 *
 * Anchored to the visitor's first load rather than a fixed date, so the page
 * reads "5 mins ago" instead of showing seed data stamped months in the past.
 */
function buildSeedNotifications(now: number): Notification[] {
  return [
    {
      id: "seed-1",
      title: "New Order Received",
      message: "Order #12345 has been placed successfully",
      read: false,
      type: "success",
      createdAt: now - 5 * 60 * 1000,
    },
    {
      id: "seed-2",
      title: "Payment Failed",
      message: "Order ORD-042 could not be charged — card expired",
      read: false,
      type: "error",
      createdAt: now - 22 * 60 * 1000,
    },
    {
      id: "seed-3",
      title: "System Update",
      message: "Version 2.4.0 is ready to install. Includes 6 fixes and 2 security patches.",
      read: false,
      type: "info",
      createdAt: now - HOUR,
    },
    {
      id: "seed-4",
      title: "Low Stock Alert",
      message: "Wireless Mouse is down to 4 units. Restock to avoid losing sales.",
      read: true,
      type: "warning",
      createdAt: now - 3 * HOUR,
    },
    {
      id: "seed-5",
      title: "New Team Member",
      message: "Priya Kowalski joined the Engineering department",
      read: true,
      type: "info",
      createdAt: now - 6 * HOUR,
    },
    {
      id: "seed-6",
      title: "Weekly Report Ready",
      message: "Your revenue summary for last week is ready to view",
      read: true,
      type: "success",
      createdAt: now - DAY,
    },
    {
      id: "seed-7",
      title: "Storage Almost Full",
      message: "You have used 92% of your storage quota",
      read: true,
      type: "warning",
      createdAt: now - 3 * DAY,
    },
  ]
}

const initialNotifications = buildSeedNotifications(SSR_ANCHOR)

const AppContext = createContext<AppContextType | undefined>(undefined)

/**
 * Brings stored notifications up to the current shape.
 *
 * Anyone who loaded the app before this change still has the old `{ time: "5
 * mins ago" }` records in localStorage. Dropping the key instead would silently
 * wipe their list, so old entries are upgraded in place. A record with no usable
 * timestamp gets the seed anchor, which renders as an absolute date rather than
 * a wrong "just now".
 */
function migrateNotifications(stored: unknown): Notification[] {
  if (!Array.isArray(stored)) return initialNotifications

  const VALID_TYPES: readonly NotificationType[] = ["info", "success", "warning", "error"]

  return stored.flatMap((raw) => {
    if (typeof raw !== "object" || raw === null) return []
    const n = raw as Partial<Notification>

    if (typeof n.title !== "string" || typeof n.message !== "string") return []

    return [
      {
        id: typeof n.id === "string" && n.id ? n.id : crypto.randomUUID(),
        title: n.title,
        message: n.message,
        read: Boolean(n.read),
        type: VALID_TYPES.includes(n.type as NotificationType)
          ? (n.type as NotificationType)
          : "info",
        createdAt: typeof n.createdAt === "number" ? n.createdAt : SSR_ANCHOR,
      },
    ]
  })
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    "adminpro:settings",
    defaultSettings,
  )
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(
    "adminpro:notifications",
    initialNotifications,
    { migrate: migrateNotifications },
  )

  // First visit has nothing in localStorage, so `read()` returns the SSR
  // fallback — timestamps stamped at `SSR_ANCHOR`. Rewrite them against the real
  // clock once we're past hydration, so a fresh visitor sees "5 mins ago"
  // instead of a fixed date from years ago. The `hasSeeded` ref keeps this to
  // one write per mount even under Strict Mode's double-invoke.
  const hasSeeded = useRef(false)
  useEffect(() => {
    if (hasSeeded.current) return
    hasSeeded.current = true

    let hasStored: boolean
    try {
      hasStored = localStorage.getItem("adminpro:notifications") !== null
    } catch {
      return
    }
    if (!hasStored) setNotifications(buildSeedNotifications(Date.now()))
  }, [setNotifications])

  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }))
    },
    [setSettings],
  )

  const setReadState = useCallback(
    (id: string, read: boolean) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read } : n)))
    },
    [setNotifications],
  )

  const markNotificationRead = useCallback(
    (id: string) => setReadState(id, true),
    [setReadState],
  )

  const markNotificationUnread = useCallback(
    (id: string) => setReadState(id, false),
    [setReadState],
  )

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [setNotifications])

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    },
    [setNotifications],
  )

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [setNotifications])

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt"> & { createdAt?: number }) => {
      const newNotif: Notification = {
        ...notification,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: notification.createdAt ?? Date.now(),
      }
      // Newest first, so a list rendered straight from state stays ordered
      // without every consumer having to sort it.
      setNotifications((prev) =>
        [newNotif, ...prev].sort((a, b) => b.createdAt - a.createdAt),
      )
    },
    [setNotifications],
  )

  const value = useMemo<AppContextType>(
    () => ({
      settings,
      updateSettings,
      notifications,
      markNotificationRead,
      markNotificationUnread,
      markAllNotificationsRead,
      removeNotification,
      clearAllNotifications,
      addNotification,
    }),
    [
      settings,
      updateSettings,
      notifications,
      markNotificationRead,
      markNotificationUnread,
      markAllNotificationsRead,
      removeNotification,
      clearAllNotifications,
      addNotification,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}