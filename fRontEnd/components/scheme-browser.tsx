"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon, LayoutGridIcon, ListIcon, SearchXIcon } from "lucide-react"

import { useCategories, useSchemes } from "@/lib/use-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { SchemeCard } from "@/components/scheme-card"
import { SchemeFilters, type FilterState } from "@/components/scheme-filters"
import type { SortBy } from "@/lib/types"
import { CubeLoader } from "@/components/cube-loader"

const PAGE_SIZE = 9

const defaultFilters: FilterState = {
  search: "",
  eligibID: null,
  province: null,
  sortBy: "deadline-asc",
  activeOnly: true,
}

export function SchemeBrowser() {
  const searchParams = useSearchParams()
  const { categories } = useCategories()

  const eligibParam = searchParams.get("eligibID")
  const searchParam = searchParams.get("search") || searchParams.get("textQuery")
  const provinceParam = searchParams.get("province")
  const sortByParam = searchParams.get("sortBy")
  const activeOnlyParam = searchParams.get("activeOnly")

  function parseEligib(val: string | null): number | null {
    if (!val || val === "all") return null
    const n = Number(val)
    return isNaN(n) ? null : n
  }

  function parseProvince(val: string | null): string | null {
    if (!val || val === "all") return null
    return val
  }

  function parseSortBy(val: string | null): SortBy {
    if (!val) return "deadline-asc"
    if (val === "deadline") return "deadline-asc"
    if (val === "title") return "title-asc"
    if (
      val === "deadline-asc" ||
      val === "deadline-desc" ||
      val === "recent" ||
      val === "title-asc" ||
      val === "title-desc"
    ) {
      return val
    }
    return "deadline-asc"
  }

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    eligibID: parseEligib(eligibParam),
    search: searchParam || "",
    province: parseProvince(provinceParam),
    sortBy: parseSortBy(sortByParam),
    activeOnly: activeOnlyParam === "false" ? false : true,
  }))

  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Restore saved view mode preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("taleemhub_view_mode")
      if (saved === "list" || saved === "grid") {
        setViewMode(saved)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  function handleViewModeChange(mode: "grid" | "list") {
    setViewMode(mode)
    try {
      localStorage.setItem("taleemhub_view_mode", mode)
    } catch {
      // Ignore localStorage errors
    }
  }

  // Handle browser Back / Forward history buttons
  useEffect(() => {
    function onPopState() {
      if (typeof window === "undefined") return
      const sp = new URLSearchParams(window.location.search)
      const nextEligib = parseEligib(sp.get("eligibID"))
      const nextSearch = sp.get("search") || sp.get("textQuery") || ""
      const nextProvince = parseProvince(sp.get("province"))
      const nextSort = parseSortBy(sp.get("sortBy"))
      const nextActiveOnly = sp.get("activeOnly") === "false" ? false : true

      setFilters({
        eligibID: nextEligib,
        search: nextSearch,
        province: nextProvince,
        sortBy: nextSort,
        activeOnly: nextActiveOnly,
      })
      setPage(1)
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-medium text-muted-foreground" aria-live="polite">
          {rangeLabel}
        </p>

        {/* View Switcher: Cards vs List */}
        <div className="flex items-center gap-1 rounded-md border border-border/70 bg-card/75 p-1 shadow-2xs">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className={`h-8 gap-1.5 px-3 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-secondary text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleViewModeChange("grid")}
            aria-label="Cards view"
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGridIcon className="size-3.5 text-pak-green" />
            <span>Cards</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className={`h-8 gap-1.5 px-3 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-secondary text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <ListIcon className="size-3.5 text-pak-green" />
            <span>List</span>
          </Button>
        </div>
      </div>

      {showSkeleton ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-border/60 bg-card/40 p-12 backdrop-blur-xs">
          <CubeLoader size="md" label="Loading verified opportunities..." />
        </div>
      ) : schemes.length === 0 ? (
        <Empty className="rounded-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>No matching schemes</EmptyTitle>
            <EmptyDescription>
              Try adjusting your filters or search terms to find more scholarships and grants.
            </EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" size="lg" onClick={handleReset} className="mt-2 font-medium">
            Clear filters
          </Button>
        </Empty>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 " +
                (isLoading ? "opacity-60" : "opacity-100")
              : "flex flex-col gap-3.5 transition-opacity " +
                (isLoading ? "opacity-60" : "opacity-100")
          }
        >
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} viewMode={viewMode} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="default"
            className="h-10 px-4 text-sm font-medium"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon data-icon="inline-start" className="size-4" />
            Previous
          </Button>
          <span className="px-3 text-base font-medium text-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="default"
            className="h-10 px-4 text-sm font-medium"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRightIcon data-icon="inline-end" className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
