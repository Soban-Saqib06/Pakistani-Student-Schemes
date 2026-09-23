import Link from "next/link"
import { ArrowRightIcon, BuildingIcon, ClockIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react"

import { api } from "@/lib/api"
import { DeadlineBadge } from "@/components/deadline-badge"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description:
    "Real-time directory of verified Pakistani government scholarships, laptop programs, and provincial grants before deadlines expire.",
}

export default async function HomePage() {
  const [schemesResult, categories] = await Promise.all([
    api.searchSchemes({ activeOnly: true, sortBy: "deadline-asc", pageSize: 4 }),
    api.listCategories(),
  ])

  const urgentSchemes = schemesResult.data
  const activeCount = schemesResult.totalCount

  return (
    <div className="bg-[#1c2b24] text-[#dad7cd] selection:bg-[#588157] selection:text-white">
      {/* SECTION 1: HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-8 pb-20 sm:pt-12 sm:pb-28">
        {/* Top Header Stat / Registry Bar (No Pill) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-10 sm:mb-14 border-b border-[#588157]/20 text-xs">
          <div className="flex items-center gap-2 text-[#a3b18a] font-mono uppercase tracking-widest text-[11px]">
            <span>National Directory</span>
            <span className="text-[#588157]">/</span>
            <span>Verified Public Portals</span>
          </div>

          {/* Top-Right Live Dynamic Status */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#35a333] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#35a333]" />
            </span>
            <span className="font-bold text-[#dad7cd]">{activeCount} active schemes</span>
            <span className="text-[#a3b18a]">&mdash; updated Spring 2026</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] text-[#dad7cd] select-none max-w-4xl">
            Every government scholarship in Pakistan.
            <span className="block mt-2.5 text-[#35a333]">Before the deadline passes.</span>
          </h1>

          {/* Problem-Solving Subheadline */}
          <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#dad7cd]/85 text-pretty">
            We track active funding, laptop initiatives, and provincial quotas from HEC, PEEF, BEEF, and Ihsaas in one verified directory &mdash;{" "}
            <span className="text-white font-medium">with verified closing dates and direct portal links.</span>
          </p>

          {/* Action Buttons: Strict Hierarchy (Primary Solid, Secondary Outline) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#256b2a] px-8 py-3.5 text-base font-bold text-white shadow-md transition-all active:translate-y-px cursor-pointer"
            >
              <span>Explore All Schemes</span>
              <ArrowRightIcon className="size-4.5" />
            </Link>

            <Link
              href="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#588157]/50 hover:bg-[#23372e] hover:border-[#588157] px-7 py-3.5 text-base font-semibold text-[#dad7cd] transition-all active:translate-y-px cursor-pointer"
            >
              <span>Browse by Category</span>
            </Link>
          </div>

          {/* Concrete Metrics Row */}
          <div className="mt-16 pt-8 border-t border-[#588157]/25 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left">
            <div className="p-4 rounded-xl border border-[#588157]/30 bg-[#16221c]/60">
              <span className="block text-2xl sm:text-3xl font-black text-[#dad7cd]">{activeCount}+</span>
              <span className="mt-1 block text-xs text-[#a3b18a] font-medium">Active Opportunities</span>
            </div>
            <div className="p-4 rounded-xl border border-[#588157]/30 bg-[#16221c]/60">
              <span className="block text-2xl sm:text-3xl font-black text-[#dad7cd]">7</span>
              <span className="mt-1 block text-xs text-[#a3b18a] font-medium">Provinces &amp; Quotas</span>
            </div>
            <div className="p-4 rounded-xl border border-[#588157]/30 bg-[#16221c]/60">
              <span className="block text-2xl sm:text-3xl font-black text-[#dad7cd]">8</span>
              <span className="mt-1 block text-xs text-[#a3b18a] font-medium">Academic Tracks</span>
            </div>
            <div className="p-4 rounded-xl border border-[#588157]/30 bg-[#16221c]/60">
              <span className="block text-2xl sm:text-3xl font-black text-[#dad7cd]">100%</span>
              <span className="mt-1 block text-xs text-[#a3b18a] font-medium">Direct Portal Links</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE VERIFICATION STANDARD (Full-bleed, 3-Pillar Typographic Layout, No Card) */}
      <section className="border-t border-[#588157]/25 bg-[#17251e]/50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl mb-12 md:mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
              Verification Standard
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#dad7cd]">
              How TaleemHub Operates
            </h2>
            <p className="mt-3 text-base text-[#a3b18a] leading-relaxed">
              Built specifically to solve the information failure that costs Pakistani students their eligible grants every semester.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-[#588157] select-none">01</span>
              <h3 className="mt-4 text-xl font-bold text-[#dad7cd]">Direct Agency Ingestion</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#dad7cd]/80">
                We bypass unreliable WhatsApp blogs and scraper aggregators. Every listing is cross-checked against HEC, provincial education foundations (PEEF, BEEF), and public university financial aid offices.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-[#588157] select-none">02</span>
              <h3 className="mt-4 text-xl font-bold text-[#dad7cd]">Strict Deadline Clocks</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#dad7cd]/80">
                Closed schemes are automatically flagged or archived. Visual urgency clocks alert students to opportunities closing within 72 hours so dossiers are submitted before portal servers freeze at midnight.
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-[#588157] select-none">03</span>
              <h3 className="mt-4 text-xl font-bold text-[#dad7cd]">Zero Intermediaries</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#dad7cd]/80">
                TaleemHub is an open public-interest portal. Every scheme links straight to the official <span className="text-white">.gov.pk</span> or university portal with complete required document checklists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: URGENT DEADLINES SPOTLIGHT (Asymmetric 2-Column + Divider List) */}
      <section className="border-t border-[#588157]/25 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Sticky Editorial Note */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
                Time-Sensitive
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#dad7cd]">
                Closing Deadlines
              </h2>
              <p className="mt-3 text-base text-[#a3b18a] leading-relaxed">
                These schemes are approaching their final submission dates. If you qualify, verify your paperwork and submit directly before the portal locks.
              </p>
              <div className="mt-6">
                <Link
                  href="/browse?sortBy=deadline-asc"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#dad7cd] hover:text-[#35a333] transition-colors"
                >
                  <span>View all expiring schemes</span>
                  <ArrowRightIcon className="size-4 text-[#35a333]" />
                </Link>
              </div>
            </div>

            {/* Right Column: Divider-Separated List (Not identical boxed cards!) */}
            <div className="lg:col-span-8 flex flex-col divide-y divide-[#588157]/25 rounded-2xl border border-[#588157]/35 bg-[#18261f]/70 p-6 md:p-8 backdrop-blur-xs">
              {urgentSchemes.map((scheme) => (
                <div key={scheme.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <DeadlineBadge deadline={scheme.deadline} />
                      <span className="text-xs font-medium text-[#a3b18a]">
                        {scheme.province} &middot; {scheme.eligibilityName}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#dad7cd] group-hover:text-[#35a333] transition-colors">
                      <Link href={`/schemes/${scheme.id}`} className="hover:underline">
                        {scheme.title}
                      </Link>
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-[#dad7cd]/75 line-clamp-1">
                      {scheme.organization} &mdash; <span className="text-[#a3b18a]">{scheme.benefits}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <Link
                      href={`/schemes/${scheme.id}`}
                      className="text-xs sm:text-sm font-bold text-[#dad7cd] group-hover:text-[#35a333] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View details</span>
                      <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1 text-[#35a333]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORY DIRECTORY (Border-Only Card Variant) */}
      <section className="border-t border-[#588157]/25 bg-[#17251e]/30 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
                Eligibility Tracks
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#dad7cd]">
                Explore by Academic Level
              </h2>
              <p className="mt-2 text-base text-[#a3b18a]">
                Filter schemes tailored to your specific education qualification.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#dad7cd] hover:text-[#35a333] transition-colors shrink-0"
            >
              <span>View all categories</span>
              <ArrowRightIcon className="size-4 text-[#35a333]" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?eligibID=${cat.id}`}
                className="group flex flex-col justify-between rounded-xl border border-[#588157]/35 bg-transparent p-6 transition-all duration-200 hover:border-[#588157] hover:bg-[#23372e]/40 cursor-pointer"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#dad7cd] group-hover:text-[#35a333] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#a3b18a] line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#588157]/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#dad7cd] group-hover:text-[#35a333] transition-colors">
                    Explore track
                  </span>
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1 text-[#35a333]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

