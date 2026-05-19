import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAppStore } from '../store/appStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export function PaymentSuccessScreen({ navigation, route }: Props) {
  const payment = useAppStore((state) => state.payments.find((item) => item.id === route.params.paymentId));

  return (
    <Screen>
      <View style={[sharedStyles.container, { justifyContent: 'center' }]}>
        <Text style={[sharedStyles.title, { color: colors.success }]}>Ya quedo pagado</Text>
        <Text style={sharedStyles.body}>{payment ? `${payment.serviceName} por $${payment.amount.toFixed(0)}` : 'Tu pago se guardo.'}</Text>
        {payment ? <Text style={sharedStyles.body}>Folio {payment.folio}</Text> : null}
        <View style={sharedStyles.actions}>
          <PrimaryButton onPress={() => navigation.replace('Home')}>Volver al inicio</PrimaryButton>
          <Text style={sharedStyles.link} onPress={() => navigation.navigate('History')}>Ver historial</Text>
        </View>
      </View>
    </Screen>
  );
}

