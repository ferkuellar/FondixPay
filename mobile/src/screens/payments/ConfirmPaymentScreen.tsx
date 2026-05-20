import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  const payService = usePaymentStore((state) => state.payService);
  const selectedPaymentMethod = usePaymentMethodStore((state) => state.getSelectedPaymentMethod());
  const [isPaying, setIsPaying] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

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

  if (paymentFailed) {
    return (
      <Screen>
        <ErrorState
          message="No pudimos completar el pago. Intenta de nuevo."
          onRetry={() => setPaymentFailed(false)}
        />
      </Screen>
    );
  }

  if (isPaying) {
    return (
      <Screen>
        <LoadingState message="Procesando pago..." />
      </Screen>
    );
  }

  function pay() {
    setIsPaying(true);
    setPaymentFailed(false);
    setTimeout(() => {
      try {
        const payment = payService(route.params.serviceId);
        setIsPaying(false);
        navigation.replace('PaymentSuccess', { paymentId: payment.id });
      } catch {
        setIsPaying(false);
        setPaymentFailed(true);
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
        </View>
        <PrimaryButton disabled={!canPay} onPress={pay} variant="success">
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
