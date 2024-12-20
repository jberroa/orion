import { ServiceTabs } from "@/components/dashboard/ServiceTabs";
import { ServiceSection } from "@/components/dashboard/ServiceSection";
import { SearchBox } from "@/components/SearchBox";
import { useServices } from "@/hooks/useServices";
import { initialServices } from "@/data/services";
import { ServiceGrid } from "@/components/ServiceGrid";
import { TomcatStatus } from "@/components/TomcatStatus";

export function Dashboard() {
  const {
    showFavorites,
    searchQuery,
    setShowFavorites,
    setSearchQuery,
    sections,
    toggleFavorite,
    toggleEnabled,
  } = useServices(initialServices);

  return (
    <div className="relative min-h-screen pb-5">
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-5">
          <ServiceTabs
            onValueChange={(value) => setShowFavorites(value === "favorite")}
          />
          <SearchBox value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="space-y-8">
          {showFavorites ? (
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
          ) : (
            <ServiceGrid
              services={sections.allServices}
              onFavoriteToggle={toggleFavorite}
              onEnableToggle={toggleEnabled}
            />
          )}
        </div>
      </div>

      <footer className="absolute bottom-0 w-full border-t bg-background">
        <div className="container mx-auto p-4 flex items-center justify-center">
          <div className="flex space-x-4">
            <TomcatStatus id={1} status="running" />
            <TomcatStatus id={2} status="running" />
            <TomcatStatus id={3} status="stopped" />
            <TomcatStatus id={4} status="error" />
            <TomcatStatus id={5} status="running" />
          </div>
        </div>
      </footer>
    </div>
  );
}
