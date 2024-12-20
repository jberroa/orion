import { Circle } from 'lucide-react'
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "running" | "stopped" | "error"
  className?: string
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Circle
        className={cn("h-2 w-2 fill-current", {
          "text-green-500": status === "running",
          "text-red-500": status === "stopped",
          "text-yellow-500": status === "error",
        })}
      />
      <span className="text-sm capitalize">{status}</span>
    </div>
  )
}

