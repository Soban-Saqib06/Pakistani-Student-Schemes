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
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-pak-green" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by keyword, university, or program (e.g. HEC, Laptop, PEEF, STEM)..."
          className="h-11 pl-11 pr-4 text-sm rounded-xl border-border/80 bg-background/90 shadow-2xs transition-all focus-visible:border-pak-green focus-visible:ring-3 focus-visible:ring-pak-green/20"
          aria-label="Search schemes"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-1">
          <SlidersHorizontalIcon className="size-3.5 text-pak-green" />
          <span>Filters</span>
        </div>

        <Select
          value={filters.eligibID === null ? ALL : String(filters.eligibID)}
          onValueChange={(v) => onChange({ eligibID: v === ALL ? null : Number(v) })}
        >
          <SelectTrigger size="sm" className="w-[170px]">
            <SelectValue placeholder="Eligibility">
              {(val: string) =>
                val === ALL ? "All eligibility" : categories.find((c) => String(c.id) === val)?.name
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL}>All eligibility</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
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
          <SelectTrigger size="sm" className="w-[160px]">
            <SelectValue placeholder="Province">
              {(val: string) => (val === ALL ? "All regions" : val)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL}>All regions</SelectItem>
              {PROVINCES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => onChange({ sortBy: v as SortBy })}>
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue placeholder="Sort by">
              {(val: string) =>
                val === "deadline" ? "Deadline" : val === "recent" ? "Recently added" : "Title A–Z"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="recent">Recently added</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label className="flex items-center gap-2 text-sm font-normal">
          <Switch
            checked={filters.activeOnly}
            onCheckedChange={(checked) => onChange({ activeOnly: checked })}
          />
          Open only
        </Label>

        {hasActive ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto">
            <XIcon data-icon="inline-start" />
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  )
}
