import { Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "./StatusIndicator"

interface ServiceControlsProps {
  onPlay?: () => void
  onStop?: () => void
  status?: "running" | "stopped" | "error"
  currentFile?: string
  disabled?: boolean
}

export function ServiceControls({ 
  onPlay, 
  onStop, 
  status = "stopped",
  currentFile,
  disabled
}: ServiceControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onPlay}
        disabled={disabled || status === 'running'}
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onStop}
        disabled={disabled || status !== 'running'}
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