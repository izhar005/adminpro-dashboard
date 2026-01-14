"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { TaskDialog } from "@/components/kanban/TaskDialog"
import { Button } from "@/components/ui/button"
import { mockTasks, type Task } from "@/lib/data"
import { Plus, Filter } from "lucide-react"

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [defaultStatus, setDefaultStatus] = useState<Task["status"] | undefined>(undefined)

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleAddTask = (status: Task["status"]) => {
    setSelectedTask(undefined)
    setDefaultStatus(status)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setDefaultStatus(undefined)
    setDialogOpen(true)
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? { ...t, ...taskData } : t)))
    } else {
      const newTask: Task = {
        id: (tasks.length + 1).toString(),
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || defaultStatus || "todo",
        priority: taskData.priority || "medium",
        assignee: taskData.assignee || "",
        dueDate: taskData.dueDate || "",
        tags: taskData.tags || [],
      }
      setTasks([...tasks, newTask])
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleDrop = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kanban Board</h1>
              <p className="text-muted-foreground">Organize and track your tasks with drag-and-drop boards</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button onClick={() => handleAddTask("todo")} className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">To Do</p>
              <p className="text-2xl font-bold mt-1">{getTasksByStatus("todo").length}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-1">{getTasksByStatus("in-progress").length}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Review</p>
              <p className="text-2xl font-bold mt-1">{getTasksByStatus("review").length}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Done</p>
              <p className="text-2xl font-bold mt-1">{getTasksByStatus("done").length}</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            <KanbanColumn
              title="To Do"
              status="todo"
              tasks={getTasksByStatus("todo")}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onAddTask={handleAddTask}
              onDrop={handleDrop}
            />
            <KanbanColumn
              title="In Progress"
              status="in-progress"
              tasks={getTasksByStatus("in-progress")}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onAddTask={handleAddTask}
              onDrop={handleDrop}
            />
            <KanbanColumn
              title="Review"
              status="review"
              tasks={getTasksByStatus("review")}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onAddTask={handleAddTask}
              onDrop={handleDrop}
            />
            <KanbanColumn
              title="Done"
              status="done"
              tasks={getTasksByStatus("done")}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onAddTask={handleAddTask}
              onDrop={handleDrop}
            />
          </div>

          <TaskDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            task={selectedTask}
            defaultStatus={defaultStatus}
            onSave={handleSaveTask}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
