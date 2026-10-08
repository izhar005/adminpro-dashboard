"use client"

import type React from "react"
import { createContext, useCallback, useContext, useLayoutEffect, useSyncExternalStore } from "react"
import {
  resolveInitialTheme,
  THEME_EVENT_NAME,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  // Keeps native form controls, scrollbars and the canvas background in sync
  root.style.colorScheme = theme
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing / storage disabled — theme just won't persist.
  }
  window.dispatchEvent(new Event(THEME_EVENT_NAME))
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT_NAME, onStoreChange)
  // Keeps multiple open tabs in sync.
  window.addEventListener("storage", onStoreChange)
  return () => {
    window.removeEventListener(THEME_EVENT_NAME, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

/**
 * The theme lives on `<html>` as a class, not in React state. Reading it through
 * `useSyncExternalStore` means the server can still render real markup (no more
 * `return null` until mounted).
 */
function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getServerSnapshot(): Theme {
  return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // In development, React's Strict Mode remounts components once, and on that
  // remount it resets `<html>` to only the attributes it manages from JSX —
  // wiping the `dark` class and `color-scheme` the inline script set. This
  // re-applies it before paint. It is a no-op in production, where the script
  // has already run and nothing resets the element.
  useLayoutEffect(() => {
    const root = document.documentElement
    const resolved = resolveInitialTheme()
    root.classList.toggle("dark", resolved === "dark")
    root.style.colorScheme = resolved
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    applyTheme(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(
      document.documentElement.classList.contains("dark") ? "light" : "dark",
    )
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}