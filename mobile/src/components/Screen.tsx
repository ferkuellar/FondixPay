import type { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';

import { spacing, useAppTheme } from '../theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
};

export function Screen({ children, style, padded = true }: Props) {
  const { theme, mode } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar style={mode === 'night' ? 'light' : 'dark'} />
      <View style={[styles.content, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  safe: {
    flex: 1,
  },
});
