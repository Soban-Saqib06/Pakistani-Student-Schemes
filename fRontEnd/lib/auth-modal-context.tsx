"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

export type AuthMode = "login" | "register"

interface AuthModalContextValue {
  open: boolean
  mode: AuthMode
  setOpen: (open: boolean) => void
  setMode: (mode: AuthMode) => void
  promptAuth: (mode?: AuthMode) => void
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>("login")

  const promptAuth = useCallback((next: AuthMode = "login") => {
    setMode(next)
    setOpen(true)
  }, [])

  const value = useMemo<AuthModalContextValue>(
    () => ({ open, mode, setOpen, setMode, promptAuth }),
    [open, mode],
  )

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider")
  return ctx
}
