import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useAppTheme } from '../theme';
import { formatMoneyMajor } from '../utils/money';

type Props = {
  amount: number;
  label?: string;
};

export function AmountDisplay({ amount, label = 'Total simulado' }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[styles.amount, { color: theme.fg }]}>{formatMoneyMajor(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.amount,
    marginTop: spacing.xs,
  },
  label: {
    ...typography.micro,
    textAlign: 'center',
  },
  wrap: {
    alignItems: 'center',
  },
});
