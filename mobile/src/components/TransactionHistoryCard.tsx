import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { Payment, PaymentDisplayStatus } from '../types';
import { formatDateTime } from '../utils/date';
import { formatMoneyMinor } from '../utils/money';
import { ReceiptStatusBadge } from './ReceiptStatusBadge';

type Props = {
  payment: Payment;
  onPress: () => void;
};

const statusLabels: Record<PaymentDisplayStatus, string> = {
  duplicate_blocked: 'Intento duplicado bloqueado',
  failed: 'Pago no completado',
  pending: 'Pendiente',
  succeeded: 'Pagado demo',
  timeout: 'En verificación',
};

export function TransactionHistoryCard({ payment, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.provider}>{payment.providerName}</Text>
          <Text style={styles.service}>{payment.serviceName}</Text>
        </View>
        <Text style={[styles.status, payment.status === 'succeeded' ? styles.success : styles.attention]}>
          {statusLabels[payment.status]}
        </Text>
      </View>
      <View style={styles.totalLine}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.total}>{formatMoneyMinor(payment.totalMinor, payment.currency)}</Text>
      </View>
      <View style={styles.meta}>
        <ReceiptStatusBadge status={payment.receiptStatus} />
        {payment.isMock ? <Text style={styles.mock}>Mock/dev sin confirmación real de proveedor</Text> : null}
        <Text style={styles.date}>{formatDateTime(payment.paidAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  attention: {
    color: colors.warning,
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  meta: {
    gap: spacing.sm,
  },
  mock: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  provider: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 18,
  },
  service: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  status: {
    ...typography.caption,
    flexShrink: 1,
    fontWeight: '700',
    textAlign: 'right',
  },
  success: {
    color: colors.success,
  },
  total: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  totalLine: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
});
