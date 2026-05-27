import { create } from 'zustand';

import { getNotificationPreferences, updateWhatsappReceiptPreference } from '../services/notificationPreferencesApi';
import type { NotificationPreference } from '../types';
import { useAuthStore } from './authStore';

type NotificationPreferencesState = {
  whatsappReceipt?: NotificationPreference;
  isLoading: boolean;
  error?: string;
  fetchPreferences: () => Promise<void>;
  setWhatsappReceiptEnabled: (enabled: boolean) => Promise<void>;
};

export const useNotificationPreferencesStore = create<NotificationPreferencesState>((set) => ({
  isLoading: false,
  fetchPreferences: async () => {
    set({ error: undefined, isLoading: true });
    try {
      const preferences = await getNotificationPreferences(requireToken());
      set({ whatsappReceipt: preferences.find((item) => item.channel === 'whatsapp'), isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'No pudimos cargar tus preferencias.', isLoading: false });
    }
  },
  setWhatsappReceiptEnabled: async (enabled) => {
    set({ error: undefined, isLoading: true });
    try {
      const preference = await updateWhatsappReceiptPreference(requireToken(), enabled);
      set({ whatsappReceipt: preference, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'No pudimos actualizar esta preferencia.', isLoading: false });
    }
  },
}));

function requireToken() {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Inicia sesion para configurar notificaciones.');
  return token;
}
