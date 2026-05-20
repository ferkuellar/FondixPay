import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';

type Props = {
  value: string;
};

function formatPhone(digits: string) {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
}

export function PhoneInput({ value }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.prefix}>
        <Text style={styles.prefixText}>+52</Text>
      </View>
      <Text style={styles.value}>{formatPhone(value) || ' '}</Text>
      <Feather color={colors.primary} name="phone" size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  prefix: {
    borderRightColor: colors.border,
    borderRightWidth: 1,
    marginRight: spacing.md,
    paddingRight: spacing.md,
  },
  prefixText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
  },
});
