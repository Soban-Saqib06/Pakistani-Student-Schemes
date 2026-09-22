import Link from "next/link"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description:
    "Real-time directory of verified Pakistani government scholarships, laptop programs, and provincial grants before deadlines expire.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center items-center bg-[#1c2b24] text-[#dad7cd] selection:bg-[#588157] selection:text-white p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-5xl">
        {/* Core Hero Panel - Elevated #344e41 over dark #1c2b24 background */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-[#588157]/45 bg-gradient-to-b from-[#344e41] via-[#2d4338] to-[#25392f] px-6 py-16 sm:px-12 sm:py-20 md:py-24 text-center shadow-[0_20px_50px_rgba(12,22,17,0.7)]">
          
          {/* Brand Display Title */}
          <h1 className="relative text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] text-[#dad7cd] select-none">
            Every government scholarship in Pakistan.
            <span className="block mt-2.5 text-[#35a333]">Before the deadline passes.</span>
          </h1>

          {/* Concrete Problem-Solving Subheadline */}
          <p className="relative mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#dad7cd]/85 text-pretty">
            We monitor active funding, laptop initiatives, and provincial grants from HEC, PEEF, BEEF, and Ihsaas in one live directory &mdash;{" "}
            <span className="text-white font-medium">with verified closing dates and direct portal links.</span>
          </p>

          {/* Action Buttons */}
          <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#256b2a] px-8 py-3.5 text-base font-bold text-white shadow-md transition-all active:translate-y-px cursor-pointer"
            >
              <span>Explore All Schemes</span>
              <ArrowRightIcon className="size-4.5" />
            </Link>

            <Link
              href="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#588157]/60 bg-[#1c2b24]/70 hover:bg-[#1c2b24] px-7 py-3.5 text-base font-semibold text-[#dad7cd] transition-all active:translate-y-px cursor-pointer"
            >
              <LayersIcon className="size-4.5 text-[#35a333]" />
              <span>Browse by Category</span>
            </Link>
          </div>

          {/* Metrics Row */}
          <div className="relative mt-14 pt-8 border-t border-[#588157]/35 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-[#1c2b24]/75 border border-[#588157]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#35a333]">12+</span>
              <span className="mt-1 block text-xs text-[#dad7cd]/80 font-medium">Active Opportunities</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1c2b24]/75 border border-[#588157]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#35a333]">8</span>
              <span className="mt-1 block text-xs text-[#dad7cd]/80 font-medium">Academic Categories</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1c2b24]/75 border border-[#588157]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#35a333]">7</span>
              <span className="mt-1 block text-xs text-[#dad7cd]/80 font-medium">Provinces &amp; Regions</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1c2b24]/75 border border-[#588157]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#35a333]">100%</span>
              <span className="mt-1 block text-xs text-[#dad7cd]/80 font-medium">Direct Official Links</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
