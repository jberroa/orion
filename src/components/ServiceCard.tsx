import {
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { BranchSelector } from "./BranchSelector";
import { ServiceSettings } from "./ServiceSettings";
import { useServices } from "@/contexts/ServicesContext";
import { BuildLocalModal } from "./BuildLocalModal";

interface Service {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  favorite: boolean;
  parentRepo?: string;
  gitUrl: string;
  branch: string;
  tomcatNumber: number;
  javaVersion: string;
  // ... any other service properties
}

interface ServiceCardProps {
  service: Service;
  onBranchChange: (value: string) => void;
}

export function ServiceCard({ service, onBranchChange }: ServiceCardProps) {
  const { toggleFavorite, toggleEnabled, processStatus, skipTests, forceUpdate } = useServices();
  const isRunning = processStatus === "running";
  
  const handleBuildService = async (serviceId: string) => {
    try {
      setBuildModalOpen(true);
      setBuildStep(prev => ({
        ...prev,
        status: 'in-progress',
        logs: []
      }));
      
      window.electron.on('build-log', (data: { stepId: string, log: string }) => {
        console.log("Received build log:", data);
        setBuildStep(prev => {
          const newStep = {
            ...prev,
            logs: [...prev.logs, data.log]
          };
          console.log("Updated build step:", newStep);
          return newStep;
        });
      });

      const result = await window.electron.invoke('build-local-services', [service], skipTests, forceUpdate);
      
      if (!result.success) {
        console.log("Build failed:", result.error);
        setBuildStep(prev => ({
          ...prev,
          status: 'error',
          logs: [...prev.logs, `Error: ${result.error}`]
        }));
        throw new Error(result.error);
      }

      console.log("Build completed successfully");
      setBuildStep(prev => ({
        ...prev,
        status: 'completed'
      }));

      setTimeout(() => {
        setBuildModalOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Error building service:', error);
      setBuildStep(prev => ({
        ...prev,
        status: 'error',
        logs: [...prev.logs, `Error: ${error.message}`]
      }));
      throw error;
    }
  };

  // Add state for the modal and build step
  const [buildModalOpen, setBuildModalOpen] = useState(false);
  const [buildStep, setBuildStep] = useState<Step>({
    id: 'local',
    title: 'Building Local Service',
    status: 'pending',
    logs: []
  });

  return (
    <>
      <Card className={cn(
        "overflow-hidden min-w-[350px]",
        isRunning && "opacity-75 pointer-events-none select-none"
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
            {service.parentRepo && (
              <Badge variant="secondary" className="w-fit">
                {service.parentRepo}
              </Badge>
            )}
          </div>
          <div className="flex self-start space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(service.id)}
              className={service.favorite ? "text-yellow-500" : ""}
              disabled={isRunning}
            >
              <Star
                className={cn("h-4 w-4", service.favorite && "fill-current text-primary")}
              />
            </Button>

            <ServiceSettings 
              serviceId={service.id}
              tomcatNumber={service.tomcatNumber}
              javaVersion={service.javaVersion}
              disabled={isRunning}
              onBuildService={handleBuildService}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{service.description}</p>
          <div className="flex items-center justify-between">
            <BranchSelector 
              gitUrl={service.gitUrl} 
              value={service.branch}
              onValueChange={onBranchChange}
              placeholder="Select Branch"
              disabled={isRunning}
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Enabled</span>
              <Switch
                id={`service-${service.id}`}
                checked={service.enabled}
                onCheckedChange={() => toggleEnabled(service.id)}
                disabled={isRunning}
                aria-disabled={isRunning}
                className={cn(isRunning && "pointer-events-none")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <BuildLocalModal
        open={buildModalOpen}
        onOpenChange={setBuildModalOpen}
        step={buildStep}
      />
    </>
  );
}
