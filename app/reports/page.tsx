"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">Generate and download business reports</p>
          </div>
          <Card className="p-12 flex flex-col items-center justify-center min-h-[400px]">
            <FileText className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reports Module Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Generate custom reports, export data, and schedule automated reporting will be available here.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
