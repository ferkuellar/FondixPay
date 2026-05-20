import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PaymentRecoverySummary } from '../../components/PaymentRecoverySummary';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentPending'>;

export function PaymentPendingScreen({ navigation, route }: Props) {
  const recovery = route.params.recovery;
  const isTimeout = recovery.status === 'timeout';

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Feather color={colors.warning} name="clock" size={28} />
          </View>
          <Text style={styles.title}>{isTimeout ? 'Estamos verificando tu pago' : 'Pago en proceso'}</Text>
          <Text style={styles.body}>
            Tu pago está pendiente de confirmación. Aún no podemos confirmar el resultado. No intentes pagar de nuevo
            por ahora.
          </Text>
        </View>
        <View style={styles.status}>
          <Text style={styles.statusLabel}>Estado mock/dev</Text>
          <Text style={styles.statusValue}>{isTimeout ? 'En verificación' : 'Pendiente de confirmación'}</Text>
        </View>
        <PaymentRecoverySummary recovery={recovery} />
        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.replace('Home')}>VER ESTADO</PrimaryButton>
          <PrimaryButton onPress={() => navigation.navigate('SupportPlaceholder', { recovery })} variant="secondary">
            NECESITO AYUDA
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.replace('Home')} variant="secondary">
            IR AL INICIO
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.warningSoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  status: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
