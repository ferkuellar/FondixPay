import { forwardRef } from 'react';
import { StyleSheet, TextInput as RNTextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type Props = TextInputProps & {
  error?: boolean;
};

export const TextInput = forwardRef<RNTextInput, Props>(function TextInput({ error, style, ...props }, ref) {
  return (
    <View style={[styles.wrap, error && styles.wrapError]}>
      <RNTextInput
        ref={ref}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  wrap: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  wrapError: {
    borderColor: colors.danger,
  },
});
