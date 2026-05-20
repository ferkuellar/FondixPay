import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'success' | 'danger';
type Size = 'lg' | 'md';

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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'md' && styles.md,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && shadows.button,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.xl,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...typography.button,
    color: '#FFFFFF',
  },
  md: {
    minHeight: 44,
  },
  pressed: {
    opacity: 0.9,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.bg,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  secondaryLabel: {
    color: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
});
