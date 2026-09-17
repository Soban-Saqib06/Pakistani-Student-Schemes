"use client"

import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"

import { PROVINCES, type SortBy } from "@/lib/types"
import type { EligibilityCategory } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterState {
  search: string
  eligibID: number | null
  province: string | null
  sortBy: SortBy
  activeOnly: boolean
}

interface SchemeFiltersProps {
  filters: FilterState
  categories: EligibilityCategory[]
  onChange: (patch: Partial<FilterState>) => void
  onReset: () => void
}

const ALL = "all"

export function SchemeFilters({ filters, categories, onChange, onReset }: SchemeFiltersProps) {
  const hasActive =
    filters.search !== "" ||
    filters.eligibID !== null ||
    filters.province !== null ||
    filters.sortBy !== "deadline" ||
    !filters.activeOnly

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur-xs">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-pak-green" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by keyword, university, or program (e.g. HEC, Laptop, PEEF, STEM)..."
          className="h-12 pl-12 pr-4 text-base rounded-md border-border/80 bg-background/90 shadow-2xs transition-all focus-visible:border-pak-green focus-visible:ring-3 focus-visible:ring-pak-green/20"
          aria-label="Search schemes"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground pr-1">
          <SlidersHorizontalIcon className="size-4 text-pak-green" />
          <span>Filters</span>
        </div>

        <Select
          value={filters.eligibID === null ? ALL : String(filters.eligibID)}
          onValueChange={(v) => onChange({ eligibID: v === ALL ? null : Number(v) })}
        >
          <SelectTrigger className="h-10 w-[195px] text-sm font-medium">
            <SelectValue placeholder="Eligibility">
              {(val: string) => {
                if (!val || val === ALL) return "All eligibility"
                const found = categories.find((c) => String(c.id) === String(val))
                return found ? found.name : "Eligibility"
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL} className="text-sm">All eligibility</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-sm">
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={filters.province === null ? ALL : filters.province}
          onValueChange={(v) => onChange({ province: v === ALL ? null : v })}
        >
          <SelectTrigger className="h-10 w-[175px] text-sm font-medium">
            <SelectValue placeholder="Province">
              {(val: string) => (val === ALL ? "All regions" : val)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL} className="text-sm">All regions</SelectItem>
              {PROVINCES.map((p) => (
                <SelectItem key={p} value={p} className="text-sm">
                  {p}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => onChange({ sortBy: v as SortBy })}>
          <SelectTrigger className="h-10 w-[165px] text-sm font-medium">
            <SelectValue placeholder="Sort by">
              {(val: string) =>
                val === "deadline" ? "Deadline" : val === "recent" ? "Recently added" : "Title A–Z"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="deadline" className="text-sm">Deadline</SelectItem>
              <SelectItem value="recent" className="text-sm">Recently added</SelectItem>
              <SelectItem value="title" className="text-sm">Title A–Z</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
          <Switch
            checked={filters.activeOnly}
            onCheckedChange={(checked) => onChange({ activeOnly: checked })}
          />
          Open only
        </Label>

        {hasActive ? (
          <Button variant="ghost" size="default" onClick={onReset} className="ml-auto h-10 px-3.5 text-sm font-medium cursor-pointer">
            <XIcon data-icon="inline-start" className="size-4" />
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  )
}
