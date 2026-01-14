"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, UserIcon, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

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
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
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
                  <Button>Edit Profile</Button>
                  <Button variant="outline">Change Password</Button>
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
