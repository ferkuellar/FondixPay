import { forwardRef } from 'react';
import { StyleSheet, TextInput as RNTextInput, View, type TextInputProps } from 'react-native';

import { radius, spacing, typography, useAppTheme } from '../theme';

type Props = TextInputProps & {
  error?: boolean;
};

export const TextInput = forwardRef<RNTextInput, Props>(function TextInput({ error, style, ...props }, ref) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surface, borderColor: error ? theme.error : theme.border },
      ]}
    >
      <RNTextInput
        ref={ref}
        placeholderTextColor={theme.fg3}
        style={[styles.input, { color: theme.fg }, style]}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
});
