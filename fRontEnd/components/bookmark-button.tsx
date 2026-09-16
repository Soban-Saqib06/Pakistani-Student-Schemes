"use client"

import { BookmarkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useAuthModal } from "@/lib/auth-modal-context"
import { useBookmarks } from "@/lib/bookmarks-context"
import { Button } from "@/components/ui/button"
import type { Scheme } from "@/lib/types"

interface BookmarkButtonProps {
  scheme: Scheme
  withLabel?: boolean
  size?: "sm" | "default" | "lg" | "icon" | "icon-sm"
  variant?: "ghost" | "outline" | "secondary"
}

export function BookmarkButton({
  scheme,
  withLabel = false,
  size = "icon-sm",
  variant = "ghost",
}: BookmarkButtonProps) {
  const { user } = useAuth()
  const { promptAuth } = useAuthModal()
  const { isBookmarked, toggle } = useBookmarks()
  const bookmarked = isBookmarked(scheme.id)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      promptAuth("login")
      return
    }
    void toggle(scheme)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={withLabel ? size : size.startsWith("icon") ? size : "icon-sm"}
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save scheme"}
      className={cn(bookmarked && "text-primary")}
    >
      <BookmarkIcon
        data-icon={withLabel ? "inline-start" : undefined}
        className={cn(bookmarked && "fill-current")}
      />
      {withLabel ? (bookmarked ? "Saved" : "Save") : null}
    </Button>
  )
}
