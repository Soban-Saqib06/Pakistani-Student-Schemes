import { GraduationCapIcon, BellRingIcon, BookmarkCheckIcon } from "lucide-react"

import { SchemeBrowser } from "@/components/scheme-browser"

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="flex flex-col items-start gap-4">
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <SchemeBrowser />
      </section>
    </div>
  )
}
