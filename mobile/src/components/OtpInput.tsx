import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { radius, spacing, typography, useAppTheme } from '../theme';

const LENGTH = 6;

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export function OtpInput({ value, onChange, error }: Props) {
  const { theme } = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(LENGTH, ' ').slice(0, LENGTH).split('');
  const activeIndex = Math.min(value.length, LENGTH - 1);

  function handleChange(text: string) {
    const clean = text.replace(/\D/g, '').slice(0, LENGTH);
    onChange(clean);
  }

  return (
    <Pressable accessibilityRole="none" onPress={() => inputRef.current?.focus()} style={styles.row}>
      <TextInput
        ref={inputRef}
        autoFocus
        keyboardType="number-pad"
        maxLength={LENGTH}
        onChangeText={handleChange}
        style={styles.hidden}
        textContentType="oneTimeCode"
        value={value}
      />
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.box,
            { backgroundColor: theme.surface, borderColor: theme.border },
            index === activeIndex && { borderColor: theme.primary },
            error && { borderColor: theme.error },
          ]}
        >
          <Text style={[styles.digit, { color: theme.fg }]}>{digit.trim()}</Text>
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    flex: 1,
    justifyContent: 'center',
    maxWidth: 48,
    minHeight: 56,
  },
  digit: {
    ...typography.amountSmall,
  },
  hidden: {
    height: 0,
    opacity: 0,
    position: 'absolute',
    width: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
