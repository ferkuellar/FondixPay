import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const services = useServiceStore((state) => state.services);
  const selectService = usePaymentStore((state) => state.selectService);

  function payNow(serviceId: string) {
    selectService(serviceId);
    navigation.navigate('ConfirmPayment', { serviceId });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: 24 }}>
        <View style={{ gap: 8 }}>
          <Text style={sharedStyles.title}>Hola</Text>
          <Text style={sharedStyles.body}>Servicios guardados</Text>
        </View>

        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
            style={sharedStyles.serviceRow}
          >
            <View style={sharedStyles.serviceIcon}>
              <Text style={{ fontSize: 28 }}>{service.provider.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{service.alias}</Text>
              <Text style={{ color: colors.muted }}>{service.provider.displayName} · {service.dueText}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Text style={{ color: service.amountDue > 0 ? colors.text : colors.success, fontSize: 19, fontWeight: '800' }}>
                ${service.amountDue.toFixed(0)}
              </Text>
              <Pressable
                accessibilityRole="button"
                disabled={service.amountDue <= 0}
                onPress={() => payNow(service.id)}
                style={[sharedStyles.smallButton, service.amountDue <= 0 && { opacity: 0.45 }]}
              >
                <Text style={sharedStyles.smallButtonText}>{service.amountDue > 0 ? 'Pagar' : 'Listo'}</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}

        <View style={sharedStyles.actions}>
          <PrimaryButton onPress={() => navigation.navigate('AddService')}>+ Agregar servicio</PrimaryButton>
          <Text style={sharedStyles.link} onPress={() => navigation.navigate('History')}>Ver historial</Text>
          <Text style={sharedStyles.link} onPress={() => navigation.navigate('Profile')}>Mi perfil</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
