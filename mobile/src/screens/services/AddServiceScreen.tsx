import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { BottomTabBar } from '../../components/BottomTabBar';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { ServiceIconBadge } from '../../components/ServiceIconBadge';
import { TextInput } from '../../components/TextInput';
import { useServiceProviderStore } from '../../store/serviceProviderStore';
import { useServiceStore } from '../../store/serviceStore';
import type { Provider, RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;
type Step = 'list' | 'number' | 'confirm';

export function AddServiceScreen({ navigation }: Props) {
  const error = useServiceProviderStore((state) => state.error);
  const fetchProviders = useServiceProviderStore((state) => state.fetchProviders);
  const isLoading = useServiceProviderStore((state) => state.isLoading);
  const providers = useServiceProviderStore((state) => state.providers);
  const addService = useServiceStore((state) => state.addService);

  const [step, setStep] = useState<Step>('list');
  const [providerId, setProviderId] = useState<string>();
  const [alias, setAlias] = useState('');
  const [reference, setReference] = useState('');
  const [showSavedTip, setShowSavedTip] = useState(false);
  const [validating, setValidating] = useState(false);

  const selectedProvider = providers.find((provider) => provider.id === providerId);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  function selectProvider(provider: Provider) {
    setProviderId(provider.id);
    setStep('number');
  }

  async function goToConfirm() {
    if (reference.replace(/\D/g, '').length < 4) return;
    setValidating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setValidating(false);
    setStep('confirm');
  }

  function save() {
    if (!selectedProvider) return;
    const service = addService(selectedProvider, alias || selectedProvider.displayName, reference);
    setShowSavedTip(true);
    setTimeout(() => {
      navigation.replace('ServiceDetail', { serviceId: service.id });
    }, 1200);
  }

  if (isLoading && providers.length === 0) {
    return (
      <Screen>
        <LoadingState message="Cargando servicios..." />
      </Screen>
    );
  }

  if (error && providers.length === 0) {
    return (
      <Screen>
        <ErrorState message="No pudimos cargar los servicios." onRetry={fetchProviders} />
      </Screen>
    );
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 'list' ? (
          <>
            <Text style={styles.title}>¿Qué servicio quieres pagar?</Text>
            <View style={styles.list}>
              {providers.map((provider) => (
                <Pressable key={provider.id} onPress={() => selectProvider(provider)} style={styles.listItem}>
                  <ServiceIconBadge category={provider.category} />
                  <Text style={styles.listLabel}>
                    {labelForCategory(provider.category)} ({provider.displayName})
                  </Text>
                  <Feather color={colors.textMuted} name="chevron-right" size={20} />
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {step === 'number' && selectedProvider ? (
          <>
            <View style={styles.center}>
              <ServiceIconBadge category={selectedProvider.category} size={72} />
              <Text style={styles.title}>{labelForCategory(selectedProvider.category)} ({selectedProvider.displayName})</Text>
              <Text style={styles.subtitle}>Ingresa tu número de servicio</Text>
            </View>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setReference}
              placeholder="876 090 21 234"
              value={reference}
            />
            <Text style={styles.helper}>¿Dónde lo encuentro?</Text>
            <TextInput onChangeText={setAlias} placeholder="Alias (opcional, ej. Casa)" value={alias} />
            {validating ? <LoadingState message="Validando número..." /> : null}
            <PrimaryButton disabled={reference.length < 4 || validating} loading={validating} onPress={goToConfirm}>
              CONTINUAR
            </PrimaryButton>
            <PrimaryButton onPress={() => setStep('list')} variant="secondary">
              VOLVER
            </PrimaryButton>
          </>
        ) : null}

        {step === 'confirm' && selectedProvider ? (
          <>
            <View style={styles.center}>
              <ServiceIconBadge category={selectedProvider.category} size={72} />
              <Text style={styles.detected}>{selectedProvider.displayName} detectado ✓</Text>
            </View>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>Nombre</Text>
              <Text style={styles.confirmValue}>Usuario demo</Text>
              <Text style={styles.confirmLabel}>Dirección</Text>
              <Text style={styles.confirmValue}>Col. Centro, Chihuahua</Text>
              <Text style={styles.confirmLabel}>Número de servicio</Text>
              <Text style={styles.confirmValue}>{reference}</Text>
            </View>
            {showSavedTip ? (
              <View style={styles.tipCard}>
                <Feather color={colors.textSecondary} name="info" size={18} />
                <Text style={styles.tipText}>Tu servicio quedará guardado para que no tengas que escribirlo nuevamente.</Text>
              </View>
            ) : null}
            <PrimaryButton onPress={save}>GUARDAR SERVICIO</PrimaryButton>
          </>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <BottomTabBar active="AddService" />
    </Screen>
  );
}

function labelForCategory(category: string) {
  const labels: Record<string, string> = {
    ELECTRICITY: 'Luz',
    PHONE: 'Celular',
    INTERNET: 'Internet',
    WATER: 'Agua',
    GAS: 'Gas',
    TV: 'Cable',
    OTHER: 'Otro',
  };
  return labels[category] ?? 'Servicio';
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  confirmCard: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    padding: spacing.xl,
  },
  confirmLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  confirmValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  detected: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  error: {
    color: colors.danger,
    paddingHorizontal: spacing.xl,
  },
  helper: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  listLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    fontWeight: '600',
  },
  screen: {
    flex: 1,
  },
  scroll: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tipCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
