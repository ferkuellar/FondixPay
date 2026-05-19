import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

type SessionState = {
  phone?: string;
  token?: string;
  setSession: (phone: string, token: string) => Promise<void>;
  clearSession: () => Promise<void>;
};

const TOKEN_KEY = 'fondix_pay_token';

export const useSessionStore = create<SessionState>((set) => ({
  setSession: async (phone, token) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ phone, token });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ phone: undefined, token: undefined });
  },
}));

