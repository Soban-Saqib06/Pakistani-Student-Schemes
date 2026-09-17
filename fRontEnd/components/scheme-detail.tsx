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
          <Button render={<Link href="/" />}>
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
      <Button variant="ghost" size="sm" render={<Link href="/" />} className="-ml-2 mb-4">
        <ArrowLeftIcon data-icon="inline-start" />
        Back to browse
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        {scheme.eligibilityName ? (
          <Badge variant="outline" className="border-primary/30 text-primary">
            {scheme.eligibilityName}
          </Badge>
        ) : null}
        <DeadlineBadge deadline={scheme.deadline} />
      </div>

      <h1 className="mt-3 text-balance text-2xl font-bold tracking-tight md:text-3xl">{scheme.title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BuildingIcon className="size-4" />
          {scheme.organization}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="size-4" />
          {scheme.province}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="size-4" />
          Deadline: {formatDate(scheme.deadline)}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button render={<a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" />} disabled={expired}>
          <ExternalLinkIcon data-icon="inline-start" />
          {expired ? "Applications closed" : "Apply on official site"}
        </Button>
        <BookmarkButton scheme={scheme} withLabel size="default" variant="outline" />
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="mb-2 text-lg font-semibold">About this scheme</h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">{scheme.description}</p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GiftIcon className="size-4 text-primary" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">{scheme.benefits}</CardContent>
        </Card>

        {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">Required documents</h2>
            <ul className="flex flex-col gap-2">
              {scheme.requiredDocuments.map((doc) => (
                <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
