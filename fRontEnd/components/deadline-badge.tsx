import { CalendarClockIcon } from "lucide-react"

import { getDeadlineInfo } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

export function DeadlineBadge({ deadline, className }: { deadline: string; className?: string }) {
  const info = getDeadlineInfo(deadline)
  const variant = info.status === "expired" ? "outline" : info.status === "closing" ? "destructive" : "secondary"

  return (
    <Badge variant={variant} className={className}>
      <CalendarClockIcon data-icon="inline-start" />
      {info.label}
    </Badge>
  )
}
