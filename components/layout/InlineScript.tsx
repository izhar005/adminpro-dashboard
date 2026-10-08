/**
 * An inline `<script>` that the browser runs synchronously while parsing the
 * HTML, i.e. before the first paint.
 *
 * `dangerouslySetInnerHTML` scripts are not re-executed when React re-inserts
 * the DOM during hydration, and React also warns when rendering produces a
 * `<script>` in development. Flipping `type` to `text/plain` on the client
 * silences that warning and makes the script a no-op there — the value has
 * already been applied by then. `suppressHydrationWarning` covers the type
 * difference between the two renders.
 *
 * https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
