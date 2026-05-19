import { create } from 'zustand';

import { listServiceProviders } from '../services/serviceProvidersApi';
import type { Provider } from '../types';

type ServiceProviderState = {
  error?: string;
  isLoading: boolean;
  providers: Provider[];
  fetchProviders: () => Promise<void>;
  getProvider: (providerId: string) => Provider | undefined;
};

export const useServiceProviderStore = create<ServiceProviderState>((set, get) => ({
  isLoading: false,
  providers: [],
  fetchProviders: async () => {
    set({ error: undefined, isLoading: true });
    try {
      const providers = await listServiceProviders();
      set({ providers });
    } catch {
      set({ error: 'No pudimos cargar los servicios. Intenta de nuevo.' });
    } finally {
      set({ isLoading: false });
    }
  },
  getProvider: (providerId) => get().providers.find((provider) => provider.id === providerId),
}));
