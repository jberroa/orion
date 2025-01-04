import { useContext } from 'react';
import { ServicesContext } from '@/contexts/ServicesContext';

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return {
    toggleServiceEnabled: context.toggleServiceEnabled,
    toggleServiceFavorite: context.toggleServiceFavorite,
    updateServiceBranch: context.updateServiceBranch,
    services: context.services
  };
}; 