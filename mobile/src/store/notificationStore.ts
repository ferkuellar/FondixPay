import { create } from 'zustand';

import { getNotifications, markNotificationRead } from '../services/notificationsApi';
import type { NotificationItem } from '../types';
import { useAuthStore } from './authStore';

type NotificationState = {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  error?: string;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  fetchNotifications: async () => {
    set({ error: undefined, isLoading: true });
    try {
      const notifications = await getNotifications(requireToken());
      set({ notifications, unreadCount: notifications.filter((item) => item.status === 'unread').length });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'No pudimos cargar notificaciones.' });
    } finally {
      set({ isLoading: false });
    }
  },
  markRead: async (id) => {
    const notification = await markNotificationRead(requireToken(), id);
    const notifications = get().notifications.map((item) => (item.id === id ? notification : item));
    set({ notifications, unreadCount: notifications.filter((item) => item.status === 'unread').length });
  },
}));

function requireToken() {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('Inicia sesion para consultar notificaciones.');
  return token;
}
