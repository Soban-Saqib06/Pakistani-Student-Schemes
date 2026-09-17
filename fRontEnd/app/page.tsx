import { Suspense } from "react"
import Link from "next/link"
import {
  GraduationCapIcon,
  BellRingIcon,
  BookmarkCheckIcon,
  SparklesIcon,
  MailIcon,
  ArrowRightIcon,
} from "lucide-react"

import { SchemeBrowser } from "@/components/scheme-browser"
import { CubeLoader } from "@/components/cube-loader"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left / Main Hero Column */}
            <div className="flex flex-col items-start gap-4 lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-3.5 py-1 text-xs font-semibold text-foreground shadow-2xs">
                <GraduationCapIcon className="size-3.5 text-pak-green" />
                Scholarships &amp; education schemes across Pakistan
              </span>
              <h1 className="max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Find the right scholarship, grant, or scheme — before the deadline.
              </h1>
              <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
                Browse verified government and institutional opportunities.
              </p>
              <div className="mt-2 flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <BellRingIcon className="size-4 text-pak-green" />
                  Deadline tracking
                </span>
                <span className="flex items-center gap-2">
                  <BookmarkCheckIcon className="size-4 text-pak-green" />
                  Save for later
                </span>
                <span className="flex items-center gap-2">
                  <GraduationCapIcon className="size-4 text-pak-green" />
                  Eligibility filters
                </span>
              </div>
            </div>

            {/* Right Column: Submission & Contact Callout Box */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-xs backdrop-blur-xs transition-all hover:border-pak-green/50 hover:shadow-md">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pak-green/10 text-pak-green">
                    <SparklesIcon className="size-5" />
                  </div>
                  <div className="flex-1">
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
                    className="inline-flex items-center gap-2 rounded-lg bg-pak-green px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-pak-green/90 shadow-2xs"
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

      <section className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<CubeLoader size="md" label="Loading schemes..." />}>
          <SchemeBrowser />
        </Suspense>
      </section>
    </div>
  )
}
