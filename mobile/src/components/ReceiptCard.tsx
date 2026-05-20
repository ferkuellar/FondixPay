import { StyleSheet, Text, View } from 'react-native';

import type { Payment } from '../types';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  payment: Payment;
  receiptUnavailable?: boolean;
};

export function ReceiptCard({ payment, receiptUnavailable }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{payment.providerName}</Text>
      <Text style={styles.subtitle}>{payment.serviceName}</Text>
      <Text style={styles.amount}>${payment.amount.toFixed(0)}</Text>
      <Text style={styles.folio}>Folio {payment.folio}</Text>
      {receiptUnavailable ? (
        <Text style={styles.unavailable}>Comprobante no disponible por ahora.</Text>
      ) : null}
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
  folio: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
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
});
