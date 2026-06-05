import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  DEFAULT_MEXICO_STATE_CODE,
  MEXICO_STATE_OPTIONS,
  getMexicoStateOption,
  type MexicoStateCode,
  type MexicoStateOption,
} from '../constants/mexicoStates';

type StatePreferenceState = {
  hasHydrated: boolean;
  selectedState: MexicoStateOption;
  restoreSelectedState: () => Promise<void>;
  setSelectedState: (code: MexicoStateCode) => Promise<void>;
};

const SELECTED_STATE_KEY = 'fondix_pay_selected_state';

export const useStatePreferenceStore = create<StatePreferenceState>((set) => ({
  hasHydrated: false,
  selectedState: getMexicoStateOption(DEFAULT_MEXICO_STATE_CODE),
  restoreSelectedState: async () => {
    try {
      const storedCode = await SecureStore.getItemAsync(SELECTED_STATE_KEY);
      set({ hasHydrated: true, selectedState: getMexicoStateOption(storedCode ?? DEFAULT_MEXICO_STATE_CODE) });
    } catch {
      set({ hasHydrated: true, selectedState: getMexicoStateOption(DEFAULT_MEXICO_STATE_CODE) });
    }
  },
  setSelectedState: async (code) => {
    const selectedState = getMexicoStateOption(code);
    set({ selectedState });
    await SecureStore.setItemAsync(SELECTED_STATE_KEY, selectedState.code).catch(() => undefined);
  },
}));

export { MEXICO_STATE_OPTIONS };
export type { MexicoStateCode, MexicoStateOption };
