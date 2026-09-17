import { Suspense } from "react"
import Link from "next/link"
import { SparklesIcon, MailIcon, ArrowRightIcon } from "lucide-react"

import { SchemeBrowser } from "@/components/scheme-browser"
import { CubeLoader } from "@/components/cube-loader"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Browse Scholarships & Student Schemes — TaleemHub",
  description: "Filter and search all verified government scholarships, laptop programs, and educational grants across Pakistan.",
}

export default function BrowsePage() {
  return (
    <div>
      {/* Search Header Banner */}
      <section className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md border border-pak-green/30 bg-pak-green/10 px-3 py-1 text-xs font-semibold text-pak-green mb-3">
                <SparklesIcon className="size-3.5" />
                Live Scheme Directory
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
                Browse All Student Schemes
              </h1>
              <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">
                Filter by academic level, province quota, and application deadlines to discover opportunities you qualify for.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-pak-green/50 hover:bg-muted shadow-2xs"
              >
                <MailIcon className="size-4 text-pak-green" />
                <span>Submit Scheme</span>
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-md bg-pak-green px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-pak-green/90 shadow-2xs"
              >
                <span>By Category</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schemes Directory Browser */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<CubeLoader size="md" label="Loading schemes..." />}>
          <SchemeBrowser />
        </Suspense>
      </section>
    </div>
  )
}
