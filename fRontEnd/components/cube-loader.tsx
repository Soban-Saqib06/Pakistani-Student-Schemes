import { cn } from "cn"

interface CubeLoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
  color?: "emerald" | "white"
  label?: string
}

export function CubeLoader({
  className,
  size = "md",
  color = "emerald",
  label,
}: CubeLoaderProps) {
  const sizeClass = {
    sm: "scale-75",
    md: "scale-100",
    lg: "scale-125",
  }[size]

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-8", className)}>
      <div
        className={cn(
          "kinetic-spinner",
          sizeClass,
          color === "white" && "kinetic-spinner-white"
        )}
      />
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
          {label}
        </p>
      ) : null}
    </div>
  )
}
