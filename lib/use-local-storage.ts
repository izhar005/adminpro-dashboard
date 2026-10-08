"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

/**
 * `useState` + a `mounted` flag is the usual localStorage pattern, but it makes
 * the first client render differ from the server render, which either throws a
 * hydration mismatch or forces an `if (!mounted) return null` gate — and that
 * gate means the server ships an empty page.
 *
 * This keeps localStorage-backed state hydration-safe without the gate.
 */

type Listener = () => void

interface StoreOptions<T> {
  /**
   * Optional transform applied to whatever was read out of storage.
   *
   * This is the hook for schema changes: the stored shape changes, the seed
   * data changes, and you upgrade old records on read instead of wiping them.
   * Runs only when the underlying string differs from the cached parse, so it
   * is not called on every render.
   */
  migrate?: (value: unknown) => T
}

function createStore<T>(key: string, fallback: T, options: StoreOptions<T> = {}) {
  const listeners = new Set<Listener>()
  const { migrate } = options

  // `getSnapshot` is called on every render, and returning a fresh object each
  // time would make `useSyncExternalStore` loop forever. Cache the parsed value
  // against the raw string it came from so the reference stays stable until the
  // underlying data actually changes.
  let cache: { raw: string | null; value: T } | null = null

  const read = (): T => {
    let raw: string | null = null
    try {
      raw = localStorage.getItem(key)
    } catch {
      return fallback
    }

    if (cache && cache.raw === raw) return cache.value

    let value = fallback
    if (raw !== null) {
      try {
        const parsed: unknown = JSON.parse(raw)
        value = migrate ? migrate(parsed) : (parsed as T)
      } catch {
        // Corrupt entry — fall back rather than crash the tree.
        value = fallback
      }
    }

    cache = { raw, value }
    return value
  }

  const subscribe = (onStoreChange: Listener) => {
    listeners.add(onStoreChange)
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === key) onStoreChange()
    }
    window.addEventListener("storage", onStorage)
    return () => {
      listeners.delete(onStoreChange)
      window.removeEventListener("storage", onStorage)
    }
  }

  const set = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable (private mode / quota) — state still updates in memory.
    }
    cache = null
    listeners.forEach((listener) => listener())
  }

  return { subscribe, read, set }
}

export function useLocalStorage<T>(key: string, fallback: T, options: StoreOptions<T> = {}) {
  const store = useMemo(
    () => createStore<T>(key, fallback, options),
    // `options` is an object literal at most call sites, so it must not be a
    // dependency — `migrate` is read fresh inside the store instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, fallback],
  )

  const value = useSyncExternalStore(store.subscribe, store.read, () => fallback)

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const next =
        typeof update === "function"
          ? (update as (prev: T) => T)(store.read())
          : update
      store.set(next)
    },
    [store],
  )

  return [value, setValue] as const
}