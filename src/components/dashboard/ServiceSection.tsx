import { Service } from '@/types/service'
import { ServiceGrid } from '@/components/ServiceGrid'

interface ServiceSectionProps {
  title: string
  services: Service[]
  toggleFavorite: (title: string) => void
  toggleEnabled: (title: string) => void
}

export const ServiceSection = ({ 
  title, 
  services = [],
  toggleFavorite, 
  toggleEnabled 
}: ServiceSectionProps) => (
  <section>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <ServiceGrid 
      services={services}
      onFavoriteToggle={toggleFavorite}
      onEnableToggle={toggleEnabled}
    />
  </section>
) 