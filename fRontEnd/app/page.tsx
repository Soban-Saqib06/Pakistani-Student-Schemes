import Link from "next/link"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description:
    "Real-time directory of verified Pakistani government scholarships, laptop programs, and provincial grants before deadlines expire.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center items-center bg-[#18230f] text-[#f3f7f4] selection:bg-[#1f7d53] selection:text-white p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-5xl">
        {/* Core Hero Panel - Elevated #27391c over dark #18230f background */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-[#255f38]/50 bg-gradient-to-b from-[#27391c] via-[#233319] to-[#1c2914] px-6 py-16 sm:px-12 sm:py-20 md:py-24 text-center shadow-[0_20px_50px_rgba(10,16,8,0.7)]">
          
          {/* Subtle Accent Radial Light */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-[#1f7d53]/15 blur-3xl" />

          {/* Status Tag */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-[#255f38] bg-[#18230f]/80 px-4 py-1.5 text-xs font-semibold text-[#34d399] mb-8 tracking-wide shadow-2xs">
            <span className="size-2 rounded-full bg-[#34d399] animate-pulse" />
            <span>Verified Schemes · 2026/2027 Academic Year</span>
          </div>

          {/* Brand Display Title */}
          <h1 className="relative text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white select-none">
            Every government scholarship in Pakistan.
            <span className="block mt-2 text-[#34d399]">Before the deadline passes.</span>
          </h1>

          {/* Concrete Problem-Solving Subheadline */}
          <p className="relative mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#c4d6c9] text-pretty">
            We monitor active funding, laptop initiatives, and provincial grants from HEC, PEEF, BEEF, and Ihsaas in one live directory &mdash;{" "}
            <span className="text-white font-medium">with verified closing dates and direct portal links.</span>
          </p>

          {/* Action Buttons */}
          <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#1f7d53] hover:bg-[#259b67] px-8 py-3.5 text-base font-bold text-white shadow-md transition-all active:translate-y-px cursor-pointer"
            >
              <span>Explore All Schemes</span>
              <ArrowRightIcon className="size-4.5" />
            </Link>

            <Link
              href="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#255f38] bg-[#18230f]/60 hover:bg-[#18230f] px-7 py-3.5 text-base font-semibold text-[#f3f7f4] transition-all active:translate-y-px cursor-pointer"
            >
              <LayersIcon className="size-4.5 text-[#34d399]" />
              <span>Browse by Category</span>
            </Link>
          </div>

          {/* Metrics Row */}
          <div className="relative mt-14 pt-8 border-t border-[#255f38]/40 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-[#18230f]/70 border border-[#255f38]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#34d399]">12+</span>
              <span className="mt-1 block text-xs text-[#a8c2b0] font-medium">Active Opportunities</span>
            </div>
            <div className="p-4 rounded-xl bg-[#18230f]/70 border border-[#255f38]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#34d399]">8</span>
              <span className="mt-1 block text-xs text-[#a8c2b0] font-medium">Academic Categories</span>
            </div>
            <div className="p-4 rounded-xl bg-[#18230f]/70 border border-[#255f38]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#34d399]">7</span>
              <span className="mt-1 block text-xs text-[#a8c2b0] font-medium">Provinces &amp; Regions</span>
            </div>
            <div className="p-4 rounded-xl bg-[#18230f]/70 border border-[#255f38]/40 shadow-xs">
              <span className="block text-2xl sm:text-3xl font-black text-[#34d399]">100%</span>
              <span className="mt-1 block text-xs text-[#a8c2b0] font-medium">Direct Official Links</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
