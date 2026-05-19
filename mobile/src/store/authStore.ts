import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { getMe, logout, requestOtp, verifyOtp, type AuthUser } from '../services/authApi';

type AuthState = {
  error?: string;
  isLoading: boolean;
  isRestoring: boolean;
  otpDev?: string;
  token?: string;
  user?: AuthUser;
  clearError: () => void;
  requestLoginCode: (phone: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  signInWithOtp: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const TOKEN_KEY = 'fondix_pay_token';

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: false,
  isRestoring: true,
  clearError: () => set({ error: undefined }),
  requestLoginCode: async (phone) => {
    set({ error: undefined, isLoading: true, otpDev: undefined });
    try {
      const response = await requestOtp(phone);
      set({ otpDev: response.otp_dev });
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  restoreSession: async () => {
    set({ isRestoring: true });
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        set({ isRestoring: false, token: undefined, user: undefined });
        return;
      }
      const user = await getMe(token);
      set({ isRestoring: false, token, user });
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
      set({ isRestoring: false, token: undefined, user: undefined });
    }
  },
  signInWithOtp: async (phone, otp) => {
    set({ error: undefined, isLoading: true });
    try {
      const response = await verifyOtp(phone, otp);
      await SecureStore.setItemAsync(TOKEN_KEY, response.access_token);
      set({ otpDev: undefined, token: response.access_token, user: response.user });
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    const token = get().token;
    set({ isLoading: true });
    try {
      await logout(token).catch(() => undefined);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } finally {
      set({ error: undefined, isLoading: false, otpDev: undefined, token: undefined, user: undefined });
    }
  },
}));

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos completar esto. Intenta otra vez.';
}
