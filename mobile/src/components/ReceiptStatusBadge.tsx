import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { radius, spacing, typography, useAppTheme } from '../theme';
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
  const { theme } = useAppTheme();
  const tone = status === 'generated' ? theme.success : status === 'pending' ? theme.pending : status === 'voided' ? theme.error : theme.fg2;
  const icon = status === 'generated' ? 'check-circle' : status === 'pending' ? 'clock' : status === 'voided' ? 'x-circle' : 'file';

  return (
    <View style={[styles.badge, { backgroundColor: `${tone}22`, borderColor: `${tone}55` }]}>
      <Feather color={tone} name={icon} size={13} />
      <Text style={[styles.text, { color: tone }]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
});
