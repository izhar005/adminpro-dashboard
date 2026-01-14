"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Deep dive into your business metrics</p>
          </div>
          <Card className="p-12 flex flex-col items-center justify-center min-h-[400px]">
            <BarChart3 className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Detailed analytics dashboard with custom reports, data visualization, and insights will be available here.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
