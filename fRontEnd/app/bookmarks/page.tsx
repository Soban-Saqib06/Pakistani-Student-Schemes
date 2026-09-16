"use client"

import Link from "next/link"
import { BookmarkIcon, LogInIcon, SearchIcon } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useAuthModal } from "@/lib/auth-modal-context"
import { useBookmarks } from "@/lib/bookmarks-context"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { SchemeCard } from "@/components/scheme-card"

export default function BookmarksPage() {
  const { user, loading } = useAuth()
  const { promptAuth } = useAuthModal()
  const { schemes, loading: bookmarksLoading } = useBookmarks()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookmarkIcon className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saved schemes</h1>
          <p className="text-sm text-muted-foreground">Scholarships and grants you&apos;ve bookmarked.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : !user ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LogInIcon />
            </EmptyMedia>
            <EmptyTitle>Log in to see your bookmarks</EmptyTitle>
            <EmptyDescription>
              Your saved schemes are tied to your account so you can access them anytime.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => promptAuth("login")}>
              <LogInIcon data-icon="inline-start" />
              Log in
            </Button>
          </EmptyContent>
        </Empty>
      ) : bookmarksLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookmarkIcon />
            </EmptyMedia>
            <EmptyTitle>No bookmarks yet</EmptyTitle>
            <EmptyDescription>
              Browse schemes and tap the bookmark icon to save the ones you&apos;re interested in.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link href="/" />}>
              <SearchIcon data-icon="inline-start" />
              Browse schemes
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  )
}
