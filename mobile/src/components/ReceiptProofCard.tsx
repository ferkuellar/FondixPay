import { StyleSheet, Text, View } from 'react-native';

import type { ReceiptProof } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { formatDateTime } from '../utils/date';
import { formatMoneyMinor } from '../utils/money';
import { ProofReferenceBlock } from './ProofReferenceBlock';
import { ReceiptStatusBadge } from './ReceiptStatusBadge';

type Props = {
  proof: ReceiptProof;
};

export function ReceiptProofCard({ proof }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.provider}>{proof.serviceProviderName}</Text>
        <Text style={styles.service}>{proof.serviceName}</Text>
        <Text style={styles.status}>Pago: {statusLabel(proof.paymentStatus)}</Text>
        <Text style={styles.status}>Servicio: {statusLabel(proof.providerStatus)}</Text>
        <ReceiptStatusBadge status={proof.receiptStatus} />
      </View>
      <View style={styles.breakdown}>
        <Line label="Monto del servicio" value={formatMoneyMinor(proof.amountMinor, proof.currency)} />
        <Line label="Comision FondixPay" value={formatMoneyMinor(proof.feeMinor, proof.currency)} />
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatMoneyMinor(proof.totalMinor, proof.currency)}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Line label="Tarjeta segura" value={proof.cardLabelSafe ?? 'Metodo seguro no registrado'} />
        <Line label="Referencia servicio" value={proof.serviceReferenceMasked} />
        <Line label="Fecha" value={formatDateTime(proof.issuedAt)} />
      </View>
      <ProofReferenceBlock proof={proof} />
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>{proof.isSandbox ? 'Comprobante mock/sandbox' : 'Comprobante mock/dev'}</Text>
        <Text style={styles.disclaimerText}>{proof.disclaimer}</Text>
      </View>
    </View>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
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
  details: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  disclaimer: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  disclaimerTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  header: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  line: {
    gap: spacing.xs,
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
  status: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  totalLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  totalLine: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  totalValue: {
    ...typography.heading,
    color: colors.success,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
