"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { useApp } from "@/contexts/AppContext"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { settings } = useApp()
  const isCollapsed = settings.sidebarCollapsed
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration error se bachne ke liye aur initial load smooth karne ke liye
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="relative min-h-screen bg-background antialiased selection:bg-primary/10">
      {/* Sidebar - Mobile overlay handles internally */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onMobileClose={() => setMobileOpen(false)} 
      />

      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out min-h-screen",
          "md:pl-64",
          isCollapsed && "md:pl-20", // Standard collapsed width
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