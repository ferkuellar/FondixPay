import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';

type Props = {
  compact?: boolean;
};

export function PaymentMethodDemoNotice({ compact }: Props) {
  return (
    <View style={[styles.notice, compact && styles.compact]}>
      <Feather color={colors.primary} name="info" size={16} />
      <Text style={styles.text}>Método demo. No se realizará ningún cargo real ni ingreses datos reales.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compact: {
    padding: spacing.sm,
  },
  notice: {
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  text: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
});
