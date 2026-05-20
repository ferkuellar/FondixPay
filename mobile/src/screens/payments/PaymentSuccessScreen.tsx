import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SuccessIllustration } from '../../components/SuccessIllustration';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export function PaymentSuccessScreen({ navigation, route }: Props) {
  const payment = usePaymentStore((state) => state.getPayment(route.params.paymentId));

  return (
    <Screen>
      <View style={styles.container}>
        <SuccessIllustration />
        <Text style={styles.title}>¡Ya quedó pagado!</Text>
        <Text style={styles.body}>
          {payment
            ? `Tu pago de ${payment.providerName} por $${payment.amount.toFixed(0)} se guardó correctamente.`
            : 'Tu pago se guardó correctamente.'}
        </Text>
        {payment ? (
          <>
            <Text style={styles.refLabel}>Número de referencia</Text>
            <Text style={styles.refValue}>{payment.folio}</Text>
          </>
        ) : null}
        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.replace('History')} variant="secondary">
            VER COMPROBANTE
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.replace('Home')}>LISTO</PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.xxxl,
    width: '100%',
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  refLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
  refValue: {
    ...typography.heading,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});
