import { CubeLoader } from "@/components/cube-loader"

export default function SchemeLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4 py-16">
      <CubeLoader size="md" label="Loading Scheme Details..." />
    </div>
  )
}
