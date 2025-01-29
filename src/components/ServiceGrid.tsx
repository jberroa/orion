import { Service } from '@/types/service'
import { ServiceCard } from '@/components/ServiceCard'
import { useServices } from '@/hooks/useServices'
import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface ServiceGridProps {
  services: Service[]
  skipTests: boolean
  forceUpdate: boolean
  onSkipTestsChange: (checked: boolean) => void
  onForceUpdateChange: (checked: boolean) => void
  hideControls?: boolean
}

export function ServiceGrid({
  services,
  skipTests,
  forceUpdate,
  onSkipTestsChange,
  onForceUpdateChange,
  hideControls = false
}: ServiceGridProps) {
  const { toggleServiceEnabled, toggleServiceFavorite, updateServiceBranch } = useServices();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter services based on tomcatNumber > 0 or Novo, then filter by search term
  const filteredServices = services
    .filter((service) => service.tomcatNumber > 0 || service.name === "Novo")
    .filter((service) => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full">
      {!hideControls && (
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
              onCheckedChange={onSkipTestsChange}
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
              onCheckedChange={onForceUpdateChange}
            />
            <label
              htmlFor="force-update"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Force Update Dependencies
            </label>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              description={service.description}
              enabled={service.enabled}
              favorite={service.favorite}
              parentRepo={service.parentRepo}
              gitUrl={service.gitUrl}
              branch={service.branch}
              tomcatNumber={service.tomcatNumber}
              javaVersion={service.javaVersion.toString()}
              onBranchChange={(branch) => updateServiceBranch(service.id, branch)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 