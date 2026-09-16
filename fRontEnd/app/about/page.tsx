import { AwardIcon, BookOpenIcon, CheckCircle2Icon, GraduationCapIcon, UsersIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-4">
          <GraduationCapIcon className="size-4" />
          Empowering Pakistani Youth
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Bridging Education &amp; Opportunity
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A centralized, open platform designed to ensure every Pakistani student has transparent, timely access to government schemes, merit scholarships, and financial aid initiatives.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UsersIcon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">The Challenge</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Every year, billions of rupees in educational grants, laptop schemes, and scholarships are announced across provincial and federal agencies. However, deadlines expire unnoticed because information is scattered across dozens of unlinked department portals.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AwardIcon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Our Solution</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            TaleemHub aggregates opportunities from HEC, PEEF, BEEF, Ehsaas, and provincial youth programs into a unified catalog with structured eligibility matching, verified deadline countdowns, and direct application links.
          </p>
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 p-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">What We Provide</h3>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-primary shrink-0" />
            <span>Verified official application portals</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-primary shrink-0" />
            <span>Personalized bookmarking &amp; tracking</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-primary shrink-0" />
            <span>Regional &amp; provincial quota filtering</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-primary shrink-0" />
            <span>Clear document checklists &amp; deadlines</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
