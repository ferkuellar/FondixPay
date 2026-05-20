import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  onAdd: () => void;
};

export function PaymentMethodEmptyState({ onAdd }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Feather color={colors.primary} name="plus-circle" size={24} />
      </View>
      <Text style={styles.title}>Sin método de pago</Text>
      <Text style={styles.body}>
        Agrega un método demo para probar el flujo. No se pedirán datos reales ni se realizará ningún cargo.
      </Text>
      <PrimaryButton onPress={onAdd}>AGREGAR MÉTODO DEMO</PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
});
