import { create } from 'zustand';

import { getAccount, getBalance, getMovements } from '../services/accountApi';
import type { Account, Balance, Movement } from '../types';
import { useAuthStore } from './authStore';

type AccountState = {
  account?: Account;
  balance?: Balance;
  movements: Movement[];
  isLoading: boolean;
  error?: string;
  clearAccount: () => void;
  fetchAccount: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  fetchMovements: () => Promise<void>;
  refreshAccountData: () => Promise<void>;
};

export const useAccountStore = create<AccountState>((set, get) => ({
  movements: [],
  isLoading: false,
  clearAccount: () => set({ account: undefined, balance: undefined, movements: [], error: undefined }),
  fetchAccount: async () => {
    const token = requireToken();
    const account = await getAccount(token);
    set({ account });
  },
  fetchBalance: async () => {
    const token = requireToken();
    const balance = await getBalance(token);
    set({ balance });
  },
  fetchMovements: async () => {
    const token = requireToken();
    const movements = await getMovements(token);
    set({ movements });
  },
  refreshAccountData: async () => {
    set({ error: undefined, isLoading: true });
    try {
      await get().fetchAccount();
      await Promise.all([get().fetchBalance(), get().fetchMovements()]);
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },
}));

function requireToken() {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Inicia sesión para ver tu saldo demo.');
  }
  return token;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos cargar tu saldo demo.';
}
