"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from "lucide-react"

import { useCategories, useSchemes } from "@/lib/use-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { SchemeCard } from "@/components/scheme-card"
import { SchemeFilters, type FilterState } from "@/components/scheme-filters"
import { CubeLoader } from "@/components/cube-loader"

const PAGE_SIZE = 9

const defaultFilters: FilterState = {
  search: "",
  eligibID: null,
  province: null,
  sortBy: "deadline",
  activeOnly: true,
}

export function SchemeBrowser() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { categories } = useCategories()

  const eligibParam = searchParams.get("eligibID")
  const searchParam = searchParams.get("search") || searchParams.get("textQuery")
  const provinceParam = searchParams.get("province")

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    eligibID: eligibParam ? Number(eligibParam) : null,
    search: searchParam || "",
    province: provinceParam || null,
  }))

  const [page, setPage] = useState(1)

  // Keep filters synced whenever URL parameters change (e.g. clicking a category card or browser nav)
  useEffect(() => {
    const nextEligib = eligibParam ? Number(eligibParam) : null
    const nextSearch = searchParam || ""
    const nextProvince = provinceParam || null

    setFilters((prev) => {
      if (
        prev.eligibID === nextEligib &&
        prev.search === nextSearch &&
        prev.province === nextProvince
      ) {
        return prev
      }
      return {
        ...prev,
        eligibID: nextEligib,
        search: nextSearch,
        province: nextProvince,
      }
    })
    setPage(1)
  }, [eligibParam, searchParam, provinceParam])

  const [debouncedSearch, setDebouncedSearch] = useState(() => filters.search.trim())

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
    const next = { ...filters, ...patch }
    setFilters(next)
    setPage(1)

    // Sync to URL so filters are persistent, shareable, and reflect in history
    const params = new URLSearchParams()
    if (next.eligibID !== null && next.eligibID !== undefined) {
      params.set("eligibID", String(next.eligibID))
    }
    if (next.search) params.set("search", next.search)
    if (next.province) params.set("province", next.province)
    const qs = params.toString()
    router.replace(qs ? `/?${qs}` : "/", { scroll: false })
  }

  function handleReset() {
    setFilters(defaultFilters)
    setPage(1)
    router.replace("/", { scroll: false })
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
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/40 p-12 backdrop-blur-xs">
          <CubeLoader size="md" label="Loading verified opportunities..." />
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
