import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { dayTheme, nightTheme, type AppTheme, type ThemeMode } from './tokens';

const THEME_MODE_KEY = 'fondixpay_theme_mode';

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const deviceMode = useColorScheme() === 'dark' ? 'night' : 'day';
  const [mode, setMode] = useState<ThemeMode>(deviceMode);

  useEffect(() => {
    SecureStore.getItemAsync(THEME_MODE_KEY)
      .then((storedMode) => {
        if (storedMode === 'day' || storedMode === 'night') {
          setMode(storedMode);
        }
      })
      .catch(() => undefined);
  }, []);

  const persistMode = useCallback((nextMode: ThemeMode) => {
    setMode(nextMode);
    void SecureStore.setItemAsync(THEME_MODE_KEY, nextMode).catch(() => undefined);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const theme = mode === 'night' ? nightTheme : dayTheme;
    return {
      theme,
      mode,
      setMode: persistMode,
      toggleMode: () => persistMode(mode === 'day' ? 'night' : 'day'),
    };
  }, [mode, persistMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: dayTheme, mode: 'day' as ThemeMode, setMode: () => undefined, toggleMode: () => undefined };
  }
  return context;
}
