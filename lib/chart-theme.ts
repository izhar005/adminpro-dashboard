/**
 * Shared Recharts theming.
 *
 * The charts used to hardcode `oklch(var(--card))` for tooltip chrome, but the
 * design tokens in `globals.css` are HSL triplets (`--card: 0 0% 100%`), so
 * `oklch(0 0% 100%)` is not a valid color and the tooltip rendered unstyled.
 *
 * Using the `--chart-*` tokens instead of hardcoded colors also means the
 * series follow the active theme rather than staying fixed in dark mode.
 */

export const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
] as const

/** Shared `contentStyle` for every chart Tooltip. */
export const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.75rem",
  padding: "8px 12px",
  color: "hsl(var(--popover-foreground))",
  fontSize: "12px",
  boxShadow: "0 4px 12px hsl(var(--foreground) / 0.08)",
} as const

/**
 * Text colour inside the tooltip, applied to the label and to each row.
 *
 * Recharts defaults every tooltip row to `color: entry.color || '#000'`, and on
 * a pie chart `entry.color` is the *slice's own fill*. That is why "Sports : 12%"
 * rendered in the category's colour — orange on a near-black popover, and close
 * to invisible for the darker `--chart-*` tokens.
 *
 * Setting only `contentStyle.color` does not fix it: that styles the wrapper,
 * and the inline colour on the child `<li>` wins over inheritance. Both levels
 * have to be set explicitly.
 */
export const tooltipTextStyle = {
  color: "hsl(var(--popover-foreground))",
  fontWeight: 500,
} as const

/**
 * Spread onto every `<Tooltip>`.
 *
 * Bundled as one object so the text colour can't be fixed on one chart and
 * forgotten on the next.
 */
export const tooltipProps = {
  contentStyle: tooltipStyle,
  itemStyle: tooltipTextStyle,
  labelStyle: tooltipTextStyle,
} as const

export const axisTickStyle = { fontSize: 12 } as const