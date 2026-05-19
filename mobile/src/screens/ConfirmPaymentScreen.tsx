import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAppStore } from '../store/appStore';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

export function ConfirmPaymentScreen({ navigation, route }: Props) {
  const service = useAppStore((state) => state.getService(route.params.serviceId));
  const payService = useAppStore((state) => state.payService);

  if (!service) {
    return (
      <Screen>
        <Text style={sharedStyles.title}>No encontramos este servicio</Text>
      </Screen>
    );
  }

  function pay() {
    const payment = payService(service.id);
    navigation.replace('PaymentSuccess', { paymentId: payment.id });
  }

  return (
    <Screen>
      <View style={[sharedStyles.container, { justifyContent: 'space-between' }]}>
        <View style={{ gap: 16 }}>
          <Text style={sharedStyles.title}>Pagar {service.alias}</Text>
          <View style={sharedStyles.card}>
            <Text style={sharedStyles.body}>Total a pagar</Text>
            <Text style={sharedStyles.amount}>${service.amountDue.toFixed(0)}</Text>
            <Text style={sharedStyles.body}>Se guardara el comprobante en tu historial.</Text>
          </View>
        </View>
        <PrimaryButton onPress={pay}>Confirmar pago</PrimaryButton>
      </View>
    </Screen>
  );
}

