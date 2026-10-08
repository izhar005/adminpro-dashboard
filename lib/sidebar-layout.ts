/**
 * Sidebar geometry, in one place.
 *
 * The sidebar width has to agree across three separate files — the sidebar's
 * own class, the navbar's left offset, and the content gutter in
 * DashboardLayout. When they drift the result is a gap or an overlap, so they
 * all import from here rather than repeating the numbers.
 *
 * The values must stay in the same scale as the Tailwind classes they replace:
 * `16` = 4rem = 64px, `64` = 16rem = 256px.
 */
export const SIDEBAR_WIDTH_CLASS = {
  /** Expanded rail: 16rem (256px). */
  expanded: "md:w-64",
  /** Collapsed rail: 4rem (64px) — icon-only. */
  collapsed: "md:w-16",
} as const

/** The same two widths expressed as content offsets for fixed positioning. */
export const SIDEBAR_OFFSET_CLASS = {
  expanded: "md:left-64",
  collapsed: "md:left-16",
} as const

export const SIDEBAR_GUTTER_CLASS = {
  expanded: "md:pl-64",
  collapsed: "md:pl-16",
} as const

export const SIDEBAR_WIDTH_PX = {
  expanded: 256,
  collapsed: 64,
} as const