import { ServiceGrid } from '@/components/ServiceGrid'
import { useServices } from '@/contexts/ServicesContext'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from 'react'

export function ServiceSections() {
  const {
    showFavorites,
    sections,
    toggleFavorite,
    toggleEnabled,
    skipTests,
    forceUpdate,
    setSkipTests,
    setForceUpdate
  } = useServices();

  const [searchTerm, setSearchTerm] = useState('');

  const filterServices = (services: any[]) => {
    return services.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (showFavorites) {
    // For Favorites view, show two sections
    const favoriteServices = filterServices(sections.all.filter(service => service.favorite));
    const enabledNotFavorite = filterServices(sections.all.filter(service => service.enabled && !service.favorite));

    return (
      <div className="space-y-8">
        <div className="mb-4 flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="skip-tests"
              checked={skipTests}
              onCheckedChange={setSkipTests}
            />
            <label
              htmlFor="skip-tests"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Skip Tests
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="force-update"
              checked={forceUpdate}
              onCheckedChange={setForceUpdate}
            />
            <label
              htmlFor="force-update"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Force Update Dependencies
            </label>
          </div>
        </div>

        {favoriteServices.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Favorite Services</h2>
            <ServiceGrid
              services={favoriteServices}
              skipTests={skipTests}
              forceUpdate={forceUpdate}
              onSkipTestsChange={setSkipTests}
              onForceUpdateChange={setForceUpdate}
              hideControls
            />
          </div>
        )}
        
        {enabledNotFavorite.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Enabled Services</h2>
            <ServiceGrid
              services={enabledNotFavorite}
              skipTests={skipTests}
              forceUpdate={forceUpdate}
              onSkipTestsChange={setSkipTests}
              onForceUpdateChange={setForceUpdate}
              hideControls
            />
          </div>
        )}
      </div>
    );
  }

  // For All view, show all services with search
  const filteredServices = filterServices(sections.all);
  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="skip-tests"
            checked={skipTests}
            onCheckedChange={setSkipTests}
          />
          <label
            htmlFor="skip-tests"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Skip Tests
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="force-update"
            checked={forceUpdate}
            onCheckedChange={setForceUpdate}
          />
          <label
            htmlFor="force-update"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Force Update Dependencies
          </label>
        </div>
      </div>
      <ServiceGrid
        services={filteredServices}
        skipTests={skipTests}
        forceUpdate={forceUpdate}
        onSkipTestsChange={setSkipTests}
        onForceUpdateChange={setForceUpdate}
        hideControls
      />
    </div>
  );
} 