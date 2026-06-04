import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useAppTheme } from '../theme';
import type { Payment, PaymentDisplayStatus } from '../types';
import { formatDateTime } from '../utils/date';
import { formatMoneyMinor } from '../utils/money';
import { ReceiptStatusBadge } from './ReceiptStatusBadge';
import { StatusBadge } from './StatusBadge';

type Props = {
  payment: Payment;
  onPress: () => void;
};

const statusLabels: Record<PaymentDisplayStatus, string> = {
  duplicate_blocked: 'Intento duplicado bloqueado',
  failed: 'Prueba no completada',
  pending: 'Pendiente',
  succeeded: 'Simulación guardada',
  timeout: 'En verificación',
};

export function TransactionHistoryCard({ payment, onPress }: Props) {
  const { theme } = useAppTheme();
  const badgeVariant = payment.status === 'succeeded' ? 'paid' : payment.status === 'pending' || payment.status === 'timeout' ? 'processing' : 'review';

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={[styles.provider, { color: theme.fg }]}>{payment.providerName}</Text>
          <Text style={[styles.service, { color: theme.fg2 }]}>{payment.serviceName}</Text>
        </View>
        <StatusBadge label={statusLabels[payment.status]} variant={badgeVariant} />
      </View>
      <View style={[styles.totalLine, { borderTopColor: theme.divider }]}>
        <Text style={[styles.totalLabel, { color: theme.fg2 }]}>Total</Text>
        <Text style={[styles.total, { color: theme.fg }]}>{formatMoneyMinor(payment.totalMinor, payment.currency)}</Text>
      </View>
      <View style={styles.meta}>
        <ReceiptStatusBadge status={payment.receiptStatus} />
        {payment.isMock ? <Text style={[styles.mock, { color: theme.fg2 }]}>Demo sin confirmación real de proveedor</Text> : null}
        <Text style={[styles.date, { color: theme.fg3 }]}>{formatDateTime(payment.paidAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
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
  },
  provider: {
    ...typography.heading,
    fontSize: 18,
  },
  service: {
    ...typography.bodySmall,
  },
  total: {
    ...typography.amountSmall,
  },
  totalLabel: {
    ...typography.caption,
  },
  totalLine: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
});
