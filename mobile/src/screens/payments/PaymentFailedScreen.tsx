import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PaymentRecoverySummary } from '../../components/PaymentRecoverySummary';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, radius, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentFailed'>;

function failureMessage(reason: Props['route']['params']['recovery']['reason']) {
  switch (reason) {
    case 'method_unavailable_mock':
      return 'Tu tarjeta demo no está disponible para este intento.';
    case 'insufficient_funds_mock':
      return 'La tarjeta demo no tiene disponibilidad suficiente para completar la simulación.';
    case 'duplicate_attempt_mock':
      return 'Detectamos un intento duplicado y bloqueamos el reintento.';
    default:
      return 'No pudimos procesar el pago en este momento.';
  }
}

export function PaymentFailedScreen({ navigation, route }: Props) {
  const recovery = route.params.recovery;
  const setMockScenario = usePaymentStore((state) => state.setMockScenario);

  function retry() {
    setMockScenario('succeeded');
    navigation.replace('ConfirmPayment', { serviceId: recovery.serviceId });
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Feather color={colors.danger} name="x-circle" size={28} />
          </View>
          <Text style={styles.title}>El pago no se completó</Text>
          <Text style={styles.body}>{failureMessage(recovery.reason)} No se realizó ningún cargo real.</Text>
        </View>
        <PaymentRecoverySummary recovery={recovery} />
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Siguiente acción</Text>
          <Text style={styles.noticeText}>Puedes reintentar de forma segura o cambiar la tarjeta demo antes de pagar.</Text>
        </View>
        <View style={styles.actions}>
          <PrimaryButton onPress={retry}>INTENTAR DE NUEVO</PrimaryButton>
          <PrimaryButton
            onPress={() => navigation.navigate('PaymentMethods', { serviceId: recovery.serviceId })}
            variant="secondary"
          >
            CAMBIAR MÉTODO
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.navigate('SupportPlaceholder', { recovery })} variant="secondary">
            NECESITO AYUDA
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.navigate('History')} variant="secondary">
            VER HISTORIAL
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
    backgroundColor: colors.dangerSoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  notice: {
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  noticeTitle: {
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
