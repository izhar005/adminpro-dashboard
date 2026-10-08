"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logout: () => void
  /** Updates the signed-in user's name/email and persists both storage copies. */
  updateProfile: (updates: { name: string; email: string }) => Promise<{ success: boolean; error?: string }>
  /** Verifies `currentPassword` against the stored credential, then rotates it. */
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>
}

/** Shape stored under the `registered_users` key. */
interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
  role: string
}

function readRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as RegisteredUser[]) : []
  } catch {
    return []
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for authentication (stored in localStorage)
const STORAGE_KEY = "auth_user"
const USERS_KEY = "registered_users"

const DEMO_USERS = [
  { email: "admin@admin.com", password: "admin123", name: "Admin User", role: "Administrator" },
  { email: "user@user.com", password: "user123", name: "Demo User", role: "User" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // TODO(auth): replaced by real server-side sessions in the Auth.js migration.
  // The gate is deliberate for now — reading localStorage only on the client means
  // the server render always says "signed out", so `isLoading` covers the window
  // between hydration and mount instead of bouncing an authenticated user to
  // /login. Once auth is server-side this whole effect disappears.
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser) as User)
      } catch {
        // Corrupt entry — treat as signed out.
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Check demo users
      const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

      if (demoUser) {
        const authenticatedUser: User = {
          id: `user_${Date.now()}`,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        }
        setUser(authenticatedUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))
        return { success: true }
      }

      // Check registered users from localStorage
      const registeredUser = readRegisteredUsers().find(
        (u) => u.email === email && u.password === password,
      )

      if (registeredUser) {
        const authenticatedUser: User = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role || "User",
        }
        setUser(authenticatedUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))
        return { success: true }
      }

      return { success: false, error: "Invalid email or password" }
    } catch {
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Check if user already exists
      const users = readRegisteredUsers()

      const existingUser = users.find((u) => u.email === email)
      if (existingUser) {
        return { success: false, error: "Email already registered" }
      }

      // Create new user
      const newUser: RegisteredUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role: "User",
      }

      users.push(newUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      // Auto-login after signup
      const authenticatedUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
      setUser(authenticatedUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser))

      return { success: true }
    } catch {
      return { success: false, error: "Signup failed. Please try again." }
    }
  }

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Mock Google user data (in production, this would come from Firebase/Google)
      const mockGoogleUser: User = {
        id: `google_${Date.now()}`,
        name: "John Doe",
        email: "john.doe@gmail.com",
        avatar: "https://placehold.co/100x100?text=JD",
        role: "Administrator",
      }

      setUser(mockGoogleUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoogleUser))
      return { success: true }
    } catch {
      return { success: false, error: "Google authentication failed" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    // `replace`, not `push` — otherwise Back returns to a page that immediately
    // bounces the user back to /login.
    router.replace("/login")
  }

  const updateProfile = async (
    updates: { name: string; email: string },
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const trimmedName = updates.name.trim()
    const trimmedEmail = updates.email.trim().toLowerCase()

    if (!trimmedName || !trimmedEmail) {
      return { success: false, error: "Name and email are both required" }
    }

    if (user && trimmedEmail !== user.email) {
      const taken = readRegisteredUsers().some(
        (u) => u.email.toLowerCase() === trimmedEmail && u.id !== user.id,
      )
      if (taken) {
        return { success: false, error: "That email is already registered" }
      }
    }

    if (!user) {
      return { success: false, error: "You need to be signed in" }
    }

    const updated: User = { ...user, name: trimmedName, email: trimmedEmail }

    setUser(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    // Keep the credentials list in sync, otherwise a profile edit would be lost
    // the next time the user signed out and back in.
    const users = readRegisteredUsers()
    const index = users.findIndex((u) => u.id === updated.id)
    if (index !== -1) {
      users[index] = { ...users[index], name: trimmedName, email: trimmedEmail }
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    return { success: true }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (!user) {
      return { success: false, error: "You need to be signed in" }
    }

    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters" }
    }

    if (currentPassword === newPassword) {
      return { success: false, error: "New password must be different from the current one" }
    }

    const registered = readRegisteredUsers()
    const record = registered.find((u) => u.id === user.id)

    // A demo/Google user has no row in `registered_users`, so there is nothing
    // to rotate — say so rather than silently pretending it worked.
    if (!record) {
      return {
        success: false,
        error: "This account signs in with a provider, so it has no password to change.",
      }
    }

    if (record.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect" }
    }

    const users = registered.map((u) =>
      u.id === user.id ? { ...u, password: newPassword } : u,
    )
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
