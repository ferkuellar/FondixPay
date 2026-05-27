import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { radius, spacing, typography, useAppTheme } from '../theme';

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
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.borderHi }]}>
      <View style={[styles.prefix, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
        <Text style={[styles.country, { color: theme.fg2 }]}>MX</Text>
        <Text style={[styles.prefixText, { color: theme.fg }]}>+52</Text>
      </View>
      <Text style={[styles.value, { color: theme.fg }]}>{formatPhone(value) || '55 1234 5678'}</Text>
      <Feather color={theme.primary} name="phone" size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  prefix: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginRight: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  country: {
    ...typography.micro,
  },
  prefixText: {
    ...typography.mono,
    fontWeight: '600',
  },
  value: {
    ...typography.amountSmall,
    flex: 1,
  },
});
