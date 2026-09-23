"use client"

import Link from "next/link"
import {
  ArrowLeftIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  GiftIcon,
  MapPinIcon,
  SearchXIcon,
} from "lucide-react"

import { useScheme } from "@/lib/use-data"
import { formatDate, getDeadlineInfo } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { DeadlineBadge } from "@/components/deadline-badge"
import { BookmarkButton } from "@/components/bookmark-button"
import { CubeLoader } from "@/components/cube-loader"

export function SchemeDetail({ id }: { id: number }) {
  const { scheme, isLoading, error } = useScheme(id)

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4 py-16">
        <CubeLoader size="md" label="Loading Scheme Details..." />
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>Scheme not found</EmptyTitle>
            <EmptyDescription>
              This scheme may have been removed or the link is incorrect.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link href="/browse" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to browse
          </Button>
        </Empty>
      </div>
    )
  }

  const deadline = getDeadlineInfo(scheme.deadline)
  const expired = deadline.status === "expired"

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="default" render={<Link href="/browse" />} className="-ml-2 mb-6 text-sm font-medium">
        <ArrowLeftIcon data-icon="inline-start" className="size-4" />
        Back to browse
      </Button>

      <div className="flex flex-wrap items-center gap-2.5">
        {scheme.eligibilityName ? (
          <Badge variant="outline" className="border-pak-green/30 bg-pak-green/10 text-pak-green text-sm font-semibold px-3 py-0.5">
            {scheme.eligibilityName}
          </Badge>
        ) : null}
        <DeadlineBadge deadline={scheme.deadline} />
      </div>

      <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl leading-tight text-foreground">{scheme.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-base text-muted-foreground">
        <span className="flex items-center gap-2">
          <BuildingIcon className="size-4.5 text-pak-green" />
          {scheme.organization}
        </span>
        <span className="flex items-center gap-2">
          <MapPinIcon className="size-4.5 text-muted-foreground" />
          {scheme.province}
        </span>
        <span className="flex items-center gap-2">
          <CalendarIcon className="size-4.5 text-muted-foreground" />
          Deadline: {formatDate(scheme.deadline)}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {scheme.officialUrl && scheme.officialUrl !== "#" ? (
          <Button
            size="lg"
            className="h-11 px-5 font-bold bg-pak-green hover:bg-pak-green/90 text-white cursor-pointer shadow-xs transition-colors"
            render={<a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" />}
            disabled={expired}
          >
            <ExternalLinkIcon data-icon="inline-start" className="size-4" />
            {expired ? "Applications closed" : "Apply on official site"}
          </Button>
        ) : (
          <Button
            size="lg"
            className="h-11 px-5 font-bold bg-muted text-muted-foreground cursor-not-allowed"
            disabled
          >
            <ExternalLinkIcon data-icon="inline-start" className="size-4" />
            Official Portal Unavailable
          </Button>
        )}
        <BookmarkButton scheme={scheme} withLabel size="lg" variant="outline" />
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 text-2xl font-bold text-foreground">About this scheme</h2>
          <p className="text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground">{scheme.description}</p>
        </section>

        <Card className="rounded-2xl border border-border/70 p-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold">
              <GiftIcon className="size-5 text-pak-green" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base sm:text-lg leading-relaxed text-muted-foreground">{scheme.benefits}</CardContent>
        </Card>

        {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">Required documents</h2>
            <ul className="flex flex-col gap-2.5">
              {scheme.requiredDocuments.map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <CheckCircle2Icon className="size-5 shrink-0 text-pak-green" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
