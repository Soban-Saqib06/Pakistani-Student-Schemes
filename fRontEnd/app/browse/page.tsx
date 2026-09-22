import { Suspense } from "react"
import Link from "next/link"
import { ShieldCheckIcon, MailIcon, ArrowRightIcon, PlusCircleIcon } from "lucide-react"

import { SchemeBrowser } from "@/components/scheme-browser"
import { CubeLoader } from "@/components/cube-loader"

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
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & Directory Info */}
          <div className="flex flex-col items-start gap-3 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-md border border-pak-green/30 bg-pak-green/10 px-3 py-1 text-xs font-semibold text-pak-green shadow-2xs">
              <ShieldCheckIcon className="size-3.5" />
              Verified Opportunities
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
              Browse All Student Schemes
            </h1>
            <p className="mt-1 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Filter by academic level, province quota, and application deadlines to discover opportunities you qualify for.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-md bg-pak-green px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-pak-green/90 shadow-2xs"
              >
                <span>Browse by Category</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Submission & Contact Us Callout Box */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-xs transition-all hover:border-pak-green/50 hover:shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-pak-green/10 text-pak-green">
                  <PlusCircleIcon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block rounded-md bg-pak-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pak-green">
                    Notice a missing scheme?
                  </span>
                  <h3 className="mt-1 text-base font-bold text-foreground">
                    Submit a New Opportunity
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    If you see an active scholarship, laptop scheme, or financial grant currently not mentioned on this site, reach out directly so we can add it for all students!
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-pak-green px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-pak-green/90 shadow-2xs"
                >
                  <MailIcon className="size-3.5" />
                  <span>Contact &amp; Submit Scheme</span>
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
            </div>
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
