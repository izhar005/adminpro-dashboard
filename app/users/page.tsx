"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { UsersTable } from "@/components/users/UsersTable"
import { UserDialog } from "@/components/users/UserDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers, type User } from "@/lib/data"
import { Plus, Search, Filter, Trash2 } from "lucide-react"

type StatusFilter = "all" | "active" | "inactive"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [detailUser, setDetailUser] = useState<User | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null)

  /**
   * The filtered list is *derived*, not stored.
   *
   * It used to live in its own `filteredUsers` state, which meant every mutation
   * had to remember to call `setFilteredUsers(updated)` — and doing so threw away
   * whatever search the user had typed, because the new array was unfiltered.
   * Deriving it here makes that class of bug impossible.
   */
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return users.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) return false
      if (!query) return true

      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        (user.department ?? "").toLowerCase().includes(query)
      )
    })
  }, [users, searchQuery, statusFilter])

  const handleAddUser = () => {
    setSelectedUser(undefined)
    setDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u)),
      )
      return
    }

    setUsers((prev) => {
      // `users.length + 1` collides after a delete: with ids 1,2,3 and 3 removed,
      // the next add reuses id "3" and React's key-based reconciliation puts the
      // new row in the deleted row's slot. Take the max instead.
      const nextId =
        prev.reduce((max, u) => {
          const n = Number.parseInt(u.id, 10)
          return Number.isNaN(n) ? max : Math.max(max, n)
        }, 0) + 1

      const newUser: User = {
        id: String(nextId),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "",
        status: userData.status || "active",
        avatar:
          userData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "NA",
        joinDate: new Date().toISOString().split("T")[0],
        department: userData.department,
      }
      return [...prev, newUser]
    })
  }

  const handleDeleteUser = (id: string) => setPendingDelete([id])
  const handleDeleteMany = (ids: string[]) => setPendingDelete(ids)
  const handleSetStatusMany = (ids: string[], status: User["status"]) => {
    const idSet = new Set(ids)
    setUsers((prev) => prev.map((u) => (idSet.has(u.id) ? { ...u, status } : u)))
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    const idSet = new Set(pendingDelete)
    setUsers((prev) => prev.filter((u) => !idSet.has(u.id)))
    setPendingDelete(null)
    // The row the detail dialog was showing may have just been deleted.
    setDetailUser((current) => (current && idSet.has(current.id) ? null : current))
  }

  const deleteCount = pendingDelete?.length ?? 0
  const deleteLabel =
    deleteCount === 1
      ? users.find((u) => u.id === pendingDelete?.[0])?.name
      : `${deleteCount} users`

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Users Management</h1>
              <p className="text-muted-foreground">Manage your team members and their permissions</p>
            </div>
            <Button onClick={handleAddUser} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, role, or department..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by status">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold mt-1">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold mt-1">
                {new Set(users.map((u) => u.department)).size}
              </p>
            </div>
          </div>

          {/* Table */}
          <UsersTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onDeleteMany={handleDeleteMany}
            onSetStatusMany={handleSetStatusMany}
            onView={setDetailUser}
          />

          {/* Edit / create */}
          <UserDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            user={selectedUser}
            onSave={handleSaveUser}
          />

          {/* View details — used to be a bare `alert()` */}
          <Dialog open={detailUser !== null} onOpenChange={(open) => !open && setDetailUser(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>Everything on record for this user.</DialogDescription>
              </DialogHeader>
              {detailUser && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                        {detailUser.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-lg truncate">{detailUser.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{detailUser.email}</p>
                    </div>
                    <Badge
                      variant={detailUser.status === "active" ? "default" : "secondary"}
                      className="ml-auto shrink-0"
                    >
                      {detailUser.status}
                    </Badge>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Role</dt>
                      <dd className="font-medium mt-0.5">{detailUser.role}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Department</dt>
                      <dd className="font-medium mt-0.5">{detailUser.department ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Join Date</dt>
                      <dd className="font-medium mt-0.5">{detailUser.joinDate}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">User ID</dt>
                      <dd className="font-medium mt-0.5 font-mono text-xs">{detailUser.id}</dd>
                    </div>
                  </dl>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailUser(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (!detailUser) return
                    setSelectedUser(detailUser)
                    setDetailUser(null)
                    setDialogOpen(true)
                  }}
                >
                  Edit user
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation — deleting used to fire on a single click */}
          <Dialog
            open={pendingDelete !== null}
            onOpenChange={(open) => !open && setPendingDelete(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete {deleteLabel}?</DialogTitle>
                <DialogDescription>
                  This permanently removes {deleteCount === 1 ? "this user" : "these users"} from
                  the list. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPendingDelete(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
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
