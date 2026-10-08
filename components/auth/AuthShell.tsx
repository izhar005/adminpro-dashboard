"use client"

import type React from "react"
import { Moon, Sun, ArrowUpRight, BarChart3, ShieldCheck, Users } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { LogoMark } from "@/components/brand/LogoMark"
import { cn } from "@/lib/utils"

/**
 * Split-screen shell shared by `/login` and `/signup`.
 *
 * The panels are colour-inverted against the app theme: dark mode puts the
 * branding panel on black and the form panel on white, light mode swaps them.
 * That inversion is why the form's inputs, buttons and muted text are all
 * explicitly coloured here rather than using `--background` / `--foreground` —
 * those tokens describe the app's theme, which is the *opposite* of whichever
 * panel the form is sitting on, so the token values would be reversed.
 */

const HIGHLIGHTS = [
  { icon: BarChart3, label: "Revenue, orders and users on one screen" },
  { icon: Users, label: "Roles, permissions and team management" },
  { icon: ShieldCheck, label: "Auth wired up and ready for your database" },
]

/** Panel + form styling, so both auth pages stay identical. */
export const authPanelClass = cn(
  "bg-zinc-950 text-zinc-50",
  "dark:bg-zinc-50 dark:text-zinc-950",
)

/** Inputs sit on the form panel, so their colours are panel-relative too. */
export const authInputClass = cn(
  "w-full rounded-xl border bg-white/5 text-sm text-zinc-50 placeholder:text-zinc-500 short-height:py-2",
  "border-white/15 focus:outline-none focus:ring-2 focus:ring-white/40",
  "dark:bg-white dark:text-zinc-950 dark:placeholder:text-zinc-400 dark:border-zinc-300 dark:focus:ring-zinc-900/30",
)

export const authLabelClass = "text-sm font-medium text-zinc-200 dark:text-zinc-800"

export const authPrimaryButtonClass = cn(
  "w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 sm:py-3 sm:text-base short-height:py-2",
  "shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
  "flex items-center justify-center gap-2",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
  // Inverted against the panel, so it reads as the heaviest element on screen
  // whichever side the form is on.
  "bg-zinc-50 text-zinc-950 hover:bg-white",
  "dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
)

export const authSecondaryButtonClass = cn(
  "w-full rounded-xl border-2 py-2.5 text-sm font-semibold transition-all duration-200 sm:py-3 sm:text-base short-height:py-2",
  "shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
  "flex items-center justify-center gap-3",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "border-white/20 bg-white/5 text-zinc-50 hover:bg-white/10",
  "dark:border-zinc-300 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100",
)

export const authMutedClass = "text-sm text-zinc-400 dark:text-zinc-600"

export const authLinkClass = cn(
  "font-medium underline underline-offset-4",
  "text-zinc-50 hover:text-white",
  "dark:text-zinc-950 dark:hover:text-zinc-700",
)

interface AuthShellProps {
  /** The form panel's contents. */
  children: React.ReactNode
  /** Headline shown on the branding panel — the two pages differ. */
  heading: string
  subheading: string
}

export function AuthShell({ children, heading, subheading }: AuthShellProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    // `min-h-dvh`, not `h-dvh` + `overflow-hidden`. Both give a scrollbar-free
    // page whenever the content fits — which is the goal. But `h-dvh` also
    // clips the form off the bottom on a short viewport (laptop with browser
    // chrome open, or a phone held in landscape) with no way to reach it, and
    // the signup page is a full field taller than login, so it clips even
    // sooner. `min-h-dvh` centres the content when there is room and grows into
    // a scroll only when there genuinely isn't one.
    //
    // `dvh` rather than `vh` is the part that fixes mobile outright: `100vh`
    // never shrinks when the browser's URL bar collapses, so a full-height page
    // is always slightly taller than the visible area — that mismatch alone is
    // what produced the stray scrollbar on phones.
    <div className={cn("grid min-h-dvh w-full grid-cols-1 md:grid-cols-2", authPanelClass)}>
      {/* Branding panel. Hidden on mobile so the form gets the full width. */}
      <aside
        className={cn(
          "relative z-10 hidden flex-col justify-between overflow-hidden p-6 sm:p-8 lg:p-12 short-height:p-6 md:flex",
          // `relative z-10` is load-bearing: `<main>` is a later sibling, so
          // without a stacking order above it, main's background would paint on
          // top of the shadow and clip it flat against the seam.
          "rounded-tr-[40px] rounded-br-[40px]",
          "bg-zinc-50 text-zinc-950",
          "dark:bg-zinc-950 dark:text-zinc-50",
          // The shadow has to invert with the panels, otherwise it is invisible:
          // in dark mode this shadow falls on the light form panel (black reads),
          // in light mode it falls on the near-black one (only a light glow does).
          "shadow-[12px_0_25px_-5px_rgba(255,255,255,0.28)]",
          "dark:shadow-[12px_0_25px_-5px_rgba(0,0,0,0.32)]",
          "transition-shadow duration-300 ease-out",
        )}
      >
        {/* Abstract background — grid lines plus a soft glow, both low contrast
            so they read as texture rather than competing with the copy. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-zinc-400/30 blur-3xl dark:bg-zinc-700/40"
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="text-lg font-semibold">AdminPro</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl short-height:text-2xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:mt-4 sm:text-base short-height:mt-2 dark:text-zinc-400">
            {subheading}
          </p>

          <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4 lg:mt-10 short-height:mt-4 short-height:space-y-2">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <ArrowUpRight className="h-4 w-4" />
          Ship your admin panel in an afternoon
        </p>
      </aside>

      {/* Form panel. `min-w-0` stops the grid track from being widened by the
          form's own content, which would otherwise push a horizontal scrollbar
          onto the page at narrow widths. */}
      <main className={cn("relative flex min-w-0 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 short-height:py-3", authPanelClass)}>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={cn(
            "absolute right-4 top-4 z-50 rounded-xl border p-2 transition-colors duration-200",
            "border-white/15 bg-white/10 text-zinc-50 hover:bg-white/20",
            "dark:border-zinc-300 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white",
          )}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="w-full max-w-md mx-auto">{children}</div>
      </main>
    </div>
  )
}

/** The "OR" rule between the form and the Google button. */
export function OrDivider() {
  return (
    <div className="relative my-4 sm:my-6 short-height:my-3">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/15 dark:border-zinc-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-zinc-950 px-4 text-zinc-500 dark:bg-zinc-50 dark:text-zinc-500">
          OR
        </span>
      </div>
    </div>
  )
}

/** Inline error banner, used above the form. */
export function AuthError({ message }: { message: string }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 sm:mb-6 sm:p-4"
    >
      <p className="text-center text-sm text-red-300 dark:text-red-700">{message}</p>
    </div>
  )
}
