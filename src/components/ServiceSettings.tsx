import { Settings, RefreshCw, FileSearch2, RocketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useState } from "react";
import { BuildLocalModal, type Step } from "@/components/BuildLocalModal";

interface ServiceSettingsProps {
  serviceId: string;
  tomcatNumber: number;
  javaVersion: string;
  disabled?: boolean;
  onBuildService: (serviceId: string) => Promise<void>;
}

export function ServiceSettings({ serviceId, tomcatNumber, javaVersion, disabled, onBuildService }: ServiceSettingsProps) {
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const [buildStep, setBuildStep] = useState<Step>({
    id: 'local',
    title: 'Building Local Service',
    status: 'pending',
    logs: []
  });

  const handleBuildClick = async () => {
    setBuildModalOpen(true);
    setBuildStep(prev => ({ ...prev, status: 'in-progress', logs: [] }));
    
    try {
      await onBuildService(serviceId);
      setBuildStep(prev => ({ ...prev, status: 'completed' }));
      setTimeout(() => {
        setBuildModalOpen(false);
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setBuildStep(prev => ({
        ...prev,
        status: 'error',
        logs: [...prev.logs, `Error: ${errorMessage}`]
      }));
    }
  };

  return (
    <>
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={disabled}>
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" onOpenAutoFocus={(ev) => ev.preventDefault()}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Service Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure the service parameters
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Tomcat</Label>
                <Select defaultValue={tomcatNumber.toString()} disabled>
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Select Tomcat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Instance 1</SelectItem>
                    <SelectItem value="2">Instance 2</SelectItem>
                    <SelectItem value="3">Instance 3</SelectItem>
                    <SelectItem value="4">Instance 4</SelectItem>
                    <SelectItem value="5">Instance 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Java</Label>
                <Select defaultValue={javaVersion} disabled>
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Select Java Version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Java 7</SelectItem>
                    <SelectItem value="8">Java 8</SelectItem>
                    <SelectItem value="17">Java 17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="icon" disabled>
                <FileSearch2 className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" disabled>
                <RefreshCw className="h-4 w-4 rotate-90" />
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleBuildClick}>
                      <RocketIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Build Service</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <BuildLocalModal
        open={buildModalOpen}
        onOpenChange={setBuildModalOpen}
        step={buildStep}
      />
    </>
  )
} 