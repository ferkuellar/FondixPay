import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { getMe, logout, requestOtp, verifyOtp, type AuthUser } from '../services/authApi';

type AuthState = {
  error?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoring: boolean;
  otpDev?: string;
  showAccountWelcome: boolean;
  token?: string;
  user?: AuthUser;
  clearError: () => void;
  dismissAccountWelcome: () => void;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  requestLoginCode: (phone: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  signInWithOtp: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const TOKEN_KEY = 'fondix_pay_token';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  isRestoring: true,
  showAccountWelcome: false,
  clearError: () => set({ error: undefined }),
  dismissAccountWelcome: () => set({ showAccountWelcome: false }),
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
        set({ isAuthenticated: false, isRestoring: false, token: undefined, user: undefined });
        return;
      }
      const user = await getMe(token);
      set({ isAuthenticated: true, isRestoring: false, token, user });
    } catch {
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
      set({ isAuthenticated: false, isRestoring: false, token: undefined, user: undefined });
    }
  },
  signInWithOtp: async (phone, otp) => {
    set({ error: undefined, isLoading: true });
    try {
      const response = await verifyOtp(phone, otp);
      await SecureStore.setItemAsync(TOKEN_KEY, response.access_token);
      set({
        isAuthenticated: true,
        otpDev: undefined,
        showAccountWelcome: true,
        token: response.access_token,
        user: response.user,
      });
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
      set({ error: undefined, isAuthenticated: false, isLoading: false, otpDev: undefined, token: undefined, user: undefined });
    }
  },
  login: async (phone, otp) => get().signInWithOtp(phone, otp),
  logout: async () => get().signOut(),
}));

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos completar esto. Intenta otra vez.';
}
