import { Heart } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface ServiceTabsProps {
  value: "favorite" | "all";
  onValueChange: (value: "favorite" | "all") => void;
}

export function ServiceTabs({ value, onValueChange }: ServiceTabsProps) {
  return (
    <Tabs 
      value={value}
      onValueChange={(value) => onValueChange(value as "favorite" | "all")}
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="favorite">
          <Heart className="mr-2 h-4 w-4" />
          Favorite
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 