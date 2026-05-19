import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetail'>;

export function ServiceDetailScreen({ navigation, route }: Props) {
  const service = useServiceStore((state) => state.getService(route.params.serviceId));
  const removeService = useServiceStore((state) => state.removeService);
  const selectService = usePaymentStore((state) => state.selectService);

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

  const currentService = service;

  function pay() {
    selectService(currentService.id);
    navigation.navigate('ConfirmPayment', { serviceId: currentService.id });
  }

  function remove() {
    removeService(currentService.id);
    navigation.replace('Home');
  }

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <View style={sharedStyles.card}>
          <Text style={{ color: colors.text, fontSize: 44 }}>{currentService.provider.icon}</Text>
          <Text style={{ color: colors.muted, fontSize: 16, marginTop: 8 }}>{currentService.provider.displayName}</Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 }}>{currentService.alias}</Text>
          <Text style={{ color: colors.muted, marginTop: 8 }}>Referencia {currentService.reference}</Text>
          <Text style={[sharedStyles.amount, { marginTop: 24 }]}>${currentService.amountDue.toFixed(0)}</Text>
          <Text style={sharedStyles.body}>{currentService.amountDue > 0 ? currentService.dueText : 'Ya quedo pagado'}</Text>
        </View>

        <View style={sharedStyles.actions}>
          <PrimaryButton disabled={currentService.amountDue <= 0} onPress={pay}>Pagar ahora</PrimaryButton>
          <Text style={sharedStyles.link} onPress={remove}>Quitar servicio</Text>
        </View>
      </View>
    </Screen>
  );
}
