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
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {services.map((service) => (
      <ServiceCard
        key={service.serviceId}
        {...service}
        onFavoriteToggle={() => onFavoriteToggle(service.serviceId)}
        onEnableToggle={() => onEnableToggle(service.serviceId)}
      />
    ))}
  </div>
) 