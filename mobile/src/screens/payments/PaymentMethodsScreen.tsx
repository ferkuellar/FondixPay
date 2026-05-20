import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PaymentMethodCard } from '../../components/PaymentMethodCard';
import { PaymentMethodDemoNotice } from '../../components/PaymentMethodDemoNotice';
import { PaymentMethodEmptyState } from '../../components/PaymentMethodEmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

export function PaymentMethodsScreen({ navigation, route }: Props) {
  const serviceId = route.params?.serviceId;
  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const selectedPaymentMethodId = usePaymentMethodStore((state) => state.selectedPaymentMethodId);
  const selectPaymentMethod = usePaymentMethodStore((state) => state.selectPaymentMethod);

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
          <Text style={styles.title}>Métodos de pago</Text>
          <Text style={styles.subtitle}>Administra métodos demo para validar el flujo sin cargos reales.</Text>
        </View>
        <PaymentMethodDemoNotice />
        {paymentMethods.length === 0 ? (
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
