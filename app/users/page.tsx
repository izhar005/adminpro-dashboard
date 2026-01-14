"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { UsersTable } from "@/components/users/UsersTable"
import { UserDialog } from "@/components/users/UserDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers, type User } from "@/lib/data"
import { Plus, Search, Filter } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterUsers(query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterUsers(searchQuery, status)
  }

  const filterUsers = (query: string, status: string) => {
    let filtered = users

    if (query) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.role.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((user) => user.status === status)
    }

    setFilteredUsers(filtered)
  }

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
      const updated = users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u))
      setUsers(updated)
      setFilteredUsers(updated)
    } else {
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "",
        status: userData.status || "active",
        avatar:
          userData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "NA",
        joinDate: new Date().toISOString().split("T")[0],
        department: userData.department,
      }
      const updated = [...users, newUser]
      setUsers(updated)
      setFilteredUsers(updated)
    }
  }

  const handleDeleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id)
    setUsers(updated)
    setFilteredUsers(updated)
  }

  const handleViewUser = (user: User) => {
    alert(`Viewing details for: ${user.name}`)
  }

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
                placeholder="Search by name, email, or role..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <p className="text-2xl font-bold mt-1">{users.filter((u) => u.status === "active").length}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold mt-1">{new Set(users.map((u) => u.department)).size}</p>
            </div>
          </div>

          {/* Table */}
          <UsersTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
          />

          {/* Dialog */}
          <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selectedUser} onSave={handleSaveUser} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
