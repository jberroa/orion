import {
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { BranchSelector } from "./BranchSelector";
import { ServiceSettings } from "./ServiceSettings";

interface ServiceCardProps {
  title: string;
  description: string;
  serviceId: string;
  enabled?: boolean;
  favorite?: boolean;
  onFavoriteToggle: () => void;
  onEnableToggle: () => void;
}

const branches = [
  { value: "main", label: "main" },
  { value: "dev", label: "dev" },
  { value: "staging", label: "staging" },
  { value: "production", label: "production" },
];

export function ServiceCard({
  title,
  description,
  serviceId,
  enabled = false,
  favorite = false,
  onFavoriteToggle,
  onEnableToggle,
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden min-w-[350px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={onFavoriteToggle}
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
          <BranchSelector items={branches} placeholder="Select Branch" />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Enabled</span>
            <Switch
              id={`${serviceId}-enabled`}
              checked={enabled}
              onCheckedChange={onEnableToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
