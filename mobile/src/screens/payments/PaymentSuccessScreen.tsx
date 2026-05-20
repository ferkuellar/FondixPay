import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SuccessIllustration } from '../../components/SuccessIllustration';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';
import { formatMoneyMinor } from '../../utils/money';

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
            ? `Tu pago mock/dev de ${payment.providerName} por ${formatMoneyMinor(payment.totalMinor)} se guardó correctamente.`
            : 'Tu pago se guardó correctamente.'}
        </Text>
        {payment ? (
          <>
            <View style={styles.breakdown}>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Monto del servicio</Text>
                <Text style={styles.lineValue}>{formatMoneyMinor(payment.amountMinor)}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>{payment.feeLabel}</Text>
                <Text style={styles.lineValue}>{formatMoneyMinor(payment.feeMinor)}</Text>
              </View>
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Total pagado</Text>
                <Text style={styles.totalValue}>{formatMoneyMinor(payment.totalMinor)}</Text>
              </View>
            </View>
            {payment.paymentMethodLabel ? (
              <View style={styles.methodBox}>
                <Text style={styles.lineLabel}>Método usado</Text>
                <Text style={styles.lineValue}>{payment.paymentMethodLabel}</Text>
                {payment.paymentMethodIsMock ? <Text style={styles.mockCopy}>Método demo · sin cargo real</Text> : null}
              </View>
            ) : null}
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
  breakdown: {
    backgroundColor: colors.bgSubtle,
    borderRadius: 12,
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.lg,
    width: '100%',
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
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  lineValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  methodBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.md,
    width: '100%',
  },
  mockCopy: {
    ...typography.caption,
    color: colors.textSecondary,
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
  totalLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  totalLine: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  totalValue: {
    ...typography.heading,
    color: colors.success,
  },
});
