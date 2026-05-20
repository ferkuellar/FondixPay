import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AmountDisplay } from '../../components/AmountDisplay';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SecondaryButton } from '../../components/SecondaryButton';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors, radius, spacing, typography } from '../../theme';
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
          <PrimaryButton onPress={() => navigation.replace('Home')}>VOLVER AL INICIO</PrimaryButton>
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
      <View style={styles.container}>
        <View style={styles.card}>
          <AmountDisplay amount={currentService.amountDue} />
          <View style={styles.row}>
            <Text style={styles.label}>Número de servicio</Text>
            <Text style={styles.value}>{currentService.reference}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Periodo</Text>
            <Text style={styles.value}>May 2026</Text>
          </View>
          <Text style={styles.methodTitle}>Método de pago</Text>
          <View style={styles.methodSelected}>
            <View style={styles.radioSelected} />
            <Text style={styles.methodText}>Tarjeta demo **** 9021</Text>
            <Text style={styles.visa}>VISA</Text>
          </View>
          <View style={styles.methodRow}>
            <View style={styles.radio} />
            <Text style={styles.methodText}>Nueva tarjeta</Text>
            <Feather color={colors.primary} name="plus" size={18} />
          </View>
        </View>

        <Text style={styles.secure}>
          <Feather color={colors.success} name="shield" size={14} /> Pago 100% seguro (demo)
        </Text>

        <View style={styles.actions}>
          <PrimaryButton disabled={currentService.amountDue <= 0} onPress={pay} variant="primary">
            PAGAR AHORA
          </PrimaryButton>
          <SecondaryButton onPress={remove}>Quitar servicio</SecondaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: 'auto',
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  methodRow: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  methodSelected: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  methodText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  methodTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  radio: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 18,
    width: 18,
  },
  row: {
    gap: spacing.xs,
  },
  secure: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  visa: {
    color: colors.primary,
    fontWeight: '800',
  },
});
