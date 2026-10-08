"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

/** True only after hydration. Stable snapshot, so it can't loop. */
const subscribe = () => () => {}
const useHasMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

interface StatCardProps {
  title: string
  value: number
  previousValue: number
  trend: "up" | "down"
  icon: LucideIcon
  prefix?: string
  suffix?: string
  decimals?: number
}

export function StatCard({
  title,
  value,
  previousValue,
  trend,
  icon: Icon,
  prefix = "",
  suffix = "",
  decimals = 0,
}: StatCardProps) {
  const hasMounted = useHasMounted()
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    // Honour `prefers-reduced-motion` — a two-second count-up is exactly the
    // kind of motion that setting exists for. The setState goes through a
    // timeout so it lands in a callback rather than synchronously in the effect
    // body, which avoids a cascading render.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = setTimeout(() => setAnimatedValue(value), 0)
      return () => clearTimeout(timeout)
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setAnimatedValue(value)
        clearInterval(timer)
      } else {
        setAnimatedValue(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  /**
   * The count-up starts from zero, so rendering `animatedValue` directly would
   * put a literal `0` in the server HTML — bad for SEO, and a visible flash of
   * the wrong number. Render the real figure until the client has taken over.
   */
  const displayValue = hasMounted ? animatedValue : value

  const percentChange = ((value - previousValue) / previousValue) * 100

  return (
    // Column layout so the value gets the full card width. Previously the value
    // and the icon shared one flex row, and a long currency like "$2,209.68" ran
    // into the 48px icon box as soon as the sidebar expanded and the card got
    // narrower.
    <Card
      className={cn(
        "group flex w-full flex-col justify-between gap-3 border-border/50 p-4",
        "transition-all duration-300",
        // `hover:z-10` so the lifted card paints above its neighbours, and
        // `motion-reduce` for anyone who has asked the OS to stop animations.
        // A 1.02 scale only grows the card ~2px per side against a 16-24px gap,
        // so the cards stay well clear of each other.
        "hover:z-10 hover:scale-[1.02] hover:shadow-lg",
        "motion-reduce:transition-none motion-reduce:hover:scale-100",
      )}
    >
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
          {title}
        </p>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div>
        <h3
          className="truncate text-2xl font-bold tabular-nums lg:text-3xl"
          title={`${prefix}${value.toLocaleString()}${suffix}`}
        >
          {prefix}
          {displayValue.toFixed(decimals).toLocaleString()}
          {suffix}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-1 text-sm">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 shrink-0 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 shrink-0 text-red-500" />
          )}
          <span
            className={cn(
              "font-medium tabular-nums",
              trend === "up" ? "text-green-500" : "text-red-500",
            )}
          >
            {Math.abs(percentChange).toFixed(1)}%
          </span>
          <span className="truncate text-muted-foreground">vs last period</span>
        </div>
      </div>
    </Card>
  )
}
