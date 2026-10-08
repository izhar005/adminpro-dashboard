"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { TaskDialog } from "@/components/kanban/TaskDialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockTasks, type Task } from "@/lib/data"
import { Plus, Filter, X } from "lucide-react"

type PriorityFilter = "all" | Task["priority"]
type AssigneeFilter = "all" | string

const PRIORITIES: Task["priority"][] = ["low", "medium", "high"]

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [defaultStatus, setDefaultStatus] = useState<Task["status"] | undefined>(undefined)

  const [filterOpen, setFilterOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all")
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  /** Assignees come from the tasks themselves so the list can't go stale. */
  const assignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))).sort(),
    [tasks],
  )

  const filterActive = priorityFilter !== "all" || assigneeFilter !== "all"

  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          (priorityFilter === "all" || task.priority === priorityFilter) &&
          (assigneeFilter === "all" || task.assignee === assigneeFilter),
      ),
    [tasks, priorityFilter, assigneeFilter],
  )

  const clearFilters = () => {
    setPriorityFilter("all")
    setAssigneeFilter("all")
  }

  const getTasksByStatus = (status: Task["status"]) =>
    visibleTasks.filter((task) => task.status === status)

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
      setTasks((prev) =>
        prev.map((t) => (t.id === selectedTask.id ? { ...t, ...taskData } : t)),
      )
      return
    }

    setTasks((prev) => {
      // Same reason as users: `tasks.length + 1` reuses an id after a delete and
      // React then reconciles the new card against the removed one.
      const nextId =
        prev.reduce((max, t) => {
          const n = Number.parseInt(t.id, 10)
          return Number.isNaN(n) ? max : Math.max(max, n)
        }, 0) + 1

      const newTask: Task = {
        id: String(nextId),
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || defaultStatus || "todo",
        priority: taskData.priority || "medium",
        assignee: taskData.assignee || "",
        dueDate: taskData.dueDate || "",
        tags: taskData.tags || [],
      }
      return [...prev, newTask]
    })
  }

  const handleDeleteTask = (id: string) => setPendingDelete(id)

  const confirmDelete = () => {
    if (!pendingDelete) return
    setTasks((prev) => prev.filter((t) => t.id !== pendingDelete))
    setPendingDelete(null)
  }

  const handleDrop = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const deletedTask = tasks.find((t) => t.id === pendingDelete)

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
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => setFilterOpen((open) => !open)}
                aria-expanded={filterOpen}
              >
                <Filter className="h-4 w-4" />
                Filter
                {filterActive && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    on
                  </span>
                )}
              </Button>
              <Button onClick={() => handleAddTask("todo")} className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          {/* Filter panel — the button used to open nothing */}
          {filterOpen && (
            <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4">
              <div className="space-y-2">
                <label htmlFor="priorityFilter" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={priorityFilter}
                  onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}
                >
                  <SelectTrigger id="priorityFilter" className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority} className="capitalize">
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="assigneeFilter" className="text-sm font-medium">
                  Assignee
                </label>
                <Select
                  value={assigneeFilter}
                  onValueChange={(value) => setAssigneeFilter(value)}
                >
                  <SelectTrigger id="assigneeFilter" className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                className="gap-2"
                onClick={clearFilters}
                disabled={!filterActive}
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>

              <p className="ml-auto text-sm text-muted-foreground">
                Showing {visibleTasks.length} of {tasks.length} tasks
              </p>
            </div>
          )}

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

          {/* Delete confirmation — a single click used to remove the card */}
          <Dialog
            open={pendingDelete !== null}
            onOpenChange={(open) => !open && setPendingDelete(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete this task?</DialogTitle>
                <DialogDescription>
                  &ldquo;{deletedTask?.title}&rdquo; will be permanently removed from the board.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPendingDelete(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
