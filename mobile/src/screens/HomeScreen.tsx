import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAppStore } from '../store/appStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const services = useAppStore((state) => state.services);
  const pending = services.filter((service) => service.amountDue > 0);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <Text style={sharedStyles.title}>Lo pendiente</Text>
        <Text style={sharedStyles.body}>{pending.length ? 'Toca un servicio y paga en un paso.' : 'No tienes pagos pendientes.'}</Text>

        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
            style={sharedStyles.card}
          >
            <View style={{ gap: 6 }}>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{service.alias}</Text>
              <Text style={{ color: colors.muted }}>{service.provider.name} · {service.dueText}</Text>
              <Text style={{ color: service.amountDue > 0 ? colors.warning : colors.success, fontSize: 24, fontWeight: '800' }}>
                ${service.amountDue.toFixed(0)}
              </Text>
            </View>
          </Pressable>
        ))}

        <View style={sharedStyles.actions}>
          <PrimaryButton onPress={() => navigation.navigate('AddService')}>Guardar servicio</PrimaryButton>
          <Text style={sharedStyles.link} onPress={() => navigation.navigate('History')}>Ver historial</Text>
          <Text style={sharedStyles.link} onPress={() => navigation.navigate('Profile')}>Mi perfil</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

