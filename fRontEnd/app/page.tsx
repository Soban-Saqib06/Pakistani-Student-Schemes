import Link from "next/link"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description:
    "Real-time directory of verified Pakistani government scholarships, laptop programs, and provincial grants before deadlines expire.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center items-center bg-[#092328] text-white selection:bg-[#2a835f] selection:text-white p-2.5 sm:p-5 md:p-7">
      {/* Concentric Smooth Rounded Background Rectangles */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {/* Outermost Rounded Rectangle Outline */}
        <div className="w-full rounded-[34px] sm:rounded-[46px] md:rounded-[56px] border border-[#8bbb92]/15 p-2 sm:p-3 md:p-4 transition-all duration-300">
          {/* Middle Rounded Rectangle Outline */}
          <div className="w-full rounded-[26px] sm:rounded-[38px] md:rounded-[48px] border border-[#8bbb92]/25 p-2 sm:p-3 md:p-4 transition-all duration-300">
            {/* Core Hero Rounded Rectangle Card */}
            <div className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-[#8bbb92]/35 bg-gradient-to-b from-[#12544f]/85 via-[#0d343b]/90 to-[#092328]/95 px-6 py-16 sm:px-12 sm:py-24 md:py-28 text-center shadow-[0_16px_50px_rgba(4,18,20,0.6)] backdrop-blur-xl">
              
              {/* Authentic Status Tag (No generic sparkles) */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8bbb92]/30 bg-[#12544f]/60 px-3.5 py-1 text-xs font-semibold text-[#8bbb92] mb-6 tracking-wide shadow-2xs">
                <span className="size-2 rounded-full bg-[#8bbb92] animate-pulse" />
                <span>Verified Schemes · 2026/2027 Academic Year</span>
              </div>

              {/* Brand Display Title */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] text-white select-none">
                Every government scholarship in Pakistan.
                <span className="block mt-2 text-[#8bbb92]">Before the deadline passes.</span>
              </h1>

              {/* Concrete Problem-Solving Subheadline */}
              <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#f2f7f4]/90 text-pretty">
                We monitor active funding, laptop initiatives, and provincial grants from HEC, PEEF, BEEF, and Ihsaas in one live directory &mdash;{" "}
                <span className="text-white font-medium">with verified closing dates and direct portal links.</span>
              </p>

              {/* Custom Action Buttons with Micro-Borders */}
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/browse"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md bg-[#2a835f] border border-[#8bbb92]/40 px-7 py-3.5 text-base font-semibold text-white shadow-xs transition-all hover:bg-[#2a835f]/90 hover:border-[#8bbb92]/70 active:translate-y-px cursor-pointer"
                >
                  <span>Explore All Schemes</span>
                  <ArrowRightIcon className="size-4.5" />
                </Link>

                <Link
                  href="/categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md border border-[#8bbb92]/25 bg-[#12544f]/60 px-6 py-3.5 text-base font-semibold text-[#f2f7f4] transition-all hover:bg-[#12544f] hover:border-[#8bbb92]/50 active:translate-y-px cursor-pointer"
                >
                  <LayersIcon className="size-4.5 text-[#8bbb92]" />
                  <span>Browse by Category</span>
                </Link>
              </div>

              {/* Concrete Proof Metrics (Replaces template middot trust line) */}
              <div className="mt-12 pt-8 border-t border-[#8bbb92]/15 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
                <div className="p-3.5 rounded-lg bg-[#092328]/50 border border-[#8bbb92]/15">
                  <span className="block text-2xl font-black text-white">12+</span>
                  <span className="text-xs text-[#8bbb92] font-semibold">Active Opportunities</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#092328]/50 border border-[#8bbb92]/15">
                  <span className="block text-2xl font-black text-white">8</span>
                  <span className="text-xs text-[#8bbb92] font-semibold">Academic Categories</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#092328]/50 border border-[#8bbb92]/15">
                  <span className="block text-2xl font-black text-white">7</span>
                  <span className="text-xs text-[#8bbb92] font-semibold">Provinces &amp; Regions</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#092328]/50 border border-[#8bbb92]/15">
                  <span className="block text-2xl font-black text-white">100%</span>
                  <span className="text-xs text-[#8bbb92] font-semibold">Direct Official Links</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
