import { StyleSheet, Text, View } from 'react-native';

import type { Payment } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { formatMoneyMinor } from '../utils/money';
import { ReceiptStatusBadge } from './ReceiptStatusBadge';

type Props = {
  payment: Payment;
  receiptUnavailable?: boolean;
};

export function ReceiptCard({ payment, receiptUnavailable }: Props) {
  const receiptStatus = receiptUnavailable ? 'unavailable' : payment.receiptStatus;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{payment.providerName}</Text>
      <Text style={styles.subtitle}>{payment.serviceName}</Text>
      <Text style={styles.amount}>{formatMoneyMinor(payment.totalMinor)}</Text>
      <View style={styles.breakdown}>
        <View style={styles.line}>
          <Text style={styles.label}>Servicio</Text>
          <Text style={styles.value}>{formatMoneyMinor(payment.amountMinor)}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.label}>{payment.feeLabel}</Text>
          <Text style={styles.value}>{formatMoneyMinor(payment.feeMinor)}</Text>
        </View>
      </View>
      {payment.paymentMethodLabel ? (
        <View style={styles.methodLine}>
          <Text style={styles.label}>Método</Text>
          <Text style={styles.value}>
            {payment.paymentMethodLabel}
            {payment.paymentMethodIsMock ? ' · método demo' : ''}
          </Text>
        </View>
      ) : null}
      <Text style={styles.folio}>Folio {payment.folio}</Text>
      <ReceiptStatusBadge status={receiptStatus} />
      {payment.isMock ? <Text style={styles.unavailable}>Comprobante de prueba sin confirmación real de proveedor.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.heading,
    color: colors.success,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  breakdown: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  folio: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
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
  methodLine: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 18,
  },
  unavailable: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.md,
  },
  value: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
