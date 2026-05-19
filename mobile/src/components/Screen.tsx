import type { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';

type Props = {
  children: ReactNode;
};

export function Screen({ children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

