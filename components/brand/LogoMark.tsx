import { cn } from "@/lib/utils"

/**
 * The AdminPro mark: a rounded square split down the middle, black on the left
 * and white on the right, with the trend arrow crossing the seam.
 *
 * The arrow is drawn twice and each copy is clipped to one half — white over the
 * black half, black over the white half. Drawing it once in a single colour
 * makes it vanish on whichever half matches it; splitting it means the stroke
 * stays visible across the whole mark while still reading as one continuous line.
 *
 * The clipping uses nested `<svg>` viewports rather than `clipPath`, which needs
 * an `id`. Ids collide when the mark appears more than once on a page (the login
 * page renders both the mark and the header's).
 *
 * Colours are literal rather than theme tokens: this is a logo, so it has to
 * look the same in both light and dark mode instead of inverting.
 */

/** Trend line, then the corner that forms the arrowhead. */
const ARROW = "M7 22 L12.5 16.5 L16.5 20 L25 10"
const ARROW_HEAD = "M20.5 10 H25 V14.5"

const STROKE = {
  fill: "none",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* Black base first, then the white half laid over its right side. Both
          are full rounded rects; the nested viewport trims the white one so only
          the right half and its rounded corners survive. */}
      <rect width="32" height="32" rx="8" fill="#000000" />
      <svg x="16" y="0" width="16" height="32" viewBox="16 0 16 32">
        <rect width="32" height="32" rx="8" fill="#ffffff" />
      </svg>

      {/* Arrow, one copy per half, each in the opposite colour to its ground. */}
      <svg x="0" y="0" width="16" height="32" viewBox="0 0 16 32">
        <path d={ARROW} stroke="#ffffff" {...STROKE} />
        <path d={ARROW_HEAD} stroke="#ffffff" {...STROKE} />
      </svg>
      <svg x="16" y="0" width="16" height="32" viewBox="16 0 16 32">
        <path d={ARROW} stroke="#000000" {...STROKE} />
        <path d={ARROW_HEAD} stroke="#000000" {...STROKE} />
      </svg>
    </svg>
  )
}
