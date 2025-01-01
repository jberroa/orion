import { Service } from '@/types/service'
import { ServiceCard } from '@/components/ServiceCard'

interface ServiceGridProps {
  services: Service[]
  onFavoriteToggle: (serviceId: string) => void
  onEnableToggle: (serviceId: string) => void
  onBranchChange: (serviceId: string, branch: string) => void
}

export const ServiceGrid = ({ 
  services, 
  onFavoriteToggle, 
  onEnableToggle,
  onBranchChange 
}: ServiceGridProps) => (
  <div className="w-full overflow-x-auto">
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
      {services.map((service) => (
        <ServiceCard
          key={service.title}
          {...service}
          serviceId={service.title}
          onFavoriteToggle={() => onFavoriteToggle(service.title)}
          onEnableToggle={() => onEnableToggle(service.title)}
          onBranchChange={(branch) => onBranchChange(service.title, branch)}
        />
      ))}
    </div>
  </div>
) 