import Link from "next/link"
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon } from "lucide-react"

export const metadata = {
  title: "About TaleemHub — Mission & Verification Standard",
  description:
    "Why billions in Pakistani higher education grants go unclaimed, and how TaleemHub indexes active government scholarships with verified deadlines.",
}

export default function AboutPage() {
  return (
    <div className="bg-[#1c2b24] text-[#dad7cd] selection:bg-[#588157] selection:text-white">
      {/* Hero Manifesto */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="flex flex-col items-start max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
            Our Mission &amp; Purpose
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#dad7cd] leading-[1.1]">
            Why Pakistani student aid goes unclaimed every semester.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#dad7cd]/85 leading-relaxed font-normal">
            Every year, billions of rupees in federal and provincial higher education grants, laptop quotas, and need-based stipends lapse back into state treasuries &mdash; not because talented students are missing, but because information is buried across obsolete government portals.
          </p>
        </div>

        {/* Asymmetric 2-Column: Structural Reality vs TaleemHub Index (Direct on Canvas, No Cards) */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-start border-t border-[#588157]/25 pt-12">
          {/* Left: The Structural Reality */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
                The Structural Reality
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#dad7cd]">
                The Bureaucratic Black Box
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#dad7cd]/80">
                Announcements from HEC, PEEF (Punjab), BEEF (Balochistan), SEF (Sindh), and KP Higher Education are frequently published as low-resolution newspaper clippings or single-page PDF notifications across unlinked portals.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#dad7cd]/80">
                By the time a matric, intermediate, or undergraduate student in Gilgit, Gwadar, Thar, or Dera Ghazi Khan learns an initiative exists, the closing date has already passed or the quota details were never made clear. Reserved seats and provincial quotas frequently go unfilled due to unadvertised closing dates.
              </p>
            </div>
          </div>

          {/* Right: The Solution / The Standard */}
          <div className="lg:col-span-6 flex flex-col justify-between lg:border-l lg:border-[#588157]/25 lg:pl-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#35a333]">
                The TaleemHub Standard
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#dad7cd]">
                An Open Public Directory
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#dad7cd]/90">
                TaleemHub was created as an independent, non-commercial educational public utility. We monitor official gazettes, verify eligibility criteria, and present every initiative in a structured, searchable catalog.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#dad7cd]/90">
                Students filter by their exact degree level and domicile region, check required documentation upfront, and link directly to official agency application portals with zero middleman friction.
              </p>
            </div>

            <div className="mt-8 pt-4 flex items-center gap-2.5 text-xs font-medium text-[#a3b18a]">
              <ShieldCheckIcon className="size-4 text-[#35a333] shrink-0" />
              <span>Independent &middot; 100% Free &middot; No Sponsored Listings</span>
            </div>
          </div>
        </div>

        {/* Platform Commitments (No cards, no circled numbers) */}
        <div className="mt-20 border-t border-[#588157]/25 pt-16">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a3b18a]">
              Guiding Principles
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#dad7cd]">
              Our Commitments to Students
            </h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#dad7cd]">Direct Official Links Only</h3>
              <p className="mt-2 text-sm text-[#dad7cd]/80 leading-relaxed">
                We never route students through ad-shorteners, monetization funnels, or third-party capture forms. You click straight to the official <span className="text-white font-mono">.gov.pk</span> or university portal.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#dad7cd]">Document Transparency</h3>
              <p className="mt-2 text-sm text-[#dad7cd]/80 leading-relaxed">
                Each listing specifies required documents (e.g. Domicile, Father&apos;s Salary Slip, B-Form, Attested Transcripts) upfront so candidates prepare before opening application windows.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#dad7cd]">Quota &amp; Domicile Precision</h3>
              <p className="mt-2 text-sm text-[#dad7cd]/80 leading-relaxed">
                Clear distinction between open-merit seats and dedicated quotas (Balochistan, rural Sindh, Gilgit-Baltistan, AJK, merged districts) so eligible students don&apos;t miss reserved funding.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#dad7cd]">Live Deadline Clocks</h3>
              <p className="mt-2 text-sm text-[#dad7cd]/80 leading-relaxed">
                Countdown indicators scale with urgency. Expired schemes are clearly archived to eliminate confusion between active calls and outdated programs.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 rounded-2xl border border-[#588157]/35 bg-[#17251e]/60 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#dad7cd]">Know of an unlisted opportunity?</h3>
            <p className="mt-1 text-sm text-[#a3b18a]">
              Help fellow students across Pakistan by submitting schemes from your university, board, or foundation.
            </p>
          </div>
          <Link
            href="/contact/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#2e7d32] hover:bg-[#256b2a] px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <span>Contact &amp; Submit Scheme</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

