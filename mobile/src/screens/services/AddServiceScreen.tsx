import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useServiceProviderStore } from '../../store/serviceProviderStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;

export function AddServiceScreen({ navigation }: Props) {
  const error = useServiceProviderStore((state) => state.error);
  const fetchProviders = useServiceProviderStore((state) => state.fetchProviders);
  const isLoading = useServiceProviderStore((state) => state.isLoading);
  const providers = useServiceProviderStore((state) => state.providers);
  const addService = useServiceStore((state) => state.addService);
  const [providerId, setProviderId] = useState<string>();
  const [alias, setAlias] = useState('');
  const [reference, setReference] = useState('');
  const selectedProvider = providers.find((provider) => provider.id === providerId) ?? providers[0];

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    if (!providerId && providers.length > 0) {
      setProviderId(providers[0].id);
    }
  }, [providerId, providers]);

  function save() {
    if (!selectedProvider) {
      return;
    }
    const service = addService(selectedProvider, alias, reference);
    navigation.replace('ServiceDetail', { serviceId: service.id });
  }

  if (isLoading && providers.length === 0) {
    return (
      <Screen>
        <View style={[sharedStyles.container, { justifyContent: 'center' }]}>
          <Text style={sharedStyles.title}>Cargando servicios...</Text>
        </View>
      </Screen>
    );
  }

  if (error && providers.length === 0) {
    return (
      <Screen>
        <View style={[sharedStyles.container, { justifyContent: 'center' }]}>
          <Text style={sharedStyles.title}>No pudimos cargar los servicios.</Text>
          <Text style={sharedStyles.body}>Intenta de nuevo.</Text>
          <PrimaryButton disabled={isLoading} onPress={fetchProviders}>
            {isLoading ? 'Cargando...' : 'Reintentar'}
          </PrimaryButton>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: 24 }}>
        <Text style={sharedStyles.title}>¿Que quieres pagar?</Text>
        <Text style={sharedStyles.body}>Elige un servicio y escribe el numero de tu recibo.</Text>

        {selectedProvider ? (
          <View style={sharedStyles.card}>
            <Text style={{ color: colors.text, fontSize: 40 }}>{selectedProvider.icon}</Text>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 8 }}>
              {selectedProvider.displayName}
            </Text>
            <Text style={sharedStyles.body}>{labelForCategory(selectedProvider.category)}</Text>
          </View>
        ) : null}

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
                {provider.icon} {provider.displayName}
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

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        <PrimaryButton disabled={!selectedProvider || reference.length < 4} onPress={save}>Guardar</PrimaryButton>
      </ScrollView>
    </Screen>
  );
}

function labelForCategory(category: string) {
  const labels: Record<string, string> = {
    ELECTRICITY: 'Luz',
    PHONE: 'Telefono',
    INTERNET: 'Internet',
    WATER: 'Agua',
    GAS: 'Gas',
    TV: 'Cable',
    OTHER: 'Otro',
  };
  return labels[category] ?? 'Servicio';
}
