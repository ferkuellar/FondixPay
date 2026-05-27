import { StyleSheet, Text, View } from 'react-native';

import { radius, shadows, spacing, typography, useAppTheme } from '../theme';
import { formatMoneyMinor } from '../utils/money';

type Props = {
  label: string;
  amountMinor: number;
  footer?: string;
};

export function AmountCard({ label, amountMinor, footer }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, shadows.cardHi, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[styles.amount, { color: theme.fg }]}>{formatMoneyMinor(amountMinor)}</Text>
      {footer ? <Text style={[styles.footer, { color: theme.fg2 }]}>{footer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.amount,
    marginTop: spacing.xs,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  footer: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  label: {
    ...typography.micro,
  },
});
