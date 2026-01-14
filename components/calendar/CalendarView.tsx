"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CalendarEvent } from "@/lib/data"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

const categoryColors = {
  meeting: "bg-blue-500",
  task: "bg-green-500",
  reminder: "bg-yellow-500",
  personal: "bg-purple-500",
}

export function CalendarView({ events, onDateClick, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{monthName}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth} className="h-9 w-9 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const date = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null
          const dayEvents = date ? getEventsForDate(date) : []

          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] rounded-lg border border-border p-2 transition-colors",
                day && "cursor-pointer hover:bg-accent",
                !day && "bg-transparent border-transparent",
                isToday(day) && "border-primary border-2 bg-primary/5",
              )}
              onClick={() => day && date && onDateClick(date)}
            >
              {day && (
                <>
                  <div className={cn("text-sm font-medium mb-1", isToday(day) && "text-primary")}>{day}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <button
                        key={event.id}
                        className="w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                      >
                        <div className={cn("text-xs p-1 rounded truncate text-white", categoryColors[event.category])}>
                          {event.title}
                        </div>
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
