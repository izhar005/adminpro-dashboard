"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

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
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
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

  const percentChange = ((value - previousValue) / previousValue) * 100

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group border-border/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2 tabular-nums">
            {prefix}
            {animatedValue.toFixed(decimals).toLocaleString()}
            {suffix}
          </h3>
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn("text-sm font-medium", trend === "up" ? "text-green-500" : "text-red-500")}>
              {Math.abs(percentChange).toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}
