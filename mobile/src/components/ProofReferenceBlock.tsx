import { StyleSheet, Text, View } from 'react-native';

import type { ReceiptProof } from '../types';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  proof: ReceiptProof;
};

export function ProofReferenceBlock({ proof }: Props) {
  return (
    <View style={styles.block}>
      <Reference label="Referencia interna" value={proof.internalReference} />
      {proof.providerReference ? <Reference label="Referencia demo" value={proof.providerReference} /> : null}
      {proof.correlationId ? <Reference label="Correlation ID" value={proof.correlationId} /> : null}
      <Reference label="Payment ID" value={proof.paymentId} />
      {proof.receiptId ? <Reference label="Receipt ID" value={proof.receiptId} /> : null}
    </View>
  );
}

function Reference({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    gap: spacing.sm,
    padding: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  row: {
    gap: spacing.xs,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
