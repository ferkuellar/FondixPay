import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppThemeProvider, useAppTheme } from './src/theme';
import type { RootStackParamList } from './src/types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fondixpay://'],
  config: {
    screens: {
      ProviderCallback: 'provider/callback',
    },
  },
};

function AppShell() {
  const { mode } = useAppTheme();

  return (
    <NavigationContainer linking={linking}>
      <StatusBar style={mode === 'night' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppThemeProvider>
        <AppShell />
      </AppThemeProvider>
    </AppErrorBoundary>
  );
}
