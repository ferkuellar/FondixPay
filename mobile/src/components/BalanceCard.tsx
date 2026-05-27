import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { Balance } from '../types';
import { radius, shadows, spacing, typography, useAppTheme } from '../theme';
import { formatMoneyMinor } from '../utils/money';

type Props = {
  balance?: Balance;
  error?: string;
  loading?: boolean;
};

export function BalanceCard({ balance, error, loading }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, shadows.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.eyebrow, { color: theme.primary }]}>Saldo demo</Text>
      {loading ? <ActivityIndicator color={theme.primary} /> : null}
      {!loading && error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}
      {!loading && !error && balance ? (
        <>
          <Text style={[styles.amount, { color: theme.fg }]}>{formatMoneyMinor(balance.availableMinor, balance.currency)}</Text>
          <Text style={[styles.disclaimer, { color: theme.fg2 }]}>{balance.disclaimer}</Text>
          <View style={styles.breakdown}>
            <BalanceLine label="Pendiente" value={formatMoneyMinor(balance.pendingMinor, balance.currency)} />
            <BalanceLine label="Retenido" value={formatMoneyMinor(balance.heldMinor, balance.currency)} />
          </View>
        </>
      ) : null}
      {!loading && !error && !balance ? <Text style={[styles.disclaimer, { color: theme.fg2 }]}>Cargando cuenta demo...</Text> : null}
    </View>
  );
}

function BalanceLine({ label, value }: { label: string; value: string }) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.line}>
      <Text style={[styles.lineLabel, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[styles.lineValue, { color: theme.fg }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.title,
    ...typography.amountSmall,
  },
  breakdown: {
    gap: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  disclaimer: {
    ...typography.bodySmall,
  },
  error: {
    ...typography.bodySmall,
  },
  eyebrow: {
    ...typography.caption,
    fontWeight: '700',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineLabel: {
    ...typography.bodySmall,
  },
  lineValue: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
});
