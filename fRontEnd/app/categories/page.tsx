"use client"

import Link from "next/link"
import { ArrowRightIcon, BookOpenIcon, LayersIcon } from "lucide-react"
import { useCategories } from "@/lib/use-data"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 flex flex-col items-start gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <LayersIcon className="size-3.5" />
          Education &amp; Eligibility
        </span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Browse by Eligibility Criteria
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Schemes in Pakistan are categorized by academic level, financial background, and regional quotas.
          Select a category to view all matching scholarships.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            No categories available at the moment.
          </div>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?eligibID=${cat.id}`}
              className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 hover:border-pak-green/60 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-pak-green/10 text-pak-green">
                  <BookOpenIcon className="size-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {cat.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-pak-green">Explore Schemes</span>
                <ArrowRightIcon className="size-4 text-pak-green transition-transform group-hover:translate-x-1.5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
