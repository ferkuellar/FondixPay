import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { Payment, PaymentDisplayStatus } from '../types';
import { formatDateTime } from '../utils/date';
import { formatMoneyMinor } from '../utils/money';
import { ReceiptStatusBadge } from './ReceiptStatusBadge';

type Props = {
  payment: Payment;
};

const paymentStatusLabels: Record<PaymentDisplayStatus, string> = {
  duplicate_blocked: 'Intento duplicado bloqueado',
  failed: 'Pago no completado',
  pending: 'Pendiente de confirmación',
  succeeded: 'Pago mock guardado',
  timeout: 'En verificación',
};

export function ReceiptDetailCard({ payment }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.provider}>{payment.providerName}</Text>
        <Text style={styles.service}>{payment.serviceName}</Text>
        <Text style={styles.paymentStatus}>{paymentStatusLabels[payment.status]}</Text>
        <ReceiptStatusBadge status={payment.receiptStatus} />
      </View>
      <View style={styles.breakdown}>
        <View style={styles.line}>
          <Text style={styles.label}>Monto del servicio</Text>
          <Text style={styles.value}>{formatMoneyMinor(payment.amountMinor, payment.currency)}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.label}>{payment.feeLabel}</Text>
          <Text style={styles.value}>{formatMoneyMinor(payment.feeMinor, payment.currency)}</Text>
        </View>
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>{formatMoneyMinor(payment.totalMinor, payment.currency)}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.label}>Método</Text>
          <Text style={styles.value}>{payment.paymentMethodLabel ?? 'Método no registrado'}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Referencia mock</Text>
          <Text style={styles.value}>{payment.mockReference}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>{formatDateTime(payment.paidAt)}</Text>
        </View>
        {payment.correlationId ? (
          <View style={styles.detail}>
            <Text style={styles.label}>Referencia de soporte</Text>
            <Text style={styles.value}>{payment.correlationId}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Comprobante mock/dev</Text>
        <Text style={styles.noticeText}>
          Este detalle documenta la simulación. No confirma un pago aplicado por proveedor real.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  breakdown: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  detail: {
    gap: spacing.xs,
  },
  details: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  header: {
    gap: spacing.sm,
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
  notice: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  noticeTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  paymentStatus: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  provider: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 20,
  },
  service: {
    ...typography.body,
    color: colors.textSecondary,
  },
  total: {
    ...typography.heading,
    color: colors.textPrimary,
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
  value: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
