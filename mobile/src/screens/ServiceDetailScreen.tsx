import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAppStore } from '../store/appStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetail'>;

export function ServiceDetailScreen({ navigation, route }: Props) {
  const service = useAppStore((state) => state.getService(route.params.serviceId));

  if (!service) {
    return (
      <Screen>
        <Text style={sharedStyles.title}>No encontramos este servicio</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <View style={sharedStyles.card}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>{service.provider.name}</Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 }}>{service.alias}</Text>
          <Text style={{ color: colors.muted, marginTop: 8 }}>Referencia {service.reference}</Text>
          <Text style={[sharedStyles.amount, { marginTop: 24 }]}>${service.amountDue.toFixed(0)}</Text>
          <Text style={sharedStyles.body}>{service.amountDue > 0 ? `Tu ${service.provider.category.toLowerCase()} ${service.dueText}` : 'Ya quedo pagado'}</Text>
        </View>

        <View style={sharedStyles.actions}>
          <PrimaryButton disabled={service.amountDue <= 0} onPress={() => navigation.navigate('ConfirmPayment', { serviceId: service.id })}>
            Pagar ahora
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

