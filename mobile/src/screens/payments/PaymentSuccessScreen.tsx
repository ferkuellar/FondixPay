import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { ReceiptStatusBadge } from '../../components/ReceiptStatusBadge';
import { Screen } from '../../components/Screen';
import { SuccessIllustration } from '../../components/SuccessIllustration';
import { useNotificationPreferencesStore } from '../../store/notificationPreferencesStore';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';
import { formatMoneyMinor } from '../../utils/money';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export function PaymentSuccessScreen({ navigation, route }: Props) {
  const payment = usePaymentStore((state) => state.getPayment(route.params.paymentId));
  const whatsappReceiptEnabled = useNotificationPreferencesStore((state) => Boolean(state.whatsappReceipt?.enabled));

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
        <SuccessIllustration />
        <Text style={styles.title}>Pago de prueba completado</Text>
        <Text style={styles.body}>
          {payment
            ? `La simulación de ${payment.providerName} por ${formatMoneyMinor(payment.totalMinor)} se guardó en modo prueba. No hubo operación bancaria real.`
            : 'La simulación se guardó en modo prueba. No hubo operación bancaria real.'}
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
                <Text style={styles.totalLabel}>Total simulado</Text>
                <Text style={styles.totalValue}>{formatMoneyMinor(payment.totalMinor)}</Text>
              </View>
            </View>
            {payment.paymentMethodLabel ? (
              <View style={styles.methodBox}>
                <Text style={styles.lineLabel}>Método demo usado</Text>
                <Text style={styles.lineValue}>{payment.paymentMethodLabel}</Text>
                {payment.paymentMethodIsMock ? <Text style={styles.mockCopy}>Método de prueba · sin operación bancaria</Text> : null}
              </View>
            ) : null}
            <Text style={styles.refLabel}>Referencia de prueba</Text>
            <Text style={styles.refValue}>{payment.folio}</Text>
            <View style={styles.proofBox}>
              <View style={styles.proofHeader}>
                <View style={styles.proofCopy}>
                  <Text style={styles.proofTitle}>Comprobante de prueba listo</Text>
                  <Text style={styles.proofBody}>
                    Consulta el detalle de esta simulación con desglose y referencias de prueba.
                  </Text>
                </View>
                <ReceiptStatusBadge status={payment.receiptStatus} />
              </View>
              <Text style={styles.mockCopy}>Documento demo. No tiene validez fiscal ni financiera.</Text>
            </View>
            <View style={styles.whatsappBox}>
              <Text style={styles.whatsappTitle}>
                {whatsappReceiptEnabled ? 'Entrega demo de comprobante' : 'Canales autorizados en producción'}
              </Text>
              <Text style={styles.whatsappBody}>
                {whatsappReceiptEnabled
                  ? 'Esta entrega es simulada para demo. No confirma envío por WhatsApp real.'
                  : 'En producción podrás recibir comprobantes por canales autorizados.'}
              </Text>
            </View>
          </>
        ) : null}
        <View style={styles.actions}>
          <PrimaryButton
            onPress={() =>
              payment ? navigation.replace('ReceiptDetail', { paymentId: payment.id }) : navigation.replace('History')
            }
            variant="secondary"
          >
            VER COMPROBANTE DEMO
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.replace('Home')}>CONTINUAR DEMO</PrimaryButton>
        </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.xl,
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
    width: '100%',
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
  proofBody: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  proofBox: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    width: '100%',
  },
  proofCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  proofHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  proofTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
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
  scroll: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
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
  whatsappBody: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  whatsappBox: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.md,
    width: '100%',
  },
  whatsappTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
