import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useAppStore } from '../store/appStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;

export function AddServiceScreen({ navigation }: Props) {
  const providers = useAppStore((state) => state.providers);
  const addService = useAppStore((state) => state.addService);
  const [providerId, setProviderId] = useState(providers[0].id);
  const [alias, setAlias] = useState('');
  const [reference, setReference] = useState('');

  function save() {
    const service = addService(providerId, alias || 'Servicio de casa', reference);
    navigation.replace('ServiceDetail', { serviceId: service.id });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <Text style={sharedStyles.title}>Guardar servicio</Text>
        <Text style={sharedStyles.body}>Elige el servicio y escribe el numero que aparece en tu recibo.</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {providers.map((provider) => (
            <Pressable
              key={provider.id}
              onPress={() => setProviderId(provider.id)}
              style={[
                sharedStyles.card,
                { paddingVertical: 12 },
                provider.id === providerId && { borderColor: colors.primary, borderWidth: 2 },
              ]}
            >
              <Text style={{ color: colors.text, fontWeight: '800' }}>{provider.name}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput onChangeText={setAlias} placeholder="Ej. Luz de casa" style={sharedStyles.input} value={alias} />
        <TextInput
          keyboardType="number-pad"
          onChangeText={setReference}
          placeholder="Numero de servicio"
          style={sharedStyles.input}
          value={reference}
        />

        <PrimaryButton disabled={reference.length < 4} onPress={save}>Guardar servicio</PrimaryButton>
      </ScrollView>
    </Screen>
  );
}

