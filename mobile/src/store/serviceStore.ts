import { create } from 'zustand';

import type { Provider, SavedService } from '../types';

const providers: Provider[] = [
  {
    id: '1',
    name: 'cfe',
    displayName: 'CFE',
    category: 'ELECTRICITY',
    iconKey: 'electricity',
    integrationType: 'MOCK',
    isActive: true,
    sortOrder: 1,
    icon: '⚡',
  },
  {
    id: '2',
    name: 'telmex',
    displayName: 'Telmex',
    category: 'INTERNET',
    iconKey: 'internet',
    integrationType: 'MOCK',
    isActive: true,
    sortOrder: 2,
    icon: '📶',
  },
];

type ServiceState = {
  services: SavedService[];
  addService: (provider: Provider, alias: string, reference: string) => SavedService;
  getService: (serviceId: string) => SavedService | undefined;
  markServicePaid: (serviceId: string) => void;
  removeService: (serviceId: string) => void;
};

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [
    {
      id: 'demo-cfe',
      provider: providers[0],
      alias: 'Luz de casa',
      reference: '12345678901',
      amountDue: 1200,
      dueText: 'vence en 3 dias',
    },
    {
      id: 'demo-internet',
      provider: providers[1],
      alias: 'Internet',
      reference: '99887766',
      amountDue: 800,
      dueText: 'vence manana',
    },
  ],
  addService: (provider, alias, reference) => {
    const amountDue = 250 + (reference.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1100);
    const service: SavedService = {
      id: `${Date.now()}`,
      provider,
      alias: alias.trim() || provider.displayName,
      reference,
      amountDue,
      dueText: 'vence en 3 dias',
    };
    set((state) => ({ services: [service, ...state.services] }));
    return service;
  },
  getService: (serviceId) => get().services.find((service) => service.id === serviceId),
  markServicePaid: (serviceId) => {
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId ? { ...service, amountDue: 0, dueText: 'demo listo' } : service,
      ),
    }));
  },
  removeService: (serviceId) => {
    set((state) => ({ services: state.services.filter((service) => service.id !== serviceId) }));
  },
}));
