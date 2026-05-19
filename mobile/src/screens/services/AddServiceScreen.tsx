import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useServiceStore } from '../../store/serviceStore';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;

export function AddServiceScreen({ navigation }: Props) {
  const providers = useServiceStore((state) => state.providers);
  const addService = useServiceStore((state) => state.addService);
  const [providerId, setProviderId] = useState(providers[0].id);
  const [alias, setAlias] = useState('');
  const [reference, setReference] = useState('');
  const selectedProvider = providers.find((provider) => provider.id === providerId) ?? providers[0];

  function save() {
    const service = addService(providerId, alias, reference);
    navigation.replace('ServiceDetail', { serviceId: service.id });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: 24 }}>
        <Text style={sharedStyles.title}>Agregar servicio</Text>
        <Text style={sharedStyles.body}>Elige el servicio y escribe el numero de tu recibo.</Text>

        <View style={sharedStyles.card}>
          <Text style={{ color: colors.text, fontSize: 40 }}>{selectedProvider.icon}</Text>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 8 }}>
            {selectedProvider.category} ({selectedProvider.name})
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {providers.map((provider) => (
            <Pressable
              key={provider.id}
              onPress={() => setProviderId(provider.id)}
              style={[
                sharedStyles.providerChip,
                provider.id === providerId && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={{ color: provider.id === providerId ? '#FFFFFF' : colors.text, fontWeight: '800' }}>
                {provider.icon} {provider.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={sharedStyles.label}>Numero</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={setReference}
            placeholder="Numero de servicio"
            style={sharedStyles.input}
            value={reference}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={sharedStyles.label}>Alias</Text>
          <TextInput onChangeText={setAlias} placeholder="Casa" style={sharedStyles.input} value={alias} />
        </View>

        <PrimaryButton disabled={reference.length < 4} onPress={save}>Guardar</PrimaryButton>
      </ScrollView>
    </Screen>
  );
}
