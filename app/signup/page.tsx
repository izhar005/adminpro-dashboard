"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2, Eye, EyeOff, Mail, LockIcon, User } from "lucide-react"
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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const { signup, loginWithGoogle, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    const result = await signup(name, email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Signup failed")
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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
      heading="Your whole admin panel, ready to ship."
      subheading="Users, orders, analytics and roles — already built, already responsive. Point it at your database and go live."
    >
      {/* Logo/Brand — repeated here so the form still stands alone if the
          branding panel is hidden on a narrow screen. */}
      <div className="mb-6 text-center sm:mb-8 short-height:mb-4">
        <LogoMark className="mx-auto mb-3 h-12 w-12 shadow-lg sm:mb-4 sm:h-14 sm:w-14 short-height:h-10 short-height:w-10 md:hidden" />
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl short-height:text-2xl">Get Started</h1>
        <p className="mt-2 text-sm md:text-base">
          <span className={authMutedClass}>Create your account to access the dashboard</span>
        </p>
      </div>

      <AuthError message={error} />

      <form onSubmit={handleEmailSignup} className="space-y-3 sm:space-y-4 short-height:space-y-2">
        <div className="space-y-2">
          <label htmlFor="name" className={authLabelClass}>
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 sm:h-5 sm:w-5 dark:text-zinc-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={`${authInputClass} py-2.5 pl-10 pr-4 sm:py-3`}
              required
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
              className={`${authInputClass} py-2.5 pl-10 pr-12 sm:py-3`}
              required
              minLength={6}
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <OrDivider />

      <button
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading}
        className={authSecondaryButtonClass}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Signing up...</span>
          </>
        ) : (
          <>
            <GoogleMark className="h-5 w-5" />
            <span>Sign up with Google</span>
          </>
        )}
      </button>

      <div className="mt-6 text-center">
        <p className={authMutedClass}>
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>
            Sign in
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500 short-height:mt-4 sm:mt-8 dark:text-zinc-500">
        By signing up, you agree to our{" "}
        <span className="underline underline-offset-2">Terms of Service</span> and{" "}
        <span className="underline underline-offset-2">Privacy Policy</span>.
      </p>
    </AuthShell>
  )
}
