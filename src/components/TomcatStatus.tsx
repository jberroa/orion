import { Circle } from 'lucide-react' 
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TomcatStatusProps {
  id: number
  status: "running" | "stopped" | "error"
}

export function TomcatStatus({ id, status }: TomcatStatusProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Circle
              className={cn("h-2 w-2 fill-current", {
                "text-green-500": status === "running",
                "text-red-500": status === "stopped",
                "text-yellow-500": status === "error",
              })}
            />
            <span className="text-sm">Tomcat {id}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Status: {status}</p>
          {status === "running" && <p>Uptime: 2d 5h 36m</p>}
          {status === "stopped" && <p>Stopped at: 2023-12-10 08:45 AM</p>}
          {status === "error" && <p>Error: Connection timeout</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

