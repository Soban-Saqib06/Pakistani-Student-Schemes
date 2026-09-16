"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from "lucide-react"

import { useCategories, useSchemes } from "@/lib/use-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { SchemeCard } from "@/components/scheme-card"
import { SchemeFilters, type FilterState } from "@/components/scheme-filters"

const PAGE_SIZE = 9

const defaultFilters: FilterState = {
  search: "",
  eligibID: null,
  province: null,
  sortBy: "deadline",
  activeOnly: true,
}

export function SchemeBrowser() {
  const { categories } = useCategories()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300)
    return () => clearTimeout(t)
  }, [filters.search])

  const { result, isLoading } = useSchemes({
    textQuery: debouncedSearch,
    eligibID: filters.eligibID,
    province: filters.province,
    sortBy: filters.sortBy,
    activeOnly: filters.activeOnly,
    pageNumber: page,
    pageSize: PAGE_SIZE,
  })

  function handleChange(patch: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  function handleReset() {
    setFilters(defaultFilters)
    setPage(1)
  }

  const totalCount = result?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const schemes = result?.data ?? []
  const showSkeleton = isLoading && !result

  const rangeLabel = useMemo(() => {
    if (totalCount === 0) return "No schemes"
    const start = (page - 1) * PAGE_SIZE + 1
    const end = Math.min(page * PAGE_SIZE, totalCount)
    return `Showing ${start}–${end} of ${totalCount} scheme${totalCount === 1 ? "" : "s"}`
  }, [page, totalCount])

  return (
    <div className="flex flex-col gap-5">
      <SchemeFilters filters={filters} categories={categories} onChange={handleChange} onReset={handleReset} />

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {rangeLabel}
      </p>

      {showSkeleton ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border p-6">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>No matching schemes</EmptyTitle>
            <EmptyDescription>
              Try adjusting your filters or search terms to find more scholarships and grants.
            </EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={handleReset}>
            Clear filters
          </Button>
        </Empty>
      ) : (
        <div
          className={
            "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 " +
            (isLoading ? "opacity-60" : "opacity-100")
          }
        >
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
