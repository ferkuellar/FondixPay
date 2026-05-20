import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};

export function SecondaryButton({ children, onPress, disabled }: Props) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={styles.button}>
      <Text style={[styles.label, disabled && styles.disabled]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...typography.body,
    color: colors.primary,
    fontWeight: typography.button.fontWeight,
  },
});
