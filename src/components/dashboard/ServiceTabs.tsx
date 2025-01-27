import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useServices } from "@/contexts/ServicesContext"

export function ServiceTabs() {
  const { 
    showFavorites, 
    setShowFavorites,
    skipTests,
    forceUpdate
  } = useServices();

  const handleValueChange = (value: string) => {
    setShowFavorites(value === "favorite");
  };

  return (
    <Tabs value={showFavorites ? "favorite" : "all"} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value="all">All Services</TabsTrigger>
        <TabsTrigger value="favorite">Favorites</TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 