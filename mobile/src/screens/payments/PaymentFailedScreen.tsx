import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PaymentRecoverySummary } from '../../components/PaymentRecoverySummary';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { AlertCard } from '../../components/AlertCard';
import { getProviderReadinessPresentation, isDemoPaymentEnabled } from '../../integrations/providerReadiness';
import { usePaymentStore } from '../../store/paymentStore';
import { radius, spacing, typography, useAppTheme } from '../../theme';
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
  const { theme } = useAppTheme();
  const recovery = route.params.recovery;
  const setMockScenario = usePaymentStore((state) => state.setMockScenario);
  const demoPaymentEnabled = isDemoPaymentEnabled();
  const providerUnavailable = getProviderReadinessPresentation();

  function retry() {
    setMockScenario('succeeded');
    navigation.replace('ConfirmPayment', { serviceId: recovery.serviceId });
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: `${theme.error}18` }]}>
            <Feather color={theme.error} name="x-circle" size={34} />
          </View>
          <Text style={[styles.title, { color: theme.fg }]}>No pudimos hacer tu pago</Text>
          <Text style={[styles.body, { color: theme.fg2 }]}>{failureMessage(recovery.reason)}</Text>
        </View>
        <PaymentRecoverySummary recovery={recovery} />
        {demoPaymentEnabled ? (
          <AlertCard
            tone="info"
            title="No se cobró nada"
            message="No se movió dinero de tu cuenta. Puedes intentar de nuevo sin riesgo."
          />
        ) : (
          <AlertCard tone="info" title={providerUnavailable.title} message={providerUnavailable.message} />
        )}
        <View style={styles.actions}>
          {demoPaymentEnabled ? (
            <>
              <PrimaryButton onPress={retry}>INTENTAR DE NUEVO</PrimaryButton>
              <PrimaryButton
                onPress={() => navigation.navigate('PaymentMethods', { serviceId: recovery.serviceId })}
                variant="secondary"
              >
                Usar otro método de pago
              </PrimaryButton>
            </>
          ) : null}
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
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  notice: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
  },
  noticeTitle: {
    ...typography.body,
    fontWeight: '700',
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
});
