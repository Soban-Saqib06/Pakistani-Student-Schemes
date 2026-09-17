import Link from "next/link"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description: "Connecting Pakistani students with verified government scholarships, laptop initiatives, and provincial grants before deadlines slip away.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center bg-[#020e07] text-white selection:bg-pak-green selection:text-white">
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Subtle Dark Green Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[680px] rounded-full bg-emerald-500/10 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-4xl px-4 text-center">
          {/* Brand Display Title */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-[0.95] text-white select-none">
            Taleem<span className="text-pak-green">Hub</span>
          </h1>

          {/* Mission Statement */}
          <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-neutral-300 text-pretty">
            Connecting Pakistani students with verified government scholarships, laptop initiatives, and provincial grants &mdash;{" "}
            <span className="text-white font-medium">before deadlines slip away.</span>
          </p>

          {/* Clean, Non-AI Rectangular Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md bg-pak-green px-7 py-3.5 text-base font-semibold text-white shadow-xs transition-all hover:bg-pak-green/90 active:translate-y-px cursor-pointer"
            >
              <span>Explore All Schemes</span>
              <ArrowRightIcon className="size-4.5" />
            </Link>

            <Link
              href="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 active:translate-y-px cursor-pointer"
            >
              <LayersIcon className="size-4.5 text-pak-green" />
              <span>Browse by Category</span>
            </Link>
          </div>

          {/* Quiet, minimalist trust note */}
          <div className="mt-12 text-xs sm:text-sm text-neutral-400/90 tracking-wide">
            <span>100% Free</span>
            <span className="mx-2.5 text-neutral-600">·</span>
            <span>Official Portals (HEC, PEEF, BEEF)</span>
            <span className="mx-2.5 text-neutral-600">·</span>
            <span>Live Deadlines</span>
          </div>
        </div>
      </section>
    </div>
  )
}
