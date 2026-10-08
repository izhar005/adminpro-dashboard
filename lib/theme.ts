/**
 * Theme values shared by the server-rendered layout and the client provider.
 *
 * This is a plain module deliberately — it must not carry `"use client"`.
 *
 * A client module's exports are all client references on the server, including
 * plain string constants: importing `THEME_STORAGE_KEY` from a `"use client"`
 * file into a Server Component compiles cleanly and passes `tsc`, but the value
 * arrives as a proxy that throws the moment it is read. Since the inline script
 * in `app/layout.tsx` interpolates this key into a string of JavaScript, the
 * failure is silent — `localStorage.getItem()` returns null, the stored theme is
 * ignored, and the flash this script exists to prevent comes back.
 */

export type Theme = "light" | "dark"

export const THEME_STORAGE_KEY = "adminpro:theme"

/** Fired on `window` so every `useTheme()` consumer re-reads the class. */
export const THEME_EVENT_NAME = "adminpro:theme-change"

/**
 * Resolves the theme before React is involved: an explicit stored choice wins,
 * otherwise fall back to the OS preference.
 *
 * The inline script implements this same rule in serialised form. The two must
 * agree — if the script applied the OS preference while the effect applied a
 * stored "light", the page would flash to the wrong theme before settling.
 */
export function resolveInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "dark" || stored === "light") return stored
  } catch {
    // Storage unavailable (private mode, disabled cookies) — fall through.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}
