import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { AlertCard } from '../../components/AlertCard';
import { PaymentMethodDemoNotice } from '../../components/PaymentMethodDemoNotice';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { getProviderReadinessPresentation, isDemoPaymentEnabled } from '../../integrations/providerReadiness';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { colors, radius, spacing, typography } from '../../theme';
import type { PaymentMethodType, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPaymentMethodMock'>;

const options: {
  type: PaymentMethodType;
  title: string;
  description: string;
}[] = [
  {
    type: 'card_mock',
    title: 'Método demo',
    description: 'Simula un método de pago. No ingreses número real, vencimiento ni CVV.',
  },
];

export function AddPaymentMethodMockScreen({ navigation, route }: Props) {
  const addMockPaymentMethod = usePaymentMethodStore((state) => state.addMockPaymentMethod);
  const serviceId = route.params?.serviceId;
  const demoPaymentEnabled = isDemoPaymentEnabled();
  const providerUnavailable = getProviderReadinessPresentation();

  function add(type: PaymentMethodType) {
    addMockPaymentMethod(type);
    if (serviceId) {
      navigation.replace('ConfirmPayment', { serviceId });
      return;
    }
    navigation.replace('PaymentMethods', {});
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{demoPaymentEnabled ? 'Agregar método demo' : 'Métodos de pago no disponibles'}</Text>
          <Text style={styles.subtitle}>
            {demoPaymentEnabled
              ? 'Prueba el flujo sin capturar tarjeta, CVV ni datos reales.'
              : 'El alta de métodos queda bloqueada hasta tener proveedor transaccional aprobado.'}
          </Text>
        </View>
        {demoPaymentEnabled ? <PaymentMethodDemoNotice /> : null}
        {demoPaymentEnabled ? (
          <View style={styles.options}>
            {options.map((option) => (
              <View key={option.type} style={styles.option}>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <PrimaryButton onPress={() => add(option.type)} size="md">
                  AGREGAR
                </PrimaryButton>
              </View>
            ))}
          </View>
        ) : (
          <>
            <AlertCard tone="info" title={providerUnavailable.title} message={providerUnavailable.message} />
            <PrimaryButton onPress={() => navigation.goBack()} variant="secondary">
              VOLVER
            </PrimaryButton>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  option: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  optionCopy: {
    gap: spacing.xs,
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  optionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  options: {
    gap: spacing.md,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
