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

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
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
      const registeredUsers = localStorage.getItem(USERS_KEY)
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers)
        const registeredUser = users.find((u: any) => u.email === email && u.password === password)

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
      }

      return { success: false, error: "Invalid email or password" }
    } catch (error) {
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
      const registeredUsers = localStorage.getItem(USERS_KEY)
      const users = registeredUsers ? JSON.parse(registeredUsers) : []

      const existingUser = users.find((u: any) => u.email === email)
      if (existingUser) {
        return { success: false, error: "Email already registered" }
      }

      // Create new user
      const newUser = {
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
    } catch (error) {
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
    } catch (error) {
      return { success: false, error: "Google authentication failed" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    router.push("/login")
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
