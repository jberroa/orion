import {
  Heart,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { BranchSelector } from "./BranchSelector";
import { ServiceSettings } from "./ServiceSettings";
import { useServices } from "@/contexts/ServicesContext";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  favorite: boolean;
  parentRepo?: string;
  gitUrl: string;
  branch: string;
  onBranchChange: (value: string) => void;
}

export function ServiceCard({
  id,
  name,
  description,
  enabled,
  favorite,
  parentRepo,
  gitUrl,
  branch,
  onBranchChange,
}: ServiceCardProps) {
  const { toggleFavorite, toggleEnabled, processStatus } = useServices();
  const isRunning = processStatus === "running";
  
  console.log(`ServiceCard ${name}:`, { processStatus, isRunning });

  return (
    <Card className={cn(
      "overflow-hidden min-w-[350px]",
      isRunning && "opacity-75 pointer-events-none select-none"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          {parentRepo && (
            <Badge variant="secondary" className="w-fit">
              {parentRepo}
            </Badge>
          )}
        </div>
        <div className="flex self-start space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(id)}
            className={favorite ? "text-yellow-500" : ""}
            disabled={isRunning}
          >
            <Star
              className={cn("h-4 w-4", favorite && "fill-current text-primary")}
            />
          </Button>

          <ServiceSettings disabled={isRunning} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between">
          <BranchSelector 
            gitUrl={gitUrl} 
            value={branch}
            onValueChange={onBranchChange}
            placeholder="Select Branch"
            disabled={isRunning}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Enabled</span>
            <Switch
              id={`service-${id}`}
              checked={enabled}
              onCheckedChange={() => toggleEnabled(id)}
              disabled={isRunning}
              aria-disabled={isRunning}
              className={cn(isRunning && "pointer-events-none")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
