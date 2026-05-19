import { create } from 'zustand';

import type { Provider, SavedService } from '../types';

const providers: Provider[] = [
  { id: 'cfe', name: 'CFE', category: 'Luz', icon: '⚡' },
  { id: 'telmex', name: 'Telmex', category: 'Internet', icon: '📶' },
  { id: 'telcel', name: 'Telcel', category: 'Telefono', icon: '📱' },
  { id: 'agua', name: 'Agua', category: 'Agua', icon: '💧' },
  { id: 'gas', name: 'Gas', category: 'Gas', icon: '🔥' },
  { id: 'izzi', name: 'Izzi', category: 'Internet / cable', icon: '📺' },
];

type ServiceState = {
  providers: Provider[];
  services: SavedService[];
  addService: (providerId: string, alias: string, reference: string) => SavedService;
  getService: (serviceId: string) => SavedService | undefined;
  markServicePaid: (serviceId: string) => void;
  removeService: (serviceId: string) => void;
};

export const useServiceStore = create<ServiceState>((set, get) => ({
  providers,
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
  addService: (providerId, alias, reference) => {
    const provider = providers.find((item) => item.id === providerId) ?? providers[0];
    const amountDue = 250 + (reference.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1100);
    const service: SavedService = {
      id: `${Date.now()}`,
      provider,
      alias: alias.trim() || provider.category,
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
        service.id === serviceId ? { ...service, amountDue: 0, dueText: 'pagado' } : service,
      ),
    }));
  },
  removeService: (serviceId) => {
    set((state) => ({ services: state.services.filter((service) => service.id !== serviceId) }));
  },
}));
