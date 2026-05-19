import { create } from 'zustand';

import type { Payment, Provider, SavedService } from '../types';

const providers: Provider[] = [
  { id: '1', name: 'CFE', category: 'Luz' },
  { id: '2', name: 'Telmex', category: 'Internet' },
  { id: '3', name: 'Telcel', category: 'Telefono' },
  { id: '4', name: 'Agua', category: 'Agua' },
  { id: '5', name: 'Gas', category: 'Gas' },
  { id: '6', name: 'Izzi', category: 'Internet / cable' },
];

type AppState = {
  providers: Provider[];
  services: SavedService[];
  payments: Payment[];
  addService: (providerId: string, alias: string, reference: string) => SavedService;
  getService: (serviceId: string) => SavedService | undefined;
  payService: (serviceId: string) => Payment;
};

export const useAppStore = create<AppState>((set, get) => ({
  providers,
  services: [
    {
      id: 'demo-cfe',
      provider: providers[0],
      alias: 'Luz de casa',
      reference: '12345678901',
      amountDue: 428,
      dueText: 'vence manana',
    },
  ],
  payments: [],
  addService: (providerId, alias, reference) => {
    const provider = providers.find((item) => item.id === providerId) ?? providers[0];
    const amountDue = 150 + (reference.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 850);
    const service: SavedService = {
      id: `${Date.now()}`,
      provider,
      alias,
      reference,
      amountDue,
      dueText: 'vence manana',
    };
    set((state) => ({ services: [service, ...state.services] }));
    return service;
  },
  getService: (serviceId) => get().services.find((service) => service.id === serviceId),
  payService: (serviceId) => {
    const service = get().getService(serviceId);
    if (!service) {
      throw new Error('Servicio no encontrado');
    }
    const payment: Payment = {
      id: `${Date.now()}`,
      serviceName: service.alias,
      amount: service.amountDue,
      status: 'SUCCESS',
      paidAt: new Date().toISOString(),
      folio: `FP-${Date.now()}`,
    };
    set((state) => ({
      services: state.services.map((item) => (item.id === serviceId ? { ...item, amountDue: 0, dueText: 'pagado' } : item)),
      payments: [payment, ...state.payments],
    }));
    return payment;
  },
}));

