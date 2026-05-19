import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmPayment'>;

export function ConfirmPaymentScreen({ navigation, route }: Props) {
  const service = useServiceStore((state) => state.getService(route.params.serviceId));
  const payService = usePaymentStore((state) => state.payService);

  if (!service) {
    return (
      <Screen>
        <View style={sharedStyles.container}>
          <Text style={sharedStyles.title}>No encontramos este servicio</Text>
          <PrimaryButton onPress={() => navigation.replace('Home')}>Volver al inicio</PrimaryButton>
        </View>
      </Screen>
    );
  }

  function pay() {
    const payment = payService(route.params.serviceId);
    navigation.replace('PaymentSuccess', { paymentId: payment.id });
  }

  return (
    <Screen>
      <View style={[sharedStyles.container, { justifyContent: 'space-between' }]}>
        <View style={{ gap: 16 }}>
          <Text style={sharedStyles.title}>Confirmar pago</Text>
          <View style={sharedStyles.card}>
            <Text style={{ color: colors.text, fontSize: 44 }}>{service.provider.icon}</Text>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 12 }}>{service.provider.name}</Text>
            <Text style={sharedStyles.body}>{service.alias}</Text>
            <Text style={[sharedStyles.amount, { marginTop: 24 }]}>${service.amountDue.toFixed(0)}</Text>
          </View>
        </View>
        <PrimaryButton disabled={service.amountDue <= 0} onPress={pay}>Pagar ahora</PrimaryButton>
      </View>
    </Screen>
  );
}
