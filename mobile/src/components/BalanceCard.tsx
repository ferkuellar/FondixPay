import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { Balance } from '../types';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { formatMoneyMinor } from '../utils/money';

type Props = {
  balance?: Balance;
  error?: string;
  loading?: boolean;
};

export function BalanceCard({ balance, error, loading }: Props) {
  return (
    <View style={[styles.card, shadows.card]}>
      <Text style={styles.eyebrow}>Saldo demo</Text>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      {!loading && error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && balance ? (
        <>
          <Text style={styles.amount}>{formatMoneyMinor(balance.availableMinor, balance.currency)}</Text>
          <Text style={styles.disclaimer}>{balance.disclaimer}</Text>
          <View style={styles.breakdown}>
            <BalanceLine label="Pendiente" value={formatMoneyMinor(balance.pendingMinor, balance.currency)} />
            <BalanceLine label="Retenido" value={formatMoneyMinor(balance.heldMinor, balance.currency)} />
          </View>
        </>
      ) : null}
      {!loading && !error && !balance ? <Text style={styles.disclaimer}>Cargando cuenta demo...</Text> : null}
    </View>
  );
}

function BalanceLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.title,
    color: colors.textPrimary,
    fontSize: 28,
  },
  breakdown: {
    gap: spacing.xs,
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  disclaimer: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  lineValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
