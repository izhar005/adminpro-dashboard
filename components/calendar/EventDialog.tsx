"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarEvent } from "@/lib/data"

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent
  defaultDate?: Date
  onSave: (event: Partial<CalendarEvent>) => void
}

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Lives inside `DialogContent` so Radix unmounting resets the form; `key` resets
 * it when editing a different event.
 */
function EventForm({
  event,
  defaultDate,
  onSave,
  onCancel,
}: {
  event?: CalendarEvent
  defaultDate?: Date
  onSave: (event: Partial<CalendarEvent>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>(
    () =>
      event ?? {
        title: "",
        start: defaultDate || new Date(),
        end: defaultDate || new Date(),
        category: "meeting",
        description: "",
      },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // An event ending before it starts has never been a valid thing to save.
    if (formData.start && formData.end && new Date(formData.end) < new Date(formData.start)) {
      return
    }
    onSave(formData)
  }

  const endBeforeStart = Boolean(
    formData.start && formData.end && new Date(formData.end) < new Date(formData.start),
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: CalendarEvent["category"]) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start">Start Time</Label>
            <Input
              id="start"
              type="datetime-local"
              value={formData.start ? formatDateTimeLocal(new Date(formData.start)) : ""}
              onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end">End Time</Label>
            <Input
              id="end"
              type="datetime-local"
              value={formData.end ? formatDateTimeLocal(new Date(formData.end)) : ""}
              onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
              required
              aria-invalid={endBeforeStart}
            />
          </div>
        </div>
        {endBeforeStart && (
          <p className="text-sm text-destructive">
            End time must be after the start time.
          </p>
        )}
        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={endBeforeStart}>
          {event ? "Update Event" : "Create Event"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
  onSave,
}: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update event details" : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          key={event?.id ?? `new-${defaultDate?.toISOString() ?? "now"}`}
          event={event}
          defaultDate={defaultDate}
          onSave={(data) => {
            onSave(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}