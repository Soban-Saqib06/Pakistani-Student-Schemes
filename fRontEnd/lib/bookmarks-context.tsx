"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { api, ApiError } from "./api"
import { useAuth } from "./auth-context"
import type { Scheme } from "./types"

interface BookmarksContextValue {
  ids: Set<number>
  schemes: Scheme[]
  loading: boolean
  isBookmarked: (id: number) => boolean
  toggle: (scheme: Scheme) => Promise<void>
  refresh: () => Promise<void>
}

const BookmarksContext = createContext<BookmarksContextValue | undefined>(undefined)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [pending, setPending] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setSchemes([])
      return
    }
    setLoading(true)
    try {
      const data = await api.listBookmarks(user.id)
      setSchemes(data)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout()
    } finally {
      setLoading(false)
    }
  }, [user, logout])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const ids = useMemo(() => new Set(schemes.map((s) => s.id)), [schemes])

  const toggle = useCallback(
    async (scheme: Scheme) => {
      if (!user) return
      if (pending.has(scheme.id)) return
      const currentlyBookmarked = ids.has(scheme.id)
      setPending((p) => new Set(p).add(scheme.id))

      // Optimistic update.
      setSchemes((prev) =>
        currentlyBookmarked ? prev.filter((s) => s.id !== scheme.id) : [...prev, scheme],
      )

      try {
        if (currentlyBookmarked) {
          await api.removeBookmark(user.id, scheme.id)
          toast.success("Removed from bookmarks")
        } else {
          await api.addBookmark(user.id, scheme.id)
          toast.success("Scheme added to bookmarks")
        }
      } catch (err) {
        // Roll back.
        setSchemes((prev) =>
          currentlyBookmarked ? [...prev, scheme] : prev.filter((s) => s.id !== scheme.id),
        )
        if (err instanceof ApiError && err.status === 401) {
          toast.error("Session expired. Please log in again.")
          logout()
        } else {
          toast.error("Could not update bookmark. Please try again.")
        }
      } finally {
        setPending((p) => {
          const next = new Set(p)
          next.delete(scheme.id)
          return next
        })
      }
    },
    [user, ids, pending, logout],
  )

  const value = useMemo<BookmarksContextValue>(
    () => ({
      ids,
      schemes,
      loading,
      isBookmarked: (id: number) => ids.has(id),
      toggle,
      refresh,
    }),
    [ids, schemes, loading, toggle, refresh],
  )

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error("useBookmarks must be used within BookmarksProvider")
  return ctx
}
