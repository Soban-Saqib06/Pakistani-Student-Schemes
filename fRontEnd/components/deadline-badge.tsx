import { CalendarClockIcon } from "lucide-react"

import { getDeadlineInfo } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

export function DeadlineBadge({ deadline, className }: { deadline: string; className?: string }) {
  const info = getDeadlineInfo(deadline)
  const isClosing = info.status === "closing"
  const isExpired = info.status === "expired"

  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold px-2.5 py-0.5 backdrop-blur-xs ${
        isClosing
          ? "border-red-500/50 bg-red-950/40 text-red-300 border-red-800/60"
          : isExpired
          ? "border-white/10 bg-white/5 text-neutral-400"
          : "border-white/15 bg-white/10 text-neutral-200"
      } ${className ?? ""}`}
    >
      <CalendarClockIcon className="size-3.5 mr-1" />
      {info.label}
    </Badge>
  )
}
