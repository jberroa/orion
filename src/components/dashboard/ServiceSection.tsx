import { Service } from '@/types/service'
import { ServiceGrid } from '@/components/ServiceGrid'

interface ServiceSectionProps {
  title: string
  services: Service[]
  onFavoriteToggle: (serviceId: string) => void
  onEnableToggle: (serviceId: string) => void
}

export const ServiceSection = ({ 
  title, 
  services, 
  onFavoriteToggle, 
  onEnableToggle 
}: ServiceSectionProps) => (
  <section>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <ServiceGrid 
      services={services}
      onFavoriteToggle={onFavoriteToggle}
      onEnableToggle={onEnableToggle}
    />
  </section>
) 