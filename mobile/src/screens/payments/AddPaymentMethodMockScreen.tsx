import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PaymentMethodDemoNotice } from '../../components/PaymentMethodDemoNotice';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { usePaymentMethodStore } from '../../store/paymentMethodStore';
import { colors, radius, spacing, typography } from '../../theme';
import type { PaymentMethodType, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPaymentMethodMock'>;

const options: Array<{
  type: PaymentMethodType;
  title: string;
  description: string;
}> = [
  {
    type: 'card_mock',
    title: 'Tarjeta demo',
    description: 'Simula una tarjeta crédito/débito. No ingreses número real, vencimiento ni CVV.',
  },
];

export function AddPaymentMethodMockScreen({ navigation, route }: Props) {
  const addMockPaymentMethod = usePaymentMethodStore((state) => state.addMockPaymentMethod);
  const serviceId = route.params?.serviceId;

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
          <Text style={styles.title}>Agregar tarjeta demo</Text>
          <Text style={styles.subtitle}>Prueba el flujo card-only sin capturar tarjeta, CVV ni datos reales.</Text>
        </View>
        <PaymentMethodDemoNotice />
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
