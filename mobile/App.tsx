import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppThemeProvider, useAppTheme } from './src/theme';

function AppShell() {
  const { mode } = useAppTheme();

  return (
    <NavigationContainer>
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
