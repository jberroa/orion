import { Service } from '@/types/service'
import { ServiceCard } from '@/components/ServiceCard'

interface ServiceGridProps {
  services: Service[]
  onFavoriteToggle: (serviceId: string) => void
  onEnableToggle: (serviceId: string) => void
}

export const ServiceGrid = ({ 
  services, 
  onFavoriteToggle, 
  onEnableToggle 
}: ServiceGridProps) => (
  <div className="w-full overflow-x-auto">
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
      {services.map((service) => (
        <ServiceCard
          key={service.serviceId}
          {...service}
          onFavoriteToggle={() => onFavoriteToggle(service.serviceId)}
          onEnableToggle={() => onEnableToggle(service.serviceId)}
        />
      ))}
    </div>
  </div>
) 