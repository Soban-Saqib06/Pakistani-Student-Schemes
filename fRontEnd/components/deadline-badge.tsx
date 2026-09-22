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
          ? "border-[#588157]/20 bg-[#1c2b24]/40 text-[#a3b18a]/60 line-through"
          : "border-[#588157]/45 bg-[#1c2b24]/70 text-[#dad7cd]"
      } ${className ?? ""}`}
    >
      <CalendarClockIcon className="size-3.5 mr-1 text-[#35a333]" />
      {info.label}
    </Badge>
  )
}
