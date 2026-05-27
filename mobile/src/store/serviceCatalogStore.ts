import { create } from 'zustand';

import { getServiceCatalog, getServiceCategories } from '../services/serviceCatalogApi';
import type { ServiceCatalogItem, ServiceCategory } from '../types';

type ServiceCatalogState = {
  categories: ServiceCategory[];
  error?: string;
  isLoading: boolean;
  selectedState?: string;
  services: ServiceCatalogItem[];
  clear: () => void;
  fetchCategories: () => Promise<void>;
  fetchServices: (filters?: { stateCode?: string; category?: string }) => Promise<void>;
};

export const useServiceCatalogStore = create<ServiceCatalogState>((set) => ({
  categories: [],
  isLoading: false,
  services: [],
  clear: () => set({ error: undefined, services: [], selectedState: undefined }),
  fetchCategories: async () => {
    try {
      const categories = await getServiceCategories();
      set({ categories });
    } catch {
      set({ error: 'No pudimos cargar las categorias.' });
    }
  },
  fetchServices: async (filters = {}) => {
    set({ error: undefined, isLoading: true, selectedState: filters.stateCode });
    try {
      const services = await getServiceCatalog(filters);
      set({ services });
    } catch {
      set({ error: 'No pudimos cargar los servicios disponibles. Intenta de nuevo.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

