"use client"

import { AuthProvider } from "@/lib/auth-context"
import { AuthModalProvider } from "@/lib/auth-modal-context"
import { BookmarksProvider } from "@/lib/bookmarks-context"
import { Toaster } from "@/components/ui/sonner"
import { AuthDialog } from "@/components/auth-dialog"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <BookmarksProvider>
          {children}
          <AuthDialog />
          <Toaster position="top-center" />
        </BookmarksProvider>
      </AuthModalProvider>
    </AuthProvider>
  )
}
