import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { PaymentMethodCard } from '../../components/PaymentMethodCard';
import { PaymentMethodDemoNotice } from '../../components/PaymentMethodDemoNotice';
import { PaymentSummaryCard } from '../../components/PaymentSummaryCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { AlertCard } from '../../components/AlertCard';
import { AmountCard } from '../../components/AmountCard';
import { isQaScenariosEnabled } from '../../config/environment';
import { getProviderReadinessPresentation, isDemoPaymentEnabled } from '../../integrations/providerReadiness';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors, radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';
import { calculatePaymentBreakdown } from '../../utils/money';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

export function ConfirmPaymentScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const service = useServiceStore((state) => state.getService(route.params.serviceId));
  const createRecoveryContext = usePaymentStore((state) => state.createRecoveryContext);
  const mockScenario = usePaymentStore((state) => state.mockScenario);
  const payService = usePaymentStore((state) => state.payService);
  const recordRecoveryAttempt = usePaymentStore((state) => state.recordRecoveryAttempt);
  const setMockScenario = usePaymentStore((state) => state.setMockScenario);
  const ensureDemoPaymentMethod = usePaymentMethodStore((state) => state.ensureDemoPaymentMethod);
  const selectedPaymentMethod = usePaymentMethodStore((state) => state.getSelectedPaymentMethod());
  const [isPaying, setIsPaying] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState(false);
  const demoPaymentEnabled = isDemoPaymentEnabled();
  const qaScenariosEnabled = isQaScenariosEnabled();
  const providerUnavailable = getProviderReadinessPresentation();

  useEffect(() => {
    if (demoPaymentEnabled) {
      ensureDemoPaymentMethod();
    }
  }, [demoPaymentEnabled, ensureDemoPaymentMethod]);

  if (!service) {
    return (
      <Screen>
        <View style={sharedStyles.container}>
          <ErrorState
            message="No encontramos este servicio."
            onRetry={() => navigation.replace('Home')}
            retryLabel="VOLVER AL INICIO"
          />
        </View>
      </Screen>
    );
  }

  const breakdown = calculatePaymentBreakdown(service.amountDue);
  const canPay = demoPaymentEnabled && service.amountDue > 0 && Boolean(selectedPaymentMethod);

  if (isPaying) {
    return (
      <Screen>
        <LoadingState message="Simulando pago de prueba..." />
      </Screen>
    );
  }

  function pay() {
    if (isPaying) {
      setDuplicateMessage(true);
      return;
    }

    setIsPaying(true);
    setDuplicateMessage(false);
    setTimeout(() => {
      try {
        if (mockScenario === 'failed' || mockScenario === 'duplicate_blocked') {
          const recovery = createRecoveryContext(route.params.serviceId, mockScenario);
          recordRecoveryAttempt(recovery);
          setIsPaying(false);
          navigation.replace('PaymentFailed', { recovery });
          return;
        }

        if (mockScenario === 'pending' || mockScenario === 'timeout') {
          const recovery = createRecoveryContext(route.params.serviceId, mockScenario);
          recordRecoveryAttempt(recovery);
          setIsPaying(false);
          navigation.replace('PaymentPending', { recovery });
          return;
        }

        const payment = payService(route.params.serviceId);
        setIsPaying(false);
        navigation.replace('PaymentSuccess', { paymentId: payment.id });
      } catch {
        setIsPaying(false);
        const recovery = createRecoveryContext(route.params.serviceId, 'failed');
        recordRecoveryAttempt(recovery);
        navigation.replace('PaymentFailed', { recovery });
      }
    }, 700);
  }

  return (
    <Screen>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.content}>
            <AmountCard
              amountMinor={breakdown.totalMinor}
              label="Total simulado"
              footer="Revisa el monto de prueba antes de continuar. No se realizará una operación real."
            />
            <PaymentSummaryCard
              alias={service.alias}
              amount={service.amountDue}
              category={service.provider.category}
              paymentMethod={selectedPaymentMethod?.label}
              paymentMethodNote={selectedPaymentMethod?.isMock ? 'Método demo · sin operación bancaria' : undefined}
              providerName={service.provider.displayName}
              reference={service.reference}
            />
            <View style={styles.methodSection}>
              <View style={styles.methodHeader}>
                <Text style={[styles.methodTitle, { color: theme.fg }]}>Método de prueba</Text>
                {demoPaymentEnabled ? (
                  <PrimaryButton
                    onPress={() => navigation.navigate('PaymentMethods', { serviceId: service.id })}
                    size="md"
                    variant="secondary"
                  >
                    {selectedPaymentMethod ? 'CAMBIAR' : 'AGREGAR'}
                  </PrimaryButton>
                ) : null}
              </View>
              {demoPaymentEnabled && selectedPaymentMethod ? (
                <>
                  <PaymentMethodCard method={selectedPaymentMethod} selected compact />
                  <PaymentMethodDemoNotice compact />
                </>
              ) : demoPaymentEnabled ? (
                <AlertCard
                  tone="warning"
                  title="Agrega un método demo para continuar"
                  message="No se solicitarán datos bancarios reales. Este paso evita mostrar métodos de pago fantasma."
                />
              ) : (
                <AlertCard tone="info" title={providerUnavailable.title} message={providerUnavailable.message} />
              )}
            </View>
            <AlertCard
              tone="info"
              title="Simulación protegida"
              message={
                demoPaymentEnabled
                  ? 'Validaremos solo el flujo demo. No hay proveedor real, WhatsApp real ni operación bancaria en esta pantalla.'
                  : 'Aún no hay proveedor transaccional activo. No se iniciará ningún pago desde esta pantalla.'
              }
            />
            {demoPaymentEnabled && qaScenariosEnabled ? (
              <View style={[styles.scenarioSection, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
                <Text style={[styles.scenarioTitle, { color: theme.fg }]}>Escenario demo</Text>
                <Text style={[styles.scenarioCopy, { color: theme.fg2 }]}>
                  Prueba escenarios demo sin proveedor real ni operación bancaria.
                </Text>
                <View style={styles.scenarioList}>
                  {(['succeeded', 'failed', 'pending', 'timeout', 'duplicate_blocked'] as const).map((scenario) => (
                    <Pressable
                      key={scenario}
                      accessibilityRole="button"
                      accessibilityState={{ selected: mockScenario === scenario }}
                      onPress={() => setMockScenario(scenario)}
                      style={[
                        styles.scenarioChip,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        mockScenario === scenario && { backgroundColor: `${theme.primary}18`, borderColor: theme.primary },
                      ]}
                    >
                      <Text style={[styles.scenarioChipText, { color: mockScenario === scenario ? theme.primary : theme.fg2 }]}>
                        {scenario.replace('_', ' ')}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {duplicateMessage ? (
                  <Text style={[styles.duplicateText, { color: theme.warning }]}>Ya estamos simulando este intento.</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
          {demoPaymentEnabled ? (
            <PrimaryButton disabled={!canPay || isPaying} onPress={pay} variant="success">
              Simular pago
            </PrimaryButton>
          ) : (
            <Text style={[styles.footerMessage, { color: theme.fg2 }]}>{providerUnavailable.message}</Text>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: spacing.lg,
  },
  footer: {
    borderTopWidth: 1,
    paddingBottom: spacing.md,
    paddingTop: spacing.md,
  },
  footerMessage: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  methodHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodSection: {
    gap: spacing.md,
  },
  methodTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  duplicateText: {
    ...typography.caption,
    color: colors.warning,
  },
  scenarioChip: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  scenarioChipSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  scenarioChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  scenarioChipTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  scenarioCopy: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scenarioList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scenarioSection: {
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scenarioTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  warning: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  warningText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  warningTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
