import {
  MailIcon,
  PhoneIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
  SparklesIcon,
  CheckCircle2Icon,
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-pak-green/30 bg-pak-green/10 px-3.5 py-1 text-xs font-semibold text-pak-green mb-4 shadow-2xs">
          <MessageSquareIcon className="size-3.5" />
          Get In Touch
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Contact &amp; Scheme Submissions
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Found a government scholarship, university grant, or student scheme not currently listed on TaleemHub?
          Reach out directly so we can verify and publish it for fellow Pakistani students!
        </p>
      </div>

      {/* Main Contact Cards Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Email Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-pak-green/50 hover:shadow-md">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-pak-green/10 text-pak-green">
              <MailIcon className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Direct Email
            </span>
            <h3 className="mt-1 text-base font-bold text-foreground break-all">
              m.sobansaqib@gmail.com
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Send scheme notifications, eligibility brochures, or official links directly to my inbox.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50">
            <a
              href="mailto:m.sobansaqib@gmail.com?subject=New%20Scheme%20Submission%20-%20TaleemHub"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-pak-green px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-pak-green/90 shadow-2xs"
            >
              <MailIcon className="size-3.5" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* Phone / WhatsApp Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-pak-green/50 hover:shadow-md">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-pak-green/10 text-pak-green">
              <PhoneIcon className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone &amp; WhatsApp
            </span>
            <h3 className="mt-1 text-base font-bold text-foreground">
              0325-4333030
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Available for quick tips, verification confirmations, or WhatsApp messages.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex gap-2">
            <a
              href="tel:03254333030"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <PhoneIcon className="size-3.5 text-pak-green" />
              <span>Call</span>
            </a>
            <a
              href="https://wa.me/923254333030?text=Hi,%20I%20would%20like%20to%20suggest%20a%20new%20scheme%20for%20TaleemHub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-pak-green px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-pak-green/90 shadow-2xs"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-pak-green/50 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-pak-green/10 text-pak-green">
              <svg
                className="size-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Professional Network
            </span>
            <h3 className="mt-1 text-base font-bold text-foreground truncate">
              Muhammad Soban Saqib
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Connect on LinkedIn for collaborative initiatives, developer discussions, and project updates.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50">
            <a
              href="https://www.linkedin.com/in/muhammad-soban-saqib-35053628b/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <span>View LinkedIn Profile</span>
              <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>

      {/* Scheme Submission Guidelines Box */}
      <div className="mt-12 rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/30 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-pak-green font-semibold text-sm mb-2">
          <SparklesIcon className="size-4" />
          <span>Help Us Keep TaleemHub Comprehensive</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          What information should you include when submitting a new scheme?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          When sending in details for a newly announced opportunity, the following details will help us list it faster:
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-start gap-2.5">
            <CheckCircle2Icon className="size-4 text-pak-green shrink-0 mt-0.5" />
            <span><strong>Scheme Title:</strong> Official name of the scholarship or grant</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2Icon className="size-4 text-pak-green shrink-0 mt-0.5" />
            <span><strong>Organization / Ministry:</strong> HEC, PEEF, BEEF, or university name</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2Icon className="size-4 text-pak-green shrink-0 mt-0.5" />
            <span><strong>Target Category:</strong> Undergraduate, Postgraduate, Need-based, etc.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2Icon className="size-4 text-pak-green shrink-0 mt-0.5" />
            <span><strong>Application Link &amp; Deadline:</strong> The official portal or advertisement link</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
