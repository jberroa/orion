import {
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { BranchSelector } from "./BranchSelector";
import { ServiceSettings } from "./ServiceSettings";
import { useServices } from "@/hooks/useServices";

interface ServiceCardProps {
  name: string;
  description: string;
  serviceId: string;
  enabled?: boolean;
  favorite?: boolean;
  parentRepo?: string;
  gitUrl: string;
  branch: string;
  onBranchChange: (value: string) => void;
  onFavoriteToggle: () => void;
  onEnableToggle: () => void;
}

export function ServiceCard({
  name,
  description,
  serviceId,
  enabled = false,
  favorite = false,
  parentRepo,
  gitUrl,
  branch,
  onBranchChange,
}: ServiceCardProps) {
  const { toggleServiceEnabled, toggleServiceFavorite } = useServices();

  const handleEnableToggle = () => {
    toggleServiceEnabled(serviceId);
  };

  const handleFavoriteToggle = () => {
    toggleServiceFavorite(serviceId);
  };

  return (
    <Card className="overflow-hidden min-w-[350px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          {parentRepo && (
            <Badge variant="secondary" className="w-fit">
              {parentRepo}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={cn("h-4 w-4", favorite && "fill-current text-primary")}
            />
          </Button>

          <ServiceSettings />
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
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Enabled</span>
            <Switch
              id={`service-${serviceId}`}
              checked={enabled}
              onCheckedChange={handleEnableToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
