import { AwardIcon, BookOpenIcon, CheckCircle2Icon, SparklesIcon, UsersIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Bridging Education &amp; Opportunity
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground leading-relaxed">
          A centralized, open platform designed to ensure every Pakistani student has transparent, timely access to government schemes, merit scholarships, and financial aid initiatives.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-card p-7 shadow-xs">
          <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-pak-green/10 text-pak-green">
            <UsersIcon className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">The Challenge</h3>
          <p className="mt-2.5 text-base text-muted-foreground leading-relaxed">
            Every year, billions of rupees in educational grants, laptop schemes, and scholarships are announced across provincial and federal agencies. However, deadlines expire unnoticed because information is scattered across dozens of unlinked department portals.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-7 shadow-xs">
          <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-pak-green/10 text-pak-green">
            <AwardIcon className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Our Solution</h3>
          <p className="mt-2.5 text-base text-muted-foreground leading-relaxed">
            TaleemHub aggregates opportunities from HEC, PEEF, BEEF, Ehsaas, and provincial youth programs into a unified catalog with structured eligibility matching, verified deadline countdowns, and direct application links.
          </p>
        </div>
      </div>

      <div className="mt-16 rounded-lg border border-border/60 bg-muted/30 p-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">What We Provide</h3>
        <ul className="grid gap-3.5 sm:grid-cols-2 text-base text-muted-foreground">
          <li className="flex items-center gap-2.5">
            <CheckCircle2Icon className="size-5 text-pak-green shrink-0" />
            <span>Verified official application portals</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2Icon className="size-5 text-pak-green shrink-0" />
            <span>Personalized bookmarking &amp; tracking</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2Icon className="size-5 text-pak-green shrink-0" />
            <span>Regional &amp; provincial quota filtering</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2Icon className="size-5 text-pak-green shrink-0" />
            <span>Clear document checklists &amp; deadlines</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
