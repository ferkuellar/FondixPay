import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { dayTheme, nightTheme, type AppTheme, type ThemeMode } from './tokens';

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

  const value = useMemo<ThemeContextValue>(() => {
    const theme = mode === 'night' ? nightTheme : dayTheme;
    return {
      theme,
      mode,
      setMode,
      toggleMode: () => setMode((current) => (current === 'day' ? 'night' : 'day')),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: dayTheme, mode: 'day' as ThemeMode, setMode: () => undefined, toggleMode: () => undefined };
  }
  return context;
}
