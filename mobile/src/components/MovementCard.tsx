import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { Movement } from '../types';
import { formatMoneyMinor } from '../utils/money';

type Props = {
  movement: Movement;
};

export function MovementCard({ movement }: Props) {
  const amountPrefix = movement.direction === 'debit' ? '-' : '+';

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.description}>{movement.description}</Text>
        <Text style={styles.meta}>
          {movement.type.replaceAll('_', ' ')} · {new Date(movement.createdAt).toLocaleDateString('es-MX')}
        </Text>
        <Text style={styles.demo}>Movimiento demo · {movement.status}</Text>
      </View>
      <Text style={[styles.amount, movement.direction === 'debit' && styles.debit]}>
        {amountPrefix}
        {formatMoneyMinor(movement.amountMinor, movement.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.heading,
    color: colors.success,
    flexShrink: 0,
    fontSize: 16,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  debit: {
    color: colors.danger,
  },
  demo: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  description: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
});
