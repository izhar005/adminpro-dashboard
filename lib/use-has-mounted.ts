"use client"

import { useSyncExternalStore } from "react"

/** True only after hydration. The snapshots are constants, so it cannot loop. */
const subscribe = () => () => {}

export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
