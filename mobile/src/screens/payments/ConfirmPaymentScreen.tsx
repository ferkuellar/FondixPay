import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { View } from 'react-native';

import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { PaymentSummaryCard } from '../../components/PaymentSummaryCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import type { RootStackParamList } from '../../types';
import { calculatePaymentBreakdown, formatMoneyMinor } from '../../utils/money';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

export function ConfirmPaymentScreen({ navigation, route }: Props) {
  const service = useServiceStore((state) => state.getService(route.params.serviceId));
  const payService = usePaymentStore((state) => state.payService);
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
        <PaymentSummaryCard
          alias={service.alias}
          amount={service.amountDue}
          category={service.provider.category}
          providerName={service.provider.displayName}
          reference={service.reference}
        />
        <PrimaryButton disabled={service.amountDue <= 0} onPress={pay} variant="success">
          Pagar {formatMoneyMinor(breakdown.totalMinor)}
        </PrimaryButton>
      </View>
    </Screen>
  );
}
