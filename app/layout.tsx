import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { THEME_STORAGE_KEY } from "@/lib/theme"
import { AppProvider } from "@/contexts/AppContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { InlineScript } from "@/components/layout/InlineScript"
import "./globals.css"

// The `variable` names must match the ones referenced in globals.css
// (`--font-sans: var(--font-geist-sans)`), otherwise the fonts load but never
// actually apply.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Premium Admin Dashboard | Next-Gen SaaS",
    template: "%s | AdminPro",
  },
  description:
    "Production-ready admin dashboard with modern design and advanced features",
  applicationName: "AdminPro",
  authors: [{ name: "AdminPro" }],
  openGraph: {
    title: "Premium Admin Dashboard | Next-Gen SaaS",
    description:
      "Production-ready admin dashboard with modern design and advanced features",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // `suppressHydrationWarning` is required here, not decorative: the inline
    // script below sets `class` and `style` on this element before React
    // hydrates, so the real DOM and React's payload disagree by design. Without
    // it React throws a hydration error and re-renders the whole tree.
    // https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before first paint so the correct theme is applied immediately.
          Without this, a dark-mode visitor sees a white flash on every load
          while React hydrates.

          Reads localStorage first and falls back to the OS preference, so a
          visitor who has never chosen a theme still gets the right one — and
          the same fallback has to be duplicated in `ThemeContext`'s
          `useLayoutEffect`, which re-applies this after a dev remount.
        */}
        <InlineScript
          html={`(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
