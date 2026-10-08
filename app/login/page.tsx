"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, Eye, EyeOff, Mail, LockIcon } from "lucide-react"
import { LogoMark } from "@/components/brand/LogoMark"
import { GoogleMark } from "@/components/auth/GoogleMark"
import {
  AuthShell,
  OrDivider,
  AuthError,
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
  authSecondaryButtonClass,
  authMutedClass,
  authLinkClass,
} from "@/components/auth/AuthShell"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, loginWithGoogle, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Authentication failed")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsGoogleLoading(true)
    const result = await loginWithGoogle()

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Authentication failed")
      setIsGoogleLoading(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <AuthShell
      heading="Welcome back to the dashboard."
      subheading="Pick up where you left off — your metrics, orders and team are right where you left them."
    >
      {/* Logo shown here as well as on the branding panel: at `md` and up both
          are on screen together, and duplicating a mark is cheaper than hiding
          it. */}
      <div className="mb-6 text-center sm:mb-8 short-height:mb-4">
        <LogoMark className="mx-auto mb-3 h-12 w-12 shadow-lg sm:mb-4 sm:h-14 sm:w-14 short-height:h-10 short-height:w-10 md:hidden" />
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl short-height:text-2xl">Welcome Back</h1>
        <p className="mt-2 text-sm md:text-base">
          <span className={authMutedClass}>Sign in to access your dashboard</span>
        </p>
      </div>

      <AuthError message={error} />

      <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4 short-height:space-y-2">
        <div className="space-y-2">
          <label htmlFor="email" className={authLabelClass}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 sm:h-5 sm:w-5 dark:text-zinc-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={`${authInputClass} py-2.5 pl-10 pr-4 sm:py-3`}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 sm:h-5 sm:w-5 dark:text-zinc-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${authInputClass} py-2.5 pl-10 pr-12 sm:py-3`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className={authPrimaryButtonClass}>
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <OrDivider />

      <button
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className={authSecondaryButtonClass}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <GoogleMark className="h-5 w-5" />
            <span>Continue with Google</span>
          </>
        )}
      </button>

      <div className="mt-5 text-center sm:mt-6 short-height:mt-4">
        <p className={authMutedClass}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={authLinkClass}>
            Sign up
          </Link>
        </p>
      </div>

      {/* Kept because this template ships with a seeded account — a buyer
          opening the repo needs somewhere to find the credentials. */}
      <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-3 short-height:mt-4 short-height:p-2.5 sm:mt-8 sm:p-4 dark:border-zinc-300 dark:bg-white">
        <p className="mb-2 text-xs font-medium">Demo Credentials</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Email: <span className="font-mono">admin@admin.com</span>
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Password: <span className="font-mono">admin123</span>
        </p>
      </div>
    </AuthShell>
  )
}
