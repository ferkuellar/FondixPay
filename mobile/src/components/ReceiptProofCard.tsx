import { StyleSheet, Text, View } from 'react-native';

import type { ReceiptProof } from '../types';
import { radius, spacing, typography, useAppTheme } from '../theme';
import { formatDateTime } from '../utils/date';
import { formatMoneyMinor } from '../utils/money';
import { ProofReferenceBlock } from './ProofReferenceBlock';
import { ReceiptStatusBadge } from './ReceiptStatusBadge';

type Props = {
  proof: ReceiptProof;
};

export function ReceiptProofCard({ proof }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.provider, { color: theme.fg }]}>{proof.serviceProviderName}</Text>
        <Text style={[styles.service, { color: theme.fg2 }]}>{proof.serviceName}</Text>
        <Text style={[styles.status, { color: theme.fg }]}>Prueba: {statusLabel(proof.paymentStatus)}</Text>
        <Text style={[styles.status, { color: theme.fg }]}>Estado demo: {statusLabel(proof.providerStatus)}</Text>
        <ReceiptStatusBadge status={proof.receiptStatus} />
      </View>
      <View style={styles.breakdown}>
        <Line label="Monto del servicio" value={formatMoneyMinor(proof.amountMinor, proof.currency)} />
        <Line label="Comision FondixPay" value={formatMoneyMinor(proof.feeMinor, proof.currency)} />
        <View style={[styles.totalLine, { borderTopColor: theme.divider }]}>
          <Text style={[styles.totalLabel, { color: theme.fg }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.fg }]}>{formatMoneyMinor(proof.totalMinor, proof.currency)}</Text>
        </View>
      </View>
      <View style={[styles.details, { borderTopColor: theme.divider }]}>
        <Line label="Método demo" value={proof.cardLabelSafe ?? 'Método demo no registrado'} />
        <Line label="Referencia servicio" value={proof.serviceReferenceMasked} />
        <Line label="Fecha" value={formatDateTime(proof.issuedAt)} />
      </View>
      <ProofReferenceBlock proof={proof} />
      <View style={[styles.disclaimer, { backgroundColor: `${theme.warning}18` }]}>
        <Text style={[styles.disclaimerTitle, { color: theme.fg }]}>{proof.isSandbox ? 'Comprobante de prueba sandbox' : 'Comprobante de prueba'}</Text>
        <Text style={[styles.disclaimerText, { color: theme.fg2 }]}>{proof.disclaimer}</Text>
      </View>
    </View>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.line}>
      <Text style={[styles.label, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.fg }]}>{value}</Text>
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
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  details: {
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  disclaimer: {
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  disclaimerText: {
    ...typography.caption,
  },
  disclaimerTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  header: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
  },
  line: {
    gap: spacing.xs,
  },
  provider: {
    ...typography.heading,
    fontSize: 20,
  },
  service: {
    ...typography.body,
  },
  status: {
    ...typography.bodySmall,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  totalLabel: {
    ...typography.body,
    fontWeight: '700',
  },
  totalLine: {
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  totalValue: {
    ...typography.heading,
    ...typography.amount,
    fontSize: 30,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
});
