/**
 * Minimal RFC 4180 CSV writer.
 *
 * Kept dependency-free on purpose — pulling in `papaparse` for ~30 lines of
 * string handling isn't worth the bundle, and this stays readable for anyone
 * extending it.
 */

/** Quote a single field if it contains a delimiter, quote, or newline. */
function escapeField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Builds a CSV string from a list of records.
 *
 * Column order comes from `columns` rather than the rows, so a record missing a
 * key still produces a correctly-shaped row instead of a short line.
 */
export function toCsv<T extends object>(
  rows: T[],
  columns: { key: keyof T & string; header: string }[],
): string {
  const header = columns.map((c) => escapeField(c.header)).join(",")

  const body = rows.map((row) => {
    const record = row as Record<string, unknown>
    return columns
      .map((c) => {
        const value = record[c.key]
        return escapeField(value === null || value === undefined ? "" : String(value))
      })
      .join(",")
  })

  return [header, ...body].join("\r\n")
}

/**
 * Triggers a browser download of `content`.
 *
 * The object URL is revoked on the next tick — revoking it synchronously can
 * cancel the download in some browsers before it starts.
 */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** Convenience wrapper for the common "export these rows as CSV" case. */
export function downloadCsv<T extends object>(
  filename: string,
  rows: T[],
  columns: { key: keyof T & string; header: string }[],
): void {
  downloadFile(filename, toCsv(rows, columns), "text/csv;charset=utf-8;")
}