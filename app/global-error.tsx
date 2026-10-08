"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import "./globals.css"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Application error</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A critical error occurred. Please try again — if the problem
              persists, check the server logs.
            </p>

            {error.digest && (
              <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                Reference: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}