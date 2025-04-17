"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type User } from "./auth-service"

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await authService.getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function signUp(name: string, email: string, password: string) {
    try {
      setLoading(true)
      await authService.signUp({ name, email, password })
      router.push("/auth/login?message=Please check your email to verify your account")
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true)
      const { user } = await authService.login({ email, password })
      setUser(user as unknown as User)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signUp, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
