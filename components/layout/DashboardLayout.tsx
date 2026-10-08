"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { useApp } from "@/contexts/AppContext"
import { cn } from "@/lib/utils"
import { SIDEBAR_GUTTER_CLASS } from "@/lib/sidebar-layout"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { settings } = useApp()
  const isCollapsed = settings.sidebarCollapsed
  const fontSize = settings.fontSize
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      className={cn(
        "relative min-h-screen bg-background antialiased selection:bg-primary/10",
        // `fontSize` was previously persisted from the settings page but never
        // applied to anything, so the control did nothing visible.
        fontSize === "small" && "text-[14px]",
        fontSize === "large" && "text-[18px]",
      )}
    >
      {/* Sidebar - Mobile overlay handles internally */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onMobileClose={() => setMobileOpen(false)} 
      />

      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out min-h-screen",
          // The gutter comes from the same source as the sidebar's width and the
          // navbar's offset — all three in `lib/sidebar-layout`. They were three
          // hardcoded numbers in three files, which is how a 16px gap appeared.
          isCollapsed ? SIDEBAR_GUTTER_CLASS.collapsed : SIDEBAR_GUTTER_CLASS.expanded,
          "will-change-[padding]" // GPU ko batata hai ke padding change hogi
        )}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        
        {/* Main Content Area */}
        <main className="pt-16 min-h-screen flex flex-col">
          <div className={cn(
            "flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full",
            "animate-in fade-in duration-500" // Standard Tailwind Animate
          )}>
            {children}
          </div>
          
          {/* Footer (Optional but professional) */}
          <footer className="p-4 text-center text-xs text-muted-foreground border-t border-border/50">
            © {new Date().getFullYear()} Your Dashboard Name
          </footer>
        </main>
      </div>
      
      {/* Mobile Overlay Darkener */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  )
}