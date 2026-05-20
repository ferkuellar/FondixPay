import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { PaymentRecoveryContext } from '../types';
import { formatMoneyMinor } from '../utils/money';

type Props = {
  recovery: PaymentRecoveryContext;
};

export function PaymentRecoverySummary({ recovery }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.provider}>{recovery.providerName}</Text>
      <Text style={styles.service}>{recovery.serviceName}</Text>
      <View style={styles.line}>
        <Text style={styles.label}>Monto del servicio</Text>
        <Text style={styles.value}>{formatMoneyMinor(recovery.amountMinor)}</Text>
      </View>
      <View style={styles.line}>
        <Text style={styles.label}>Comisión FondixPay</Text>
        <Text style={styles.value}>{formatMoneyMinor(recovery.feeMinor)}</Text>
      </View>
      <View style={styles.totalLine}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatMoneyMinor(recovery.totalMinor)}</Text>
      </View>
      <View style={styles.detailLine}>
        <Text style={styles.label}>Método usado</Text>
        <Text style={styles.value}>{recovery.methodLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  detailLine: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  provider: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  service: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  totalLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  totalLine: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  totalValue: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
