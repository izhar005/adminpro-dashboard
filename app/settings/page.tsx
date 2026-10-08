"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Moon, Sun, Monitor, Bell } from "lucide-react"

export default function SettingsPage() {
  const { settings, updateSettings } = useApp()
  const { theme, setTheme } = useTheme()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Customize your dashboard experience</p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Theme Mode</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() =>
                      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
                    }
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border hover:bg-accent transition-colors"
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value: "small" | "medium" | "large") => updateSettings({ fontSize: value })}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Layout</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sidebar" className="font-medium">
                    Collapse Sidebar by Default
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Sidebar will be collapsed when you open the app</p>
                </div>
                <Switch
                  id="sidebar"
                  checked={settings.sidebarCollapsed}
                  onCheckedChange={(checked) => updateSettings({ sidebarCollapsed: checked })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderNotif" className="font-medium">
                    Order Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Get notified when new orders are placed</p>
                </div>
                <Switch
                  id="orderNotif"
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ orderNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="userNotif" className="font-medium">
                    User Activity
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Get notified about new user registrations</p>
                </div>
                <Switch
                  id="userNotif"
                  checked={settings.userActivityNotifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ userActivityNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemNotif" className="font-medium">
                    System Updates
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Receive notifications about system updates</p>
                </div>
                <Switch
                  id="systemNotif"
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ systemNotifications: checked })
                  }
                />
              </div>
            </div>
          </Card>

          <p className="text-sm text-muted-foreground">
            Changes apply immediately and are saved to this browser.
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
