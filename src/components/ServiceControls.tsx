import { Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "./StatusIndicator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"
import { useServices } from "@/contexts/ServicesContext"

interface ServiceControlsProps {
  onPlay?: (mode: "build-and-run" | "run") => void
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
  enabledServicesCount = 0,
}: ServiceControlsProps) {
  const [showDialog, setShowDialog] = React.useState(false)
  const { repoPath } = useServices()

  const handlePlayClick = (mode: "build-and-run" | "run") => {
    if (!repoPath) {
      setShowDialog(true)
      return
    }
    onPlay?.(mode)
  }

  const handleOpenChange = (open: boolean) => {
    setShowDialog(open)
  }

  console.log('Enabled services:', enabledServicesCount); // Debug log
  console.log('Status:', status); // Debug log
  console.log('Button disabled:', status === 'running' || enabledServicesCount === 0); // Debug condition
  
  return (
    <>
      <div className="flex items-center gap-4">
        <Dialog 
          open={showDialog} 
          onOpenChange={handleOpenChange} 
          // modal={false}
        >
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                disabled={status === 'running' || enabledServicesCount === 0}
              >
                <Play className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlePlayClick("build-and-run")}>
                Build and Run
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePlayClick("run")}>
                Run
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent 
            className="sm:max-w-[425px]"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Repository Path Not Set</DialogTitle>
              <DialogDescription>
                Please set the repository path in settings before running the service.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

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
    </>
  )
} 