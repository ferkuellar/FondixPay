import { create } from 'zustand';

import { getServiceCatalog, getServiceCategories } from '../services/serviceCatalogApi';
import type { ServiceCatalogItem, ServiceCategory } from '../types';

const DEMO_SERVICES: ServiceCatalogItem[] = [
  {
    id: 'demo-catalog-cfe',
    displayName: 'CFE · Luz Casa',
    slug: 'demo-cfe-luz-casa',
    category: 'electricity',
    iconKey: 'electricity',
    description: 'Servicio demo para validar pagos mock sin proveedor real.',
    isNational: true,
    coverageStatus: 'available',
    visibleOnMobile: true,
    payableInMobile: true,
    referenceOnly: true,
    disclaimer: 'Servicio demo. No representa disponibilidad productiva ni confirmacion de Prontipagos.',
  },
  {
    id: 'demo-catalog-agua',
    displayName: 'Agua · Servicio demo',
    slug: 'demo-agua',
    category: 'water',
    iconKey: 'water',
    description: 'Servicio demo para validar captura y pago mock.',
    isNational: false,
    coverageStatus: 'available',
    visibleOnMobile: true,
    payableInMobile: true,
    referenceOnly: true,
    disclaimer: 'Servicio demo. No representa disponibilidad productiva ni confirmacion de Prontipagos.',
  },
  {
    id: 'demo-catalog-internet',
    displayName: 'Internet · Servicio demo',
    slug: 'demo-internet',
    category: 'internet',
    iconKey: 'internet',
    description: 'Servicio demo para validar pagos mock con tarjeta demo.',
    isNational: true,
    coverageStatus: 'available',
    visibleOnMobile: true,
    payableInMobile: true,
    referenceOnly: true,
    disclaimer: 'Servicio demo. No representa disponibilidad productiva ni confirmacion de Prontipagos.',
  },
  {
    id: 'demo-catalog-gas',
    displayName: 'Gas · Servicio demo',
    slug: 'demo-gas',
    category: 'gas',
    iconKey: 'gas',
    description: 'Servicio demo para validar UI y recibos mock.',
    isNational: false,
    coverageStatus: 'available',
    visibleOnMobile: true,
    payableInMobile: true,
    referenceOnly: true,
    disclaimer: 'Servicio demo. No representa disponibilidad productiva ni confirmacion de Prontipagos.',
  },
  {
    id: 'demo-catalog-recarga',
    displayName: 'Recarga celular · Demo',
    slug: 'demo-recarga-celular',
    category: 'mobile_topup_or_bill',
    iconKey: 'phone',
    description: 'Servicio demo para validar flujo de pago mock.',
    isNational: true,
    coverageStatus: 'available',
    visibleOnMobile: true,
    payableInMobile: true,
    referenceOnly: true,
    disclaimer: 'Servicio demo. No representa disponibilidad productiva ni confirmacion de Prontipagos.',
  },
];

type ServiceCatalogState = {
  categories: ServiceCategory[];
  error?: string;
  isUsingDemoFallback: boolean;
  isLoading: boolean;
  selectedState?: string;
  services: ServiceCatalogItem[];
  clear: () => void;
  fetchCategories: () => Promise<void>;
  fetchServices: (filters?: { stateCode?: string; category?: string }) => Promise<void>;
};

export const useServiceCatalogStore = create<ServiceCatalogState>((set) => ({
  categories: [],
  isUsingDemoFallback: false,
  isLoading: false,
  services: [],
  clear: () => set({ error: undefined, isUsingDemoFallback: false, services: [], selectedState: undefined }),
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
      if (services.length === 0) {
        set({ isUsingDemoFallback: true, services: DEMO_SERVICES });
        return;
      }
      set({ isUsingDemoFallback: false, services });
    } catch {
      set({
        error: 'Mostramos servicios demo porque no pudimos cargar el catalogo.',
        isUsingDemoFallback: true,
        services: DEMO_SERVICES,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
