"use client"

import { useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { mockOrders, mockUsers } from "@/lib/data"
import { downloadCsv } from "@/lib/csv"
import { Download, FileText } from "lucide-react"

type ReportType = "orders" | "revenue" | "users"

const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  {
    value: "orders",
    label: "Order Log",
    description: "Every order with its customer, amount and status.",
  },
  {
    value: "revenue",
    label: "Revenue by Product",
    description: "Totals grouped by product, highest earning first.",
  },
  {
    value: "users",
    label: "Team Directory",
    description: "Everyone on the team with their role and department.",
  },
]

function inRange(date: string | undefined, from: string, to: string) {
  if (!date) return true
  if (from && date < from) return false
  if (to && date > to) return false
  return true
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("orders")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const report = useMemo(() => REPORT_TYPES.find((r) => r.value === reportType)!, [reportType])

  /** Rows for the current report, after the date range is applied. */
  const rows = useMemo(() => {
    if (reportType === "users") {
      return mockUsers.map((user) => ({
        id: user.id,
        a: user.name,
        b: user.email,
        c: user.role,
        d: user.department ?? "—",
        e: user.status,
        f: user.joinDate,
      }))
    }

    const scoped = mockOrders.filter((order) => inRange(order.date, from, to))

    if (reportType === "orders") {
      return scoped.map((order) => ({
        id: order.id,
        a: order.date,
        b: order.customer,
        c: order.product,
        d: `$${(order.amount / 100).toLocaleString()}`,
        e: order.status,
        f: order.paymentMethod,
      }))
    }

    return Array.from(
      scoped.reduce((acc, order) => {
        acc.set(order.product, (acc.get(order.product) ?? 0) + order.amount)
        return acc
      }, new Map<string, number>()),
      ([product, cents]) => ({
        id: product,
        a: product,
        b: `$${(cents / 100).toLocaleString()}`,
        c: String(scoped.filter((o) => o.product === product).length),
        d: "—",
        e: "—",
        f: "—",
      }),
    ).sort((x, y) => Number(y.b.replace(/[$,]/g, "")) - Number(x.b.replace(/[$,]/g, "")))
  }, [reportType, from, to])

  const handleExport = () => {
    const date = new Date().toISOString().split("T")[0]
    // `columns` covers both report shapes so the export always matches the table.
    downloadCsv(`${reportType}-report-${date}.csv`, rows, [
      { key: "a", header: "Name / Date" },
      { key: "b", header: "Customer / Product" },
      { key: "c", header: "Detail" },
      { key: "d", header: "Amount" },
      { key: "e", header: "Status" },
      { key: "f", header: "Extra" },
    ])
  }

  const clearRange = () => {
    setFrom("")
    setTo("")
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reports</h1>
              <p className="text-muted-foreground">
                Build a report, preview it, then export it as CSV.
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={handleExport}
              disabled={rows.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Report picker */}
          <div className="grid gap-4 md:grid-cols-3">
            {REPORT_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setReportType(option.value)}
                aria-pressed={reportType === option.value}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  reportType === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{option.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>

          {/* Date range — the team directory has no dates, so it hides the control
              rather than showing a filter that would silently do nothing. */}
          {reportType !== "users" && (
            <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-[180px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-[180px]"
                />
              </div>
              <Button variant="ghost" onClick={clearRange} disabled={!from && !to}>
                Clear dates
              </Button>
              <p className="ml-auto text-sm text-muted-foreground">
                {rows.length} {rows.length === 1 ? "row" : "rows"}
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <h2 className="font-semibold">{report.label}</h2>
              <Badge variant="secondary">Preview</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>
                    {reportType === "orders" ? "Date" : reportType === "users" ? "Name" : "Product"}
                  </TableHead>
                  <TableHead>
                    {reportType === "orders"
                      ? "Customer"
                      : reportType === "users"
                        ? "Email"
                        : "Revenue"}
                  </TableHead>
                  <TableHead>
                    {reportType === "orders"
                      ? "Product"
                      : reportType === "users"
                        ? "Role"
                        : "Orders"}
                  </TableHead>
                  <TableHead>
                    {reportType === "orders"
                      ? "Amount"
                      : reportType === "users"
                        ? "Department"
                        : "—"}
                  </TableHead>
                  <TableHead>
                    {reportType === "orders"
                      ? "Status"
                      : reportType === "users"
                        ? "Status"
                        : "—"}
                  </TableHead>
                  <TableHead>
                    {reportType === "orders" ? "Payment" : reportType === "users" ? "Joined" : "—"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 25).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap">{row.a}</TableCell>
                    <TableCell>{row.b}</TableCell>
                    <TableCell>{row.c}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.d}</TableCell>
                    <TableCell>
                      {row.e === "completed" || row.e === "active" ? (
                        <Badge variant="default">{row.e}</Badge>
                      ) : row.e === "—" ? (
                        "—"
                      ) : (
                        <Badge variant="secondary">{row.e}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{row.f}</TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No rows in this date range. Try clearing the dates.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {rows.length > 25 && (
              <p className="px-4 py-3 text-sm text-muted-foreground border-t border-border">
                Showing the first 25 of {rows.length} rows. The CSV export contains all{" "}
                {rows.length}.
              </p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}