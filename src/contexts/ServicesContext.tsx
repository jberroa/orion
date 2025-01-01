import React, { createContext, useContext, useEffect, useState } from 'react';
import { Service } from '@/types/service';
import { initialServices } from '@/data/services';
import { useServiceActions } from '@/hooks/useServiceActions';

interface ServicesContextType {
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  sections: {
    allServices: Service[];
    favorites: Service[];
    enabled: Service[];
  };
  toggleFavorite: (serviceId: string) => void;
  toggleEnabled: (serviceId: string) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [showFavorites, setShowFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('showFavorites');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error reading showFavorites from localStorage:', error);
      return false;
    }
  });

  const [sections, setSections] = useState({
    allServices: initialServices.map(service => ({
      ...service,
      favorite: false,
      enabled: false
    })),
    favorites: [] as Service[],
    enabled: [] as Service[]
  });

  const { toggleFavorite, toggleEnabled } = useServiceActions({ sections, setSections });

  // Load saved service preferences
  useEffect(() => {
    console.log('Loading saved service preferences...');
    window.electron.invoke("get-settings").then((settings) => {
      console.log('Loaded settings:', settings);
      if (settings.services) {
        const favoritesTitles = settings.services.favorites || [];
        const enabledTitles = settings.services.enabled || [];

        // Update allServices with the correct favorite and enabled states
        const updatedAllServices = initialServices.map(service => ({
          ...service,
          favorite: favoritesTitles.includes(service.title),
          enabled: enabledTitles.includes(service.title)
        }));

        // Create favorites and enabled arrays based on the updated allServices
        const updatedFavorites = updatedAllServices.filter(service => 
          favoritesTitles.includes(service.title)
        );
        const updatedEnabled = updatedAllServices.filter(service => 
          enabledTitles.includes(service.title)
        );

        setSections({
          allServices: updatedAllServices,
          favorites: updatedFavorites,
          enabled: updatedEnabled
        });
      }
    }).catch(error => {
      console.error('Error loading settings:', error);
    });
  }, []);

  // Save service preferences whenever they change
  useEffect(() => {
    const saveServicePreferences = async () => {
      console.log('Saving service preferences...');
      try {
        const settings = await window.electron.invoke("get-settings");
        settings.services = {
          favorites: sections.favorites.map(s => s.title),
          enabled: sections.enabled.map(s => s.title)
        };
        console.log('Saving settings:', settings);
        await window.electron.invoke("save-settings", settings);
        console.log('Settings saved successfully');
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };

    saveServicePreferences();
  }, [sections.favorites, sections.enabled]);

  // Update localStorage whenever showFavorites changes
  useEffect(() => {
    try {
      localStorage.setItem('showFavorites', JSON.stringify(showFavorites));
      console.log('Saved showFavorites state:', showFavorites);
    } catch (error) {
      console.error('Error saving showFavorites to localStorage:', error);
    }
  }, [showFavorites]);

  // Create a memoized setShowFavorites to ensure consistent behavior
  const handleSetShowFavorites = React.useCallback((value: boolean) => {
    console.log('Setting showFavorites to:', value);
    setShowFavorites(value);
  }, []);

  return (
    <ServicesContext.Provider value={{
      showFavorites,
      setShowFavorites: handleSetShowFavorites,
      sections,
      toggleFavorite,
      toggleEnabled
    }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServicesContext() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServicesContext must be used within a ServicesProvider');
  }
  return context;
} 