import Link from "next/link"
import { BuildingIcon, MapPinIcon } from "lucide-react"

import type { Scheme } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeadlineBadge } from "@/components/deadline-badge"
import { BookmarkButton } from "@/components/bookmark-button"

export function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <div className="glass-card-container group/scheme flex w-full">
      <div className="glass-box relative z-10 flex w-full flex-col justify-between overflow-hidden rounded-2xl p-5">
        {/* Top Header Row */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {scheme.eligibilityName ? (
                <Badge variant="outline" className="border-white/15 bg-white/10 text-white text-[11px] font-medium backdrop-blur-xs">
                  {scheme.eligibilityName}
                </Badge>
              ) : null}
              <DeadlineBadge deadline={scheme.deadline} />
            </div>
            <span className="relative z-20">
              <BookmarkButton scheme={scheme} />
            </span>
          </div>

          {/* Scheme Title */}
          <h3 className="mt-3 text-base font-bold tracking-tight leading-snug text-white">
            <Link
              href={`/schemes/${scheme.id}`}
              className="before:absolute before:inset-0 text-white"
            >
              {scheme.title}
            </Link>
          </h3>

          {/* Description - crisp white/silver */}
          <p className="mt-2 text-xs font-normal leading-relaxed text-neutral-200/90 line-clamp-3">
            {scheme.description}
          </p>
        </div>

        {/* Bottom Details & Meta */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex flex-col gap-1.5 text-xs text-neutral-300">
            <span className="flex items-center gap-2">
              <BuildingIcon className="size-3.5 shrink-0 text-emerald-400" />
              <span className="truncate font-medium text-white">{scheme.organization}</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPinIcon className="size-3.5 shrink-0 text-neutral-400" />
              <span className="truncate text-neutral-300">{scheme.province}</span>
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs text-neutral-200 border border-white/10 backdrop-blur-xs">
            <span className="truncate">
              <strong className="font-semibold text-white">Benefit: </strong>
              <span className="text-neutral-200">{scheme.benefits}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
