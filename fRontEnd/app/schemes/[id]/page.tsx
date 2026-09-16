import { notFound } from "next/navigation"
import { SchemeDetail } from "@/components/scheme-detail"

export default async function SchemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const schemeId = Number(id)
  if (!Number.isFinite(schemeId)) notFound()
  return <SchemeDetail id={schemeId} />
}
