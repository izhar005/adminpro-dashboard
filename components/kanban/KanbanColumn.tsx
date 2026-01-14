"use client"

import type React from "react"
import { useState } from "react"
import { KanbanCard } from "./KanbanCard"
import type { Task } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
  title: string
  status: Task["status"]
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddTask: (status: Task["status"]) => void
  onDrop: (taskId: string, newStatus: Task["status"]) => void
}

const columnColors = {
  todo: "bg-blue-500/10 text-blue-600",
  "in-progress": "bg-yellow-500/10 text-yellow-600",
  review: "bg-purple-500/10 text-purple-600",
  done: "bg-green-500/10 text-green-600",
}

export function KanbanColumn({ title, status, tasks, onEdit, onDelete, onAddTask, onDrop }: KanbanColumnProps) {
  const [draggedOver, setDraggedOver] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("taskId", taskId)
    setDraggedTaskId(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDraggedOver(true)
  }

  const handleDragLeave = () => {
    setDraggedOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    onDrop(taskId, status)
    setDraggedOver(false)
    setDraggedTaskId(null)
  }

  return (
    <div className="flex flex-col h-full min-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 px-3 items-center justify-center rounded-lg font-medium text-sm",
              columnColors[status],
            )}
          >
            {title}
          </div>
          <span className="text-sm text-muted-foreground">({tasks.length})</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onAddTask(status)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Content */}
      <div
        className={cn(
          "flex-1 rounded-xl border-2 border-dashed p-3 space-y-3 overflow-y-auto transition-colors min-h-[200px]",
          draggedOver ? "border-primary bg-primary/5" : "border-border/50 bg-accent/20",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">No tasks</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)}>
              <KanbanCard task={task} onEdit={onEdit} onDelete={onDelete} isDragging={draggedTaskId === task.id} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
