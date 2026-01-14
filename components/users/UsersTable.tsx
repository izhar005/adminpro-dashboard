"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/data"
import { cn } from "@/lib/utils"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
  onView: (user: User) => void
}

export function UsersTable({ users, onEdit, onDelete, onView }: UsersTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedUsers((prev) => (prev.length === users.length ? [] : users.map((u) => u.id)))
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox checked={selectedUsers.length === users.length} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={cn("hover:bg-accent/50 transition-colors", selectedUsers.includes(user.id) && "bg-accent/30")}
            >
              <TableCell>
                <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => toggleUser(user.id)} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{user.role}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">{user.department}</p>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">{user.joinDate}</p>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
