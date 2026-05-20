import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportPlaceholder'>;

export function SupportPlaceholderScreen({ navigation, route }: Props) {
  const { recovery } = route.params;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Feather color={colors.primary} name="help-circle" size={28} />
        </View>
        <Text style={styles.title}>Soporte en preparación</Text>
        <Text style={styles.body}>
          Estamos preparando soporte dentro de la app. Guarda estas referencias mock para seguimiento del intento.
        </Text>
        <View style={styles.references}>
          <View style={styles.row}>
            <Text style={styles.label}>Referencia interna</Text>
            <Text style={styles.value}>{recovery.paymentId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Request ID</Text>
            <Text style={styles.value}>{recovery.requestId ?? 'Pendiente'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Correlation ID</Text>
            <Text style={styles.value}>{recovery.correlationId ?? 'Pendiente'}</Text>
          </View>
        </View>
        <Text style={styles.notice}>No se abrió un chat real ni un ticket real en esta fase mock/dev.</Text>
        <PrimaryButton onPress={() => navigation.replace('Home')}>VOLVER AL INICIO</PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  notice: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  references: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    width: '100%',
  },
  row: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  value: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
