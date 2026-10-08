const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

/**
 * Human-readable age of a timestamp: "just now", "5 mins ago", "3 hours ago",
 * "Yesterday", "12 Mar".
 *
 * `now` is a parameter rather than a hidden `Date.now()` so callers can pin it —
 * anything rendered during SSR has to produce byte-identical output on the
 * server and the client, and those two clocks never agree.
 */
export function relativeTime(timestamp: number, now: number = Date.now()): string {
  const diff = now - timestamp

  // Clock skew (a machine whose clock runs behind) can put a timestamp in the
  // future; "just now" is more honest than a negative age.
  if (diff < MINUTE) return "just now"

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE)
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }

  if (diff < 2 * DAY) return "Yesterday"
  if (diff < WEEK) return `${Math.floor(diff / DAY)} days ago`

  return formatDate(timestamp)
}

/**
 * Absolute date, for the tooltip behind a relative label and for rows old
 * enough that "42 days ago" stops being useful.
 *
 * The locale is pinned rather than left to the runtime default: a Node server
 * and a browser can default to different locales, and this string is rendered
 * during hydration — an unpinned `toLocaleDateString` would produce mismatched
 * markup for a buyer whose machine is set to a language the server isn't.
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Absolute date + time, for the `title` attribute on a notification row. */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
