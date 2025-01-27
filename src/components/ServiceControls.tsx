import { Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "./StatusIndicator"

interface ServiceControlsProps {
  onPlay?: () => void
  onStop?: () => void
  status?: "running" | "stopped" | "error"
  currentFile?: string
  enabledServicesCount: number
}

export function ServiceControls({ 
  onPlay, 
  onStop, 
  status = "stopped",
  currentFile,
  enabledServicesCount = 0
}: ServiceControlsProps) {
  console.log('Enabled services:', enabledServicesCount); // Debug log
  console.log('Status:', status); // Debug log
  console.log('Button disabled:', status === 'running' || enabledServicesCount === 0); // Debug condition
  
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onPlay}
        disabled={status === 'running' || enabledServicesCount === 0}
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onStop}
        disabled={status !== 'running'}
      >
        <Square className="h-4 w-4" />
      </Button>
      <StatusIndicator status={status} />
      {currentFile && (
        <span className="text-sm text-muted-foreground">
          Current file: {currentFile}
        </span>
      )}
    </div>
  )
} 