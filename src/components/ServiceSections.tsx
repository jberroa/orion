import { ServiceSection } from "./dashboard/ServiceSection"
import { ServiceGrid } from "./ServiceGrid"
import { Service } from "@/types/service"

interface ServiceSectionsProps {
  showFavorites: boolean
  sections: {
    favorites: Service[]
    enabled: Service[]
    allServices: Service[]
  }
  toggleFavorite: (title: string) => void
  toggleEnabled: (title: string) => void
  onBranchChange: (serviceId: string, branch: string) => void
}

export function ServiceSections({ 
  showFavorites, 
  sections, 
  toggleFavorite, 
  toggleEnabled,
  onBranchChange
}: ServiceSectionsProps) {
  if (showFavorites) {
    // Get enabled services that are not favorites
    const enabledNotFavorites = sections?.enabled?.filter(
      service => !sections.favorites.some(fav => fav.title === service.title)
    );

    if ((sections?.favorites?.length === 0) && (enabledNotFavorites?.length === 0)) {
      return <p className="text-center text-muted-foreground">No favorite or enabled services found</p>
    }

    return (
      <>
        {sections?.favorites?.length > 0 && (
          <ServiceSection
            title="Favorites"
            services={sections.favorites}
            toggleFavorite={toggleFavorite}
            toggleEnabled={toggleEnabled}
          />
        )}
        {enabledNotFavorites?.length > 0 && (
          <ServiceSection
            title="Enabled Services"
            services={enabledNotFavorites}
            toggleFavorite={toggleFavorite}
            toggleEnabled={toggleEnabled}
          />
        )}
      </>
    )
  }

  return sections?.allServices?.length ? (
    <ServiceGrid
      services={sections.allServices}
      onFavoriteToggle={toggleFavorite}
      onEnableToggle={toggleEnabled}
      onBranchChange={onBranchChange}
    />
  ) : (
    <p className="text-center text-muted-foreground">No services found</p>
  );
} 