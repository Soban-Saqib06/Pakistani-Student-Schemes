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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3.5">
        <BookmarkIcon className="size-7 text-[#a3b18a]" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Saved schemes</h1>
          <p className="text-base text-muted-foreground">Scholarships and grants you&apos;ve bookmarked.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-md" />
          ))}
        </div>
      ) : !user ? (
        <Empty className="rounded-md border p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LogInIcon />
            </EmptyMedia>
            <EmptyTitle className="text-xl font-bold">Log in to see your bookmarks</EmptyTitle>
            <EmptyDescription className="text-base">
              Your saved schemes are tied to your account so you can access them anytime.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="lg" className="bg-pak-green hover:bg-pak-green/90 text-white font-semibold cursor-pointer shadow-xs" onClick={() => promptAuth("login")}>
              <LogInIcon data-icon="inline-start" />
              Log in
            </Button>
          </EmptyContent>
        </Empty>
      ) : bookmarksLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-md" />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <Empty className="rounded-md border">
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
            <Button render={<Link href="/browse" />}>
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
