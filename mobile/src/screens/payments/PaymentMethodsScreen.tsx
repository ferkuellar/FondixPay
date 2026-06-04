import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { AlertCard } from '../../components/AlertCard';
import { PaymentMethodCard } from '../../components/PaymentMethodCard';
import { PaymentMethodDemoNotice } from '../../components/PaymentMethodDemoNotice';
import { PaymentMethodEmptyState } from '../../components/PaymentMethodEmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { getProviderReadinessPresentation, isDemoPaymentEnabled } from '../../integrations/providerReadiness';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

export function PaymentMethodsScreen({ navigation, route }: Props) {
  const serviceId = route.params?.serviceId;
  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const selectedPaymentMethodId = usePaymentMethodStore((state) => state.selectedPaymentMethodId);
  const selectPaymentMethod = usePaymentMethodStore((state) => state.selectPaymentMethod);
  const demoPaymentEnabled = isDemoPaymentEnabled();
  const providerUnavailable = getProviderReadinessPresentation();

  function addMethod() {
    navigation.navigate('AddPaymentMethodMock', { serviceId });
  }

  function selectMethod(methodId: string) {
    selectPaymentMethod(methodId);
    if (serviceId) {
      navigation.replace('ConfirmPayment', { serviceId });
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Métodos demo</Text>
          <Text style={styles.subtitle}>
            {demoPaymentEnabled
              ? 'Administra métodos demo para validar el flujo sin operaciones reales.'
              : 'Los métodos de pago estarán disponibles cuando el proveedor transaccional esté aprobado.'}
          </Text>
        </View>
        {demoPaymentEnabled ? <PaymentMethodDemoNotice /> : null}
        {!demoPaymentEnabled ? (
          <AlertCard tone="info" title={providerUnavailable.title} message={providerUnavailable.message} />
        ) : paymentMethods.length === 0 ? (
          <PaymentMethodEmptyState onAdd={addMethod} />
        ) : (
          <View style={styles.list}>
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onPress={() => selectMethod(method.id)}
                selected={method.id === selectedPaymentMethodId}
              />
            ))}
            <PrimaryButton onPress={addMethod} variant="secondary">
              AGREGAR OTRO MÉTODO DEMO
            </PrimaryButton>
          </View>
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
  list: {
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
