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
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
          Browse by Eligibility Criteria
        </h1>
        <p className="max-w-2xl text-muted-foreground text-lg leading-relaxed">
          Schemes in Pakistan are categorized by academic level, financial background, and regional quotas.
          Select a category to view all matching scholarships.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/60 p-6 space-y-3">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground text-lg">
            No categories available at the moment.
          </div>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?eligibID=${cat.id}`}
              className="group flex flex-col justify-between rounded-xl border border-[#588157]/35 bg-[#22362d] p-6 transition-all duration-200 hover:border-[#588157] hover:shadow-md cursor-pointer"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <BookOpenIcon className="size-5 text-[#a3b18a] group-hover:text-[#35a333] transition-colors" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#a3b18a] group-hover:text-[#dad7cd] transition-colors">
                    Track 0{cat.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#dad7cd] group-hover:text-[#35a333] transition-colors">
                  {cat.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#a3b18a] leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#588157]/20 flex items-center justify-between">
                <span className="text-xs font-bold text-[#dad7cd] group-hover:text-[#35a333] transition-colors">
                  Explore Schemes
                </span>
                <ArrowRightIcon className="size-3.5 text-[#35a333] transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
