"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CalendarView } from "@/components/calendar/CalendarView"
import { EventDialog } from "@/components/calendar/EventDialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockEvents, type CalendarEvent } from "@/lib/data"
import { Plus, CalendarIcon, Clock } from "lucide-react"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const handleDateClick = (date: Date) => {
    setSelectedEvent(undefined)
    setSelectedDate(date)
    setDialogOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSelectedDate(undefined)
    setDialogOpen(true)
  }

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...e, ...eventData } : e)))
    } else {
      const newEvent: CalendarEvent = {
        id: (events.length + 1).toString(),
        title: eventData.title || "",
        start: eventData.start || new Date(),
        end: eventData.end || new Date(),
        category: eventData.category || "meeting",
        description: eventData.description,
      }
      setEvents([...events, newEvent])
    }
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5)

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Calendar & Events</h1>
              <p className="text-muted-foreground">Manage your schedule and upcoming events</p>
            </div>
            <Button onClick={() => handleDateClick(new Date())} className="gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CalendarView events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
            </div>

            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium leading-tight">{event.title}</h4>
                          <Badge variant="secondary" className="capitalize shrink-0">
                            {event.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(event.start).toLocaleString("default", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>

          <EventDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            event={selectedEvent}
            defaultDate={selectedDate}
            onSave={handleSaveEvent}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
