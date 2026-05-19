import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export function PaymentSuccessScreen({ navigation, route }: Props) {
  const payment = usePaymentStore((state) => state.getPayment(route.params.paymentId));

  return (
    <Screen>
      <View style={[sharedStyles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: colors.success, fontSize: 56, textAlign: 'center' }}>✓</Text>
        <Text style={[sharedStyles.title, { color: colors.success, textAlign: 'center' }]}>Ya quedo pagado</Text>
        <Text style={[sharedStyles.body, { textAlign: 'center' }]}>
          {payment ? `${payment.providerName} por $${payment.amount.toFixed(0)}` : 'Tu pago se guardo.'}
        </Text>
        {payment ? <Text style={[sharedStyles.body, { textAlign: 'center' }]}>Folio {payment.folio}</Text> : null}
        <View style={sharedStyles.actions}>
          <PrimaryButton onPress={() => navigation.replace('History')}>Ver historial</PrimaryButton>
          <Text style={sharedStyles.link} onPress={() => navigation.replace('Home')}>Volver al inicio</Text>
        </View>
      </View>
    </Screen>
  );
}
