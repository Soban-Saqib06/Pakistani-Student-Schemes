"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { api, decodeRole, getStoredUser, setSession } from "./api"
import type { User } from "./types"

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  loading: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    setLoading(false)
  }, [])

  const persist = useCallback((next: User) => {
    const role = next.role ?? decodeRole(next.token)
    const withRole = { ...next, role }
    setSession(withRole)
    setUser(withRole)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login({ email, password })
      persist({ id: res.id, name: res.name, email: res.email, token: res.token, role: res.role })
    },
    [persist],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api.register({ name, email, password })
      // Auto-login after successful registration.
      const res = await api.login({ email, password })
      persist({ id: res.id, name: res.name, email: res.email, token: res.token, role: res.role })
    },
    [persist],
  )

  const logout = useCallback(() => {
    setSession(null)
    setUser(null)
  }, [])

  const isAdmin = user?.role === "Admin"

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      isLoading: loading,
      login,
      register,
      logout,
    }),
    [user, isAdmin, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
