import { notFound } from "next/navigation"
import { SchemeDetail } from "@/components/scheme-detail"

export function generateStaticParams() {
  // Pre-render IDs 1 through 200 for static export
  return Array.from({ length: 200 }, (_, i) => ({ id: String(i + 1) }))
}

export default async function SchemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const schemeId = Number(id)
  if (!Number.isFinite(schemeId)) notFound()
  return <SchemeDetail id={schemeId} />
}
