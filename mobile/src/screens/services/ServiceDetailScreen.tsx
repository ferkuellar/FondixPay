import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { AmountDisplay } from '../../components/AmountDisplay';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SecondaryButton } from '../../components/SecondaryButton';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors, radius, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';
import { calculatePaymentBreakdown, formatMoneyMinor } from '../../utils/money';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetail'>;

export function ServiceDetailScreen({ navigation, route }: Props) {
  const service = useServiceStore((state) => state.getService(route.params.serviceId));
  const removeService = useServiceStore((state) => state.removeService);
  const selectService = usePaymentStore((state) => state.selectService);
  const selectedPaymentMethod = usePaymentMethodStore((state) => state.getSelectedPaymentMethod());

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
  const breakdown = calculatePaymentBreakdown(currentService.amountDue);

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
          <AmountDisplay amount={breakdown.totalMinor / 100} label="Total final" />
          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.label}>Monto del servicio</Text>
              <Text style={styles.breakdownValue}>{formatMoneyMinor(breakdown.amountMinor)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.label}>{breakdown.feeLabel}</Text>
              <Text style={styles.breakdownValue}>{formatMoneyMinor(breakdown.feeMinor)}</Text>
            </View>
            <Text style={styles.trustCopy}>Te mostraremos siempre la comisión antes de pagar.</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de servicio</Text>
            <Text style={styles.value}>{currentService.reference}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Periodo</Text>
            <Text style={styles.value}>May 2026</Text>
          </View>
          <Text style={styles.methodTitle}>Método de pago</Text>
          {selectedPaymentMethod ? (
            <View style={styles.methodSelected}>
              <View style={styles.radioSelected} />
              <View style={styles.methodCopy}>
                <Text style={styles.methodText}>{selectedPaymentMethod.label}</Text>
                <Text style={styles.methodDescription}>{selectedPaymentMethod.description}</Text>
              </View>
              <Text style={styles.mockBadge}>DEMO</Text>
            </View>
          ) : (
            <View style={styles.methodPending}>
              <View style={styles.radio} />
              <View style={styles.methodCopy}>
                <Text style={styles.methodText}>Método pendiente</Text>
                <Text style={styles.methodDescription}>Agrega una tarjeta demo antes de confirmar.</Text>
              </View>
            </View>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate(selectedPaymentMethod ? 'PaymentMethods' : 'AddPaymentMethodMock', {
                serviceId: currentService.id,
              })
            }
            style={styles.methodRow}
          >
            <View style={styles.radio} />
            <Text style={styles.methodText}>{selectedPaymentMethod ? 'Cambiar tarjeta demo' : 'Agregar tarjeta demo'}</Text>
            <Feather color={colors.primary} name="plus" size={18} />
          </Pressable>
        </View>

        <Text style={styles.secure}>
          <Feather color={colors.success} name="shield" size={14} /> No se realiza ningún cargo sin tu confirmación.
        </Text>

        <View style={styles.actions}>
          <PrimaryButton disabled={currentService.amountDue <= 0} onPress={pay} variant="primary">
            Pagar {formatMoneyMinor(breakdown.totalMinor)}
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
  breakdown: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    gap: spacing.sm,
    padding: spacing.md,
  },
  breakdownRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
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
  methodCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  methodDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  methodPending: {
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
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
  trustCopy: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  mockBadge: {
    color: colors.primary,
    fontWeight: '800',
  },
});
