import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { calculatePaymentBreakdown, formatMoneyMinor } from '../utils/money';
import { AmountDisplay } from './AmountDisplay';
import { ServiceIconBadge } from './ServiceIconBadge';

type Props = {
  providerName: string;
  category: string;
  alias: string;
  reference: string;
  amount: number;
  paymentMethod?: string;
};

export function PaymentSummaryCard({
  providerName,
  category,
  alias,
  reference,
  amount,
  paymentMethod = 'Método demo - pago simulado sin cargo real',
}: Props) {
  const breakdown = calculatePaymentBreakdown(amount);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ServiceIconBadge category={category} size={40} />
        <Text style={styles.provider}>{providerName}</Text>
        <AmountDisplay amount={breakdown.totalMinor / 100} />
      </View>
      <View style={styles.divider} />
      <View style={styles.breakdown}>
        <View style={styles.line}>
          <Text style={styles.label}>Monto del servicio</Text>
          <Text style={styles.value}>{formatMoneyMinor(breakdown.amountMinor)}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.label}>{breakdown.feeLabel}</Text>
          <Text style={styles.value}>{formatMoneyMinor(breakdown.feeMinor)}</Text>
        </View>
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Total final</Text>
          <Text style={styles.totalValue}>{formatMoneyMinor(breakdown.totalMinor)}</Text>
        </View>
        <Text style={styles.trustCopy}>Verás el total antes de confirmar. No hay cargos ocultos.</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>{alias}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Número de servicio</Text>
        <Text style={styles.value}>{reference}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Método de pago</Text>
        <Text style={styles.value}>{paymentMethod}</Text>
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
    overflow: 'hidden',
  },
  breakdown: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    gap: spacing.sm,
    padding: spacing.xl,
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
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  row: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
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
    color: colors.success,
  },
  trustCopy: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
