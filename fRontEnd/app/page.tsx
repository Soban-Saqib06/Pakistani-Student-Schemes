import Link from "next/link"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description:
    "Real-time directory of verified Pakistani government scholarships, laptop programs, and provincial grants before deadlines expire.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center items-center bg-[#063b00] text-white selection:bg-[#90b800] selection:text-[#063b00] p-2.5 sm:p-5 md:p-7">
      {/* Concentric Smooth Rounded Background Rectangles */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {/* Outermost Rounded Rectangle Outline */}
        <div className="w-full rounded-[34px] sm:rounded-[46px] md:rounded-[56px] border border-[#90b800]/20 p-2 sm:p-3 md:p-4 transition-all duration-300">
          {/* Middle Rounded Rectangle Outline */}
          <div className="w-full rounded-[26px] sm:rounded-[38px] md:rounded-[48px] border border-[#90b800]/30 p-2 sm:p-3 md:p-4 transition-all duration-300">
            {/* Core Hero Rounded Rectangle Card */}
            <div className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-[#90b800]/45 bg-gradient-to-b from-[#14520a]/90 via-[#0e4006]/95 to-[#063b00]/98 px-6 py-16 sm:px-12 sm:py-24 md:py-28 text-center shadow-[0_20px_60px_rgba(2,20,0,0.7)] backdrop-blur-xl">
              
              {/* Authentic Status Tag with Canary Highlight */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#90b800]/50 bg-[#266210]/70 px-3.5 py-1 text-xs font-semibold text-[#e1e100] mb-6 tracking-wide shadow-2xs">
                <span className="size-2 rounded-full bg-[#e1e100] animate-pulse" />
                <span>Verified Schemes · 2026/2027 Academic Year</span>
              </div>

              {/* Brand Display Title */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] text-white select-none">
                Every government scholarship in Pakistan.
                <span className="block mt-2 text-[#e1e100]">Before the deadline passes.</span>
              </h1>

              {/* Concrete Problem-Solving Subheadline */}
              <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#f6faf4]/90 text-pretty">
                We monitor active funding, laptop initiatives, and provincial grants from HEC, PEEF, BEEF, and Ihsaas in one live directory &mdash;{" "}
                <span className="text-white font-medium">with verified closing dates and direct portal links.</span>
              </p>

              {/* Custom High-Contrast Action Buttons */}
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/browse"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md bg-[#90b800] border border-[#e1e100]/60 px-7 py-3.5 text-base font-bold text-[#063b00] shadow-xs transition-all hover:bg-[#9ec802] active:translate-y-px cursor-pointer"
                >
                  <span>Explore All Schemes</span>
                  <ArrowRightIcon className="size-4.5" />
                </Link>

                <Link
                  href="/categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md border border-[#90b800]/40 bg-[#266210]/80 px-6 py-3.5 text-base font-semibold text-[#f6faf4] transition-all hover:bg-[#266210] hover:border-[#90b800]/70 active:translate-y-px cursor-pointer"
                >
                  <LayersIcon className="size-4.5 text-[#e1e100]" />
                  <span>Browse by Category</span>
                </Link>
              </div>

              {/* Concrete Proof Metrics */}
              <div className="mt-12 pt-8 border-t border-[#90b800]/20 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
                <div className="p-3.5 rounded-lg bg-[#063b00]/75 border border-[#90b800]/25">
                  <span className="block text-2xl font-black text-[#e1e100]">12+</span>
                  <span className="text-xs text-[#f6faf4]/90 font-semibold">Active Opportunities</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#063b00]/75 border border-[#90b800]/25">
                  <span className="block text-2xl font-black text-[#e1e100]">8</span>
                  <span className="text-xs text-[#f6faf4]/90 font-semibold">Academic Categories</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#063b00]/75 border border-[#90b800]/25">
                  <span className="block text-2xl font-black text-[#e1e100]">7</span>
                  <span className="text-xs text-[#f6faf4]/90 font-semibold">Provinces &amp; Regions</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#063b00]/75 border border-[#90b800]/25">
                  <span className="block text-2xl font-black text-[#e1e100]">100%</span>
                  <span className="text-xs text-[#f6faf4]/90 font-semibold">Direct Official Links</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
