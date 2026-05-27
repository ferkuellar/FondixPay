import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography, useAppTheme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
type Size = 'lg' | 'md' | 'sm';

type Props = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
};

export function PrimaryButton({
  children,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  size = 'lg',
}: Props) {
  const isDisabled = disabled || loading;
  const { theme } = useAppTheme();
  const isPrimary = variant === 'primary' || variant === 'success';
  const buttonColor = variant === 'danger' ? theme.error : variant === 'success' ? theme.success : theme.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'md' && styles.md,
        size === 'sm' && styles.sm,
        variant === 'secondary' && { backgroundColor: theme.surface, borderColor: theme.borderHi, borderWidth: 1.5 },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        variant === 'danger' && { backgroundColor: buttonColor },
        isPrimary && { backgroundColor: buttonColor },
        pressed && !isDisabled && styles.pressed,
        isDisabled && { backgroundColor: theme.disabledBg, opacity: 1 },
        isPrimary && !isDisabled && shadows.button,
      ]}
    >
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={variant === 'secondary' ? theme.primary : '#FFFFFF'} />
          <Text style={[styles.label, variant === 'secondary' && { color: theme.primary }]}>Procesando...</Text>
        </View>
      ) : (
        <Text
          style={[
            styles.label,
            (variant === 'secondary' || variant === 'ghost') && { color: theme.primary },
            isDisabled && { color: theme.disabledFg },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.lg,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.xl,
  },
  label: {
    ...typography.button,
    color: '#FFFFFF',
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  md: {
    minHeight: 48,
  },
  pressed: {
    opacity: 0.9,
  },
  sm: {
    borderRadius: radius.md,
    minHeight: 40,
    paddingHorizontal: spacing.lg,
  },
});
