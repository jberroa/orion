import { Heart } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ServiceTabsProps {
  onValueChange: (value: string) => void
}

export const ServiceTabs = ({ onValueChange }: ServiceTabsProps) => (
  <Tabs defaultValue="all" onValueChange={(value) => onValueChange(value)}>
    <TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="favorite">
        <Heart className="mr-2 h-4 w-4" />
        Favorite
      </TabsTrigger>
    </TabsList>
  </Tabs>
) 