import { AlertTriangleIcon, CalendarClockIcon, ClockIcon } from "lucide-react"

import { getDeadlineInfo } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

export function DeadlineBadge({ deadline, className }: { deadline: string; className?: string }) {
  const info = getDeadlineInfo(deadline)
  const isCritical = info.status === "closing" && info.daysLeft <= 3 && info.daysLeft >= 0
  const isClosing = info.status === "closing"
  const isExpired = info.status === "expired"

  if (isCritical) {
    return (
      <Badge
        variant="outline"
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold border-red-500/80 bg-red-950/70 text-red-200 shadow-xs ${className ?? ""}`}
      >
        <span className="size-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />
        <AlertTriangleIcon className="size-3.5 text-red-400 shrink-0" />
        <span>{info.label}</span>
      </Badge>
    )
  }

  if (isClosing) {
    return (
      <Badge
        variant="outline"
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold border-amber-500/60 bg-amber-950/50 text-amber-200 ${className ?? ""}`}
      >
        <ClockIcon className="size-3.5 text-amber-400 shrink-0" />
        <span>{info.label}</span>
      </Badge>
    )
  }

  if (isExpired) {
    return (
      <Badge
        variant="outline"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-normal border-[#588157]/20 bg-[#1c2b24]/40 text-[#a3b18a]/60 line-through ${className ?? ""}`}
      >
        <CalendarClockIcon className="size-3.5 text-[#a3b18a]/40 shrink-0" />
        <span>Closed</span>
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border-[#588157]/45 bg-[#1c2b24]/75 text-[#dad7cd] ${className ?? ""}`}
    >
      <CalendarClockIcon className="size-3.5 text-[#a3b18a] shrink-0" />
      <span>{info.label}</span>
    </Badge>
  )
}
