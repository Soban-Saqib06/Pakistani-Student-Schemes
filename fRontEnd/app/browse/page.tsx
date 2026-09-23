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
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Browse All Student Schemes
            </h1>
            <p className="mt-1 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Filter by academic level, province quota, and application deadlines to discover opportunities you qualify for.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-md bg-[#2e7d32] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#256b2a] shadow-2xs"
              >
                <span>Browse by Category</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Submission & Contact Us Callout Box */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-[#588157]/45 bg-[#23372e] p-5 shadow-xs backdrop-blur-xs">
              <div className="flex items-start gap-3">
                <PlusCircleIcon className="size-5 text-[#a3b18a] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3b18a]">
                    Notice a missing scheme?
                  </span>
                  <h3 className="mt-1 text-base font-bold text-[#dad7cd]">
                    Submit a New Opportunity
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#dad7cd]/80">
                    If you see an active scholarship, laptop scheme, or financial grant currently not mentioned on this site, reach out directly so we can add it for all students!
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center justify-between">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 rounded-md bg-[#2e7d32] px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-[#256b2a] shadow-2xs"
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
