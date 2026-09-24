export function formatDate(iso?: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d)
}

export type DeadlineStatus = "open" | "closing" | "expired" | "none"

export interface DeadlineInfo {
  status: DeadlineStatus
  daysLeft: number
  label: string
}

export function getDeadlineInfo(iso?: string | null): DeadlineInfo {
  if (!iso) {
    return { status: "none", daysLeft: 0, label: "—" }
  }
  const now = new Date()
  const deadline = new Date(iso)
  if (Number.isNaN(deadline.getTime())) {
    return { status: "none", daysLeft: 0, label: "—" }
  }
  const msPerDay = 1000 * 60 * 60 * 24
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / msPerDay)

  if (daysLeft < 0) {
    return { status: "expired", daysLeft, label: "Closed" }
  }
  if (daysLeft === 0) {
    return { status: "closing", daysLeft, label: "Closes today" }
  }
  if (daysLeft <= 7) {
    return { status: "closing", daysLeft, label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left` }
  }
  return { status: "open", daysLeft, label: `${daysLeft} days left` }
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}
