import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "TaleemHub — Pakistan's Scholarships & Education Schemes",
  description: "Connecting Pakistani students with verified government scholarships, laptop initiatives, and provincial grants before deadlines slip away.",
}

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ searchParams }: PageProps) {
  // If user hits "/" with filter query params (e.g. from bookmarked link, browser history, or category selection),
  // seamlessly forward them to the live browse directory so they never get stranded on the landing hero.
  const resolved = searchParams ? await searchParams : {}
  const hasFilter = Boolean(
    resolved.eligibID || resolved.search || resolved.province || resolved.textQuery || resolved.sortBy
  )
  if (hasFilter) {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(resolved)) {
      if (typeof v === "string" && v && v !== "all") {
        qs.set(k, v)
      }
    }
    redirect(qs.toString() ? `/browse?${qs.toString()}` : "/browse")
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] justify-center items-center bg-[#020b05] text-white selection:bg-pak-green selection:text-white p-2.5 sm:p-5 md:p-7">
      {/* Concentric Smooth Rounded Background Rectangles (Edge-to-Edge from Inspo) */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {/* Outermost Rounded Rectangle Outline - expands to screen edge */}
        <div className="w-full rounded-[34px] sm:rounded-[46px] md:rounded-[56px] border border-emerald-500/20 p-2 sm:p-3 md:p-4 transition-all duration-300">
          {/* Middle Rounded Rectangle Outline */}
          <div className="w-full rounded-[26px] sm:rounded-[38px] md:rounded-[48px] border border-emerald-500/30 p-2 sm:p-3 md:p-4 transition-all duration-300">
            {/* Core Hero Rounded Rectangle Card */}
            <div className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] border border-emerald-500/40 bg-gradient-to-b from-emerald-950/60 via-[#031d0f]/75 to-[#010e06]/95 px-6 py-20 sm:px-12 sm:py-28 md:py-36 text-center shadow-[0_0_100px_-20px_rgba(16,185,129,0.3)] backdrop-blur-xl">
              {/* Subtle Dark Green Ambient Inner Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
              >
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-emerald-500/18 blur-[130px]" />
              </div>

              {/* Brand Display Title */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] text-white select-none">
                Taleem<span className="text-pak-green">Hub</span>
              </h1>

              {/* Mission Statement */}
              <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-neutral-300 text-pretty">
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
              <div className="mt-10 text-xs sm:text-sm text-neutral-400/90 tracking-wide">
                <span>100% Free</span>
                <span className="mx-2.5 text-neutral-600">·</span>
                <span>Official Portals (HEC, PEEF, BEEF)</span>
                <span className="mx-2.5 text-neutral-600">·</span>
                <span>Live Deadlines</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
