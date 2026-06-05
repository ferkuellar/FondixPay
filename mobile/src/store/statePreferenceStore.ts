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
  preference: SelectedStatePreference;
  selectedState: MexicoStateOption;
  restoreSelectedState: () => Promise<void>;
  setSelectedState: (code: MexicoStateCode, source?: StateSelectionSource) => Promise<void>;
};

const SELECTED_STATE_KEY = 'fondix_pay_selected_state';
const SELECTED_STATE_PREFERENCE_KEY = 'fondix_pay_selected_state_preference';

export type StateSelectionSource = 'manual' | 'gps' | 'unknown';

export type SelectedStatePreference = {
  code: MexicoStateCode | null;
  name: string | null;
  source: StateSelectionSource;
  updatedAt: string | null;
};

const defaultState = getMexicoStateOption(DEFAULT_MEXICO_STATE_CODE);

function buildPreference(state: MexicoStateOption, source: StateSelectionSource): SelectedStatePreference {
  return {
    code: state.code,
    name: state.name,
    source,
    updatedAt: new Date().toISOString(),
  };
}

function parsePreference(rawValue: string | null): SelectedStatePreference | null {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as Partial<SelectedStatePreference>;
    const state = parsed.code ? getMexicoStateOption(parsed.code) : null;
    if (!state) return null;

    return {
      code: state.code,
      name: state.name,
      source: parsed.source === 'gps' || parsed.source === 'manual' ? parsed.source : 'unknown',
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
    };
  } catch {
    return null;
  }
}

export const useStatePreferenceStore = create<StatePreferenceState>((set) => ({
  hasHydrated: false,
  preference: {
    code: defaultState.code,
    name: defaultState.name,
    source: 'unknown',
    updatedAt: null,
  },
  selectedState: defaultState,
  restoreSelectedState: async () => {
    try {
      const storedPreference = parsePreference(await SecureStore.getItemAsync(SELECTED_STATE_PREFERENCE_KEY));
      if (storedPreference?.code) {
        set({
          hasHydrated: true,
          preference: storedPreference,
          selectedState: getMexicoStateOption(storedPreference.code),
        });
        return;
      }

      const storedCode = await SecureStore.getItemAsync(SELECTED_STATE_KEY);
      const selectedState = getMexicoStateOption(storedCode ?? DEFAULT_MEXICO_STATE_CODE);
      set({
        hasHydrated: true,
        preference: {
          code: selectedState.code,
          name: selectedState.name,
          source: storedCode ? 'manual' : 'unknown',
          updatedAt: null,
        },
        selectedState,
      });
    } catch {
      set({
        hasHydrated: true,
        preference: {
          code: defaultState.code,
          name: defaultState.name,
          source: 'unknown',
          updatedAt: null,
        },
        selectedState: defaultState,
      });
    }
  },
  setSelectedState: async (code, source = 'manual') => {
    const selectedState = getMexicoStateOption(code);
    const preference = buildPreference(selectedState, source);
    set({ preference, selectedState });
    await SecureStore.setItemAsync(SELECTED_STATE_KEY, selectedState.code).catch(() => undefined);
    await SecureStore.setItemAsync(SELECTED_STATE_PREFERENCE_KEY, JSON.stringify(preference)).catch(() => undefined);
  },
}));

export { MEXICO_STATE_OPTIONS };
export type { MexicoStateCode, MexicoStateOption };
