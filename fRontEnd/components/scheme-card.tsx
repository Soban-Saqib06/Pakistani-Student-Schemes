import Link from "next/link"
import { ArrowRightIcon, BuildingIcon, MapPinIcon } from "lucide-react"

import type { Scheme } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { DeadlineBadge } from "@/components/deadline-badge"
import { BookmarkButton } from "@/components/bookmark-button"

export function SchemeCard({ scheme, viewMode = "grid" }: { scheme: Scheme; viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="glass-card-container group/scheme flex w-full min-w-0 max-w-full">
        <div className="glass-box relative z-10 flex w-full min-w-0 max-w-full flex-col justify-between gap-4 overflow-hidden rounded-2xl p-4 sm:p-5 md:flex-row md:items-center">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {scheme.eligibilityName ? (
                <Badge variant="outline" className="border-[#588157]/60 bg-[#1c2b24]/80 text-[#dad7cd] text-xs font-bold px-2.5 py-0.5 shadow-2xs">
                  {scheme.eligibilityName}
                </Badge>
              ) : null}
              <DeadlineBadge deadline={scheme.deadline} />
            </div>

            <h3 className="text-base sm:text-lg font-bold tracking-tight leading-snug text-[#dad7cd] group-hover/scheme:text-[#35a333] transition-colors">
              <Link
                href={`/schemes/${scheme.id}`}
                className="before:absolute before:inset-0 text-[#dad7cd] group-hover/scheme:text-[#35a333] transition-colors"
              >
                {scheme.title}
              </Link>
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm font-normal leading-relaxed text-[#dad7cd]/80 line-clamp-2 max-w-3xl">
              {scheme.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-[#a3b18a]">
              <span className="flex items-center gap-1.5 min-w-0">
                <BuildingIcon className="size-4 shrink-0 text-[#35a333]" />
                <span className="truncate font-semibold text-[#dad7cd]">{scheme.organization}</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPinIcon className="size-4 shrink-0 text-[#35a333]" />
                <span className="truncate text-[#dad7cd]/75">{scheme.province}</span>
              </span>
            </div>
          </div>

          {/* Right Side / Meta & Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#588157]/35 md:pt-0 md:border-t-0 md:flex-col md:items-end md:justify-center shrink-0">
            <div className="rounded-xl bg-[#1c2b24]/80 px-3 py-1.5 text-xs sm:text-sm text-[#dad7cd] border border-[#588157]/45 shadow-2xs max-w-xs truncate">
              <strong className="font-bold text-[#35a333]">Benefit: </strong>
              <span className="text-[#dad7cd]">{scheme.benefits}</span>
            </div>

            <div className="flex items-center gap-2 relative z-20">
              <BookmarkButton scheme={scheme} />
              <Link
                href={`/schemes/${scheme.id}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#2e7d32] hover:bg-[#256b2a] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // When viewMode is "grid":
  // On mobile (< md / vertical mode): Render as clean, non-overflowing single-column list card
  // On desktop (md+): Render as multi-column card
  return (
    <>
      {/* Mobile/Vertical Mode (< md): Auto-switches to full-width card so it never extends beyond screen */}
      <div className="md:hidden glass-card-container group/scheme flex w-full min-w-0 max-w-full">
        <div className="glass-box relative z-10 flex w-full min-w-0 max-w-full flex-col justify-between gap-3.5 overflow-hidden rounded-2xl p-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {scheme.eligibilityName ? (
                <Badge variant="outline" className="border-[#588157]/60 bg-[#1c2b24]/80 text-[#dad7cd] text-xs font-bold px-2.5 py-0.5 shadow-2xs">
                  {scheme.eligibilityName}
                </Badge>
              ) : null}
              <DeadlineBadge deadline={scheme.deadline} />
            </div>

            <h3 className="text-base font-bold tracking-tight leading-snug text-[#dad7cd] group-hover/scheme:text-[#35a333] transition-colors">
              <Link
                href={`/schemes/${scheme.id}`}
                className="before:absolute before:inset-0 text-[#dad7cd] group-hover/scheme:text-[#35a333] transition-colors"
              >
                {scheme.title}
              </Link>
            </h3>

            <p className="mt-1.5 text-xs font-normal leading-relaxed text-[#dad7cd]/80 line-clamp-2">
              {scheme.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#a3b18a]">
              <span className="flex items-center gap-1.5 min-w-0">
                <BuildingIcon className="size-3.5 shrink-0 text-[#35a333]" />
                <span className="truncate font-semibold text-[#dad7cd]">{scheme.organization}</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPinIcon className="size-3.5 shrink-0 text-[#35a333]" />
                <span className="truncate text-[#dad7cd]/75">{scheme.province}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#588157]/35">
            <div className="rounded-lg bg-[#1c2b24]/80 px-2.5 py-1 text-xs text-[#dad7cd] border border-[#588157]/45 shadow-2xs max-w-[55%] truncate">
              <strong className="font-bold text-[#35a333]">Benefit: </strong>
              <span className="text-[#dad7cd]">{scheme.benefits}</span>
            </div>

            <div className="flex items-center gap-2 relative z-20">
              <BookmarkButton scheme={scheme} />
              <Link
                href={`/schemes/${scheme.id}`}
                className="inline-flex items-center gap-1 rounded-md bg-[#2e7d32] hover:bg-[#256b2a] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                <span>Details</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Mode (md+): Grid card */}
      <div className="hidden md:flex glass-card-container group/scheme w-full min-w-0 max-w-full">
        <div className="glass-box relative z-10 flex w-full min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl p-5">
          {/* Top Header Row */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {scheme.eligibilityName ? (
                  <Badge variant="outline" className="border-[#588157]/60 bg-[#1c2b24]/80 text-[#dad7cd] text-xs font-bold px-2.5 py-0.5 shadow-2xs">
                    {scheme.eligibilityName}
                  </Badge>
                ) : null}
                <DeadlineBadge deadline={scheme.deadline} />
              </div>
              <span className="relative z-20 shrink-0">
                <BookmarkButton scheme={scheme} />
              </span>
            </div>

            {/* Scheme Title */}
            <h3 className="mt-3.5 text-lg font-bold tracking-tight leading-snug text-[#dad7cd] group-hover/scheme:text-[#35a333] transition-colors">
              <Link
                href={`/schemes/${scheme.id}`}
                className="before:absolute before:inset-0 text-[#dad7cd] group-hover/scheme:text-[#35a333] transition-colors"
              >
                {scheme.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="mt-2.5 text-sm font-normal leading-relaxed text-[#dad7cd]/80 line-clamp-3">
              {scheme.description}
            </p>
          </div>

          {/* Bottom Details & Meta */}
          <div className="mt-5 pt-3.5 border-t border-[#588157]/35 min-w-0">
            <div className="flex flex-col gap-2 text-sm text-[#a3b18a]">
              <span className="flex items-center gap-2 min-w-0">
                <BuildingIcon className="size-4 shrink-0 text-[#35a333]" />
                <span className="truncate font-semibold text-[#dad7cd]">{scheme.organization}</span>
              </span>
              <span className="flex items-center gap-2 min-w-0">
                <MapPinIcon className="size-4 shrink-0 text-[#35a333]" />
                <span className="truncate text-[#dad7cd]/75">{scheme.province}</span>
              </span>
            </div>

            <div className="mt-3.5 flex items-center justify-between rounded-xl bg-[#1c2b24]/80 px-3.5 py-2.5 text-sm text-[#dad7cd] border border-[#588157]/45 shadow-2xs min-w-0">
              <span className="truncate">
                <strong className="font-bold text-[#35a333]">Benefit: </strong>
                <span className="text-[#dad7cd]">{scheme.benefits}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
