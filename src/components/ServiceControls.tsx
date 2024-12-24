import { Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "./StatusIndicator"
import { useState } from "react"

interface ServiceControlsProps {
  onPlay?: () => void
  onStop?: () => void
  status?: "running" | "stopped" | "error"
  currentFile?: string
}

export function ServiceControls({ 
  onPlay, 
  onStop, 
  status = "stopped",
  currentFile
}: ServiceControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onPlay}
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onStop}
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