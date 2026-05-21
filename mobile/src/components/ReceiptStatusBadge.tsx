import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { ReceiptStatus } from '../types';

type Props = {
  status: ReceiptStatus;
};

const labels: Record<ReceiptStatus, string> = {
  generated: 'Comprobante disponible',
  pending: 'Comprobante pendiente',
  unavailable: 'Sin comprobante',
  voided: 'Comprobante anulado',
};

export function ReceiptStatusBadge({ status }: Props) {
  return (
    <View style={[styles.badge, styles[status]]}>
      <Text style={[styles.text, styles[`${status}Text` as keyof typeof styles]]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  generated: {
    backgroundColor: colors.successSoft,
  },
  generatedText: {
    color: colors.success,
  },
  pending: {
    backgroundColor: colors.warningSoft,
  },
  pendingText: {
    color: colors.warning,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
  unavailable: {
    backgroundColor: colors.bgSubtle,
  },
  unavailableText: {
    color: colors.textSecondary,
  },
  voided: {
    backgroundColor: colors.dangerSoft,
  },
  voidedText: {
    color: colors.danger,
  },
});
