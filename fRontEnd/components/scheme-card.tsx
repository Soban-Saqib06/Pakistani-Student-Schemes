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
    <Card className="group/scheme relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/80 backdrop-blur-md shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-pak-green/40 hover:shadow-lg dark:bg-card/70 dark:hover:border-pak-green/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {scheme.eligibilityName ? (
              <Badge variant="outline" className="border-border/80 bg-background/80 text-foreground text-[11px] font-medium">
                {scheme.eligibilityName}
              </Badge>
            ) : null}
            <DeadlineBadge deadline={scheme.deadline} />
          </div>
          <span className="relative z-10">
            <BookmarkButton scheme={scheme} />
          </span>
        </div>
        <CardTitle className="mt-2.5 text-base font-semibold text-pretty leading-snug">
          <Link href={`/schemes/${scheme.id}`} className="before:absolute before:inset-0 hover:text-pak-green transition-colors">
            {scheme.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3.5 pb-4">
        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{scheme.description}</CardDescription>
        <div className="mt-auto flex flex-col gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/40">
          <span className="flex items-center gap-2">
            <BuildingIcon className="size-3.5 shrink-0 text-pak-green" />
            <span className="truncate font-medium text-foreground/80">{scheme.organization}</span>
          </span>
          <span className="flex items-center gap-2">
            <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{scheme.province}</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/50 bg-muted/25 px-5 py-3 text-xs text-muted-foreground">
        <span className="line-clamp-1">
          <span className="font-semibold text-foreground">Benefit:</span> {scheme.benefits}
        </span>
      </CardFooter>
    </Card>
  )
}
