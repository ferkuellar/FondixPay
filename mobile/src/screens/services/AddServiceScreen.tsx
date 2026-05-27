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
import { useServiceCatalogStore } from '../../store/serviceCatalogStore';
import { useServiceStore } from '../../store/serviceStore';
import type { Provider, RootStackParamList, ServiceCatalogItem } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;
type Step = 'list' | 'number' | 'confirm';

export function AddServiceScreen({ navigation }: Props) {
  const error = useServiceCatalogStore((state) => state.error);
  const fetchServices = useServiceCatalogStore((state) => state.fetchServices);
  const isLoading = useServiceCatalogStore((state) => state.isLoading);
  const services = useServiceCatalogStore((state) => state.services);
  const addService = useServiceStore((state) => state.addService);

  const [step, setStep] = useState<Step>('list');
  const [serviceId, setServiceId] = useState<string>();
  const [alias, setAlias] = useState('');
  const [reference, setReference] = useState('');
  const [showSavedTip, setShowSavedTip] = useState(false);
  const [validating, setValidating] = useState(false);

  const selectedService = services.find((service) => service.id === serviceId);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function selectService(service: ServiceCatalogItem) {
    if (!service.payableInMobile) return;
    setServiceId(service.id);
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
    if (!selectedService) return;
    const selectedProvider = providerFromCatalogItem(selectedService);
    const service = addService(selectedProvider, alias || selectedProvider.displayName, reference);
    setShowSavedTip(true);
    setTimeout(() => {
      navigation.replace('ServiceDetail', { serviceId: service.id });
    }, 1200);
  }

  if (isLoading && services.length === 0) {
    return (
      <Screen>
        <LoadingState message="Cargando servicios..." />
      </Screen>
    );
  }

  if (error && services.length === 0) {
    return (
      <Screen>
        <ErrorState message="No pudimos cargar los servicios disponibles." onRetry={() => fetchServices()} />
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
              {services.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>Aún no tenemos servicios disponibles para tu ubicación.</Text>
                  <Text style={styles.emptyText}>
                    Estamos habilitando servicios conforme se confirme la cobertura operativa del proveedor.
                  </Text>
                </View>
              ) : null}
              {services.map((service) => (
                <Pressable key={service.id} onPress={() => selectService(service)} style={styles.listItem}>
                  <ServiceIconBadge category={service.category} />
                  <Text style={styles.listLabel}>
                    {labelForCategory(service.category)} ({service.displayName})
                  </Text>
                  <Feather color={colors.textMuted} name="chevron-right" size={20} />
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {step === 'number' && selectedService ? (
          <>
            <View style={styles.center}>
              <ServiceIconBadge category={selectedService.category} size={72} />
              <Text style={styles.title}>{labelForCategory(selectedService.category)} ({selectedService.displayName})</Text>
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

        {step === 'confirm' && selectedService ? (
          <>
            <View style={styles.center}>
              <ServiceIconBadge category={selectedService.category} size={72} />
              <Text style={styles.detected}>{selectedService.displayName} detectado ✓</Text>
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
    electricity: 'Luz',
    PHONE: 'Celular',
    mobile_topup_or_bill: 'Celular',
    INTERNET: 'Internet',
    internet: 'Internet',
    telecom: 'Telecom',
    WATER: 'Agua',
    water: 'Agua',
    GAS: 'Gas',
    gas: 'Gas',
    TV: 'Cable',
    government: 'Gobierno',
    OTHER: 'Otro',
    other: 'Otro',
  };
  return labels[category] ?? 'Servicio';
}

function providerFromCatalogItem(service: ServiceCatalogItem): Provider {
  return {
    id: service.id,
    name: service.slug,
    displayName: service.displayName,
    category: service.category,
    iconKey: service.iconKey,
    integrationType: 'CATALOG',
    isActive: service.payableInMobile,
    sortOrder: 100,
    icon: iconFor(service.iconKey),
  };
}

function iconFor(iconKey: string) {
  const icons: Record<string, string> = {
    electricity: '⚡',
    phone: '📱',
    internet: '📶',
    water: '💧',
    gas: '🔥',
    tv: '📺',
  };
  return icons[iconKey] ?? '💳';
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
  emptyCard: {
    backgroundColor: colors.bgSubtle,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
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
