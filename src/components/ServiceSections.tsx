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
  toggleFavorite: (serviceId: string) => void
  toggleEnabled: (serviceId: string) => void
}

export function ServiceSections({ 
  showFavorites, 
  sections, 
  toggleFavorite, 
  toggleEnabled 
}: ServiceSectionsProps) {
  if (showFavorites) {
    if (sections.favorites.length === 0 && sections.enabled.length === 0) {
      return <p className="text-center text-muted-foreground">No favorite or enabled services found</p>
    }

    return (
      <>
        {sections.favorites.length > 0 && (
          <ServiceSection
            title="Favorites"
            services={sections.favorites}
            onFavoriteToggle={toggleFavorite}
            onEnableToggle={toggleEnabled}
          />
        )}
        {sections.enabled.length > 0 && (
          <ServiceSection
            title="Enabled Services"
            services={sections.enabled}
            onFavoriteToggle={toggleFavorite}
            onEnableToggle={toggleEnabled}
          />
        )}
      </>
    )
  }

  if (sections.allServices.length === 0) {
    return <p className="text-center text-muted-foreground">No services found</p>
  }

  return (
    <ServiceGrid
      services={sections.allServices}
      onFavoriteToggle={toggleFavorite}
      onEnableToggle={toggleEnabled}
    />
  )
} 