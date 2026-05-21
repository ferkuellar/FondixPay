import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

export function DemoBalanceNotice() {
  return (
    <View style={styles.notice}>
      <Text style={styles.title}>Saldo demo</Text>
      <Text style={styles.copy}>Este saldo es simulado y no representa dinero real.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  notice: {
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
