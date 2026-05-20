import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { AmountDisplay } from './AmountDisplay';
import { ServiceIconBadge } from './ServiceIconBadge';

type Props = {
  providerName: string;
  category: string;
  alias: string;
  reference: string;
  amount: number;
  paymentMethod?: string;
};

export function PaymentSummaryCard({
  providerName,
  category,
  alias,
  reference,
  amount,
  paymentMethod = 'Tarjeta demo **** 9021',
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ServiceIconBadge category={category} size={40} />
        <Text style={styles.provider}>{providerName}</Text>
        <AmountDisplay amount={amount} />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>{alias}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Número de servicio</Text>
        <Text style={styles.value}>{reference}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Método de pago</Text>
        <Text style={styles.value}>{paymentMethod}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    gap: spacing.sm,
    padding: spacing.xl,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  provider: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  row: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
