import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  amount: number;
  label?: string;
};

export function AmountDisplay({ amount, label = 'Total a pagar' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>${amount.toFixed(0)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.display,
    color: colors.success,
    fontSize: 32,
    marginTop: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  wrap: {
    alignItems: 'center',
  },
});
