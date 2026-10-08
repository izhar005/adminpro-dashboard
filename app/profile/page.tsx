"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, UserIcon, Shield, Calendar } from "lucide-react"

type OpenDialog = "edit" | "password" | null

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth()

  const [openDialog, setOpenDialog] = useState<OpenDialog>(null)
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null)
  const [saving, setSaving] = useState(false)

  // Edit profile
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")

  // Change password
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  if (!user) return null

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const closeDialog = () => {
    setOpenDialog(null)
    setStatus(null)
    // Clear the password fields — leaving a new password sitting in state after
    // the dialog closes is exactly the sort of thing you don't want.
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const openEditDialog = () => {
    setName(user.name)
    setEmail(user.email)
    setStatus(null)
    setOpenDialog("edit")
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const result = await updateProfile({ name, email })
    setSaving(false)

    if (result.success) {
      closeDialog()
      return
    }
    setStatus({ kind: "error", message: result.error ?? "Could not save your profile" })
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setStatus({ kind: "error", message: "New passwords do not match" })
      return
    }

    setSaving(true)
    const result = await changePassword(currentPassword, newPassword)
    setSaving(false)

    if (result.success) {
      closeDialog()
      return
    }
    setStatus({ kind: "error", message: result.error ?? "Could not change your password" })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>

          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground text-center max-w-[132px]">
                  Avatars are generated from your initials.
                </p>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="h-5 w-5" />
                    <span>Role: {user.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <UserIcon className="h-5 w-5" />
                    <span>User ID: {user.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span>Member since {new Date().getFullYear()}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={openEditDialog}>Edit Profile</Button>
                  <Button variant="outline" onClick={() => { setStatus(null); setOpenDialog("password") }}>
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Login Sessions</p>
                <p className="text-2xl font-bold mt-1">1</p>
              </div>
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="text-sm font-medium mt-1">Just now</p>
              </div>
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <div className="text-sm font-medium mt-1">
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Edit Profile */}
          <Dialog open={openDialog === "edit"} onOpenChange={(open) => !open && closeDialog()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update the name and email on your account.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profileName">Name</Label>
                  <Input
                    id="profileName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={status?.kind === "error"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileEmail">Email</Label>
                  <Input
                    id="profileEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={status?.kind === "error"}
                  />
                </div>
                {status && (
                  <p role="alert" className="text-sm text-destructive">
                    {status.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Change Password */}
          <Dialog
            open={openDialog === "password"}
            onOpenChange={(open) => !open && closeDialog()}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Confirm your current password, then pick a new one of at least 6 characters.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    aria-invalid={status?.kind === "error"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    aria-invalid={status?.kind === "error"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-invalid={status?.kind === "error"}
                  />
                </div>
                {status && (
                  <p role="alert" className="text-sm text-destructive">
                    {status.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} disabled={saving}>
                  {saving ? "Updating…" : "Update password"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
