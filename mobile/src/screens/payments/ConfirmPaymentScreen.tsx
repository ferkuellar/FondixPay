import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { PaymentMethodCard } from '../../components/PaymentMethodCard';
import { PaymentMethodDemoNotice } from '../../components/PaymentMethodDemoNotice';
import { PaymentSummaryCard } from '../../components/PaymentSummaryCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors, radius, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';
import { calculatePaymentBreakdown, formatMoneyMinor } from '../../utils/money';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

export function ConfirmPaymentScreen({ navigation, route }: Props) {
  const service = useServiceStore((state) => state.getService(route.params.serviceId));
  const createRecoveryContext = usePaymentStore((state) => state.createRecoveryContext);
  const mockScenario = usePaymentStore((state) => state.mockScenario);
  const payService = usePaymentStore((state) => state.payService);
  const setMockScenario = usePaymentStore((state) => state.setMockScenario);
  const selectedPaymentMethod = usePaymentMethodStore((state) => state.getSelectedPaymentMethod());
  const [isPaying, setIsPaying] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState(false);

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
  const canPay = service.amountDue > 0 && Boolean(selectedPaymentMethod);

  if (isPaying) {
    return (
      <Screen>
        <LoadingState message="Procesando pago..." />
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
          setIsPaying(false);
          navigation.replace('PaymentFailed', { recovery });
          return;
        }

        if (mockScenario === 'pending' || mockScenario === 'timeout') {
          const recovery = createRecoveryContext(route.params.serviceId, mockScenario);
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
        navigation.replace('PaymentFailed', { recovery });
      }
    }, 700);
  }

  return (
    <Screen>
      <View style={[sharedStyles.container, { justifyContent: 'space-between' }]}>
        <View style={styles.content}>
          <PaymentSummaryCard
            alias={service.alias}
            amount={service.amountDue}
            category={service.provider.category}
            paymentMethod={selectedPaymentMethod?.label}
            paymentMethodNote={selectedPaymentMethod?.isMock ? 'Método demo · sin cargo real' : undefined}
            providerName={service.provider.displayName}
            reference={service.reference}
          />
          <View style={styles.methodSection}>
            <View style={styles.methodHeader}>
              <Text style={styles.methodTitle}>Método de pago</Text>
              <PrimaryButton
                onPress={() => navigation.navigate('PaymentMethods', { serviceId: service.id })}
                size="md"
                variant="secondary"
              >
                {selectedPaymentMethod ? 'CAMBIAR' : 'AGREGAR'}
              </PrimaryButton>
            </View>
            {selectedPaymentMethod ? (
              <>
                <PaymentMethodCard method={selectedPaymentMethod} selected compact />
                <PaymentMethodDemoNotice compact />
              </>
            ) : (
              <View style={styles.warning}>
                <Text style={styles.warningTitle}>Agrega un método demo para continuar</Text>
                <Text style={styles.warningText}>
                  No se realizará ningún cargo real. Este paso evita mostrar métodos de pago fantasma.
                </Text>
              </View>
            )}
          </View>
          <View style={styles.scenarioSection}>
            <Text style={styles.scenarioTitle}>Escenario demo</Text>
            <Text style={styles.scenarioCopy}>Prueba recovery mock sin proveedor real ni cargo real.</Text>
            <View style={styles.scenarioList}>
              {(['succeeded', 'failed', 'pending', 'timeout', 'duplicate_blocked'] as const).map((scenario) => (
                <Pressable
                  key={scenario}
                  accessibilityRole="button"
                  accessibilityState={{ selected: mockScenario === scenario }}
                  onPress={() => setMockScenario(scenario)}
                  style={[styles.scenarioChip, mockScenario === scenario && styles.scenarioChipSelected]}
                >
                  <Text style={[styles.scenarioChipText, mockScenario === scenario && styles.scenarioChipTextSelected]}>
                    {scenario.replace('_', ' ')}
                  </Text>
                </Pressable>
              ))}
            </View>
            {duplicateMessage ? <Text style={styles.duplicateText}>Ya estamos procesando este pago.</Text> : null}
          </View>
        </View>
        <PrimaryButton disabled={!canPay || isPaying} onPress={pay} variant="success">
          Pagar {formatMoneyMinor(breakdown.totalMinor)}
        </PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
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
