import { Service } from '@/types/service'
import { ServiceCard } from '@/components/ServiceCard'
import { useServices } from '@/hooks/useServices'

interface ServiceGridProps {
  services: Service[]
}

export const ServiceGrid = ({ services }: ServiceGridProps) => {
  const { toggleServiceEnabled, toggleServiceFavorite, updateServiceBranch } = useServices();

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            serviceId={service.id}
            onFavoriteToggle={() => toggleServiceFavorite(service.id)}
            onEnableToggle={() => toggleServiceEnabled(service.id)}
            onBranchChange={(branch) => updateServiceBranch(service.id, branch)}
          />
        ))}
      </div>
    </div>
  );
} 