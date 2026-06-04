import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ReceiptProofCard } from '../../components/ReceiptProofCard';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, spacing, typography } from '../../theme';
import type { Payment, ReceiptProof, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ReceiptDetail'>;

export function ReceiptDetailScreen({ navigation, route }: Props) {
  const payment = usePaymentStore((state) => state.getPayment(route.params.paymentId));

  if (!payment) {
    return (
      <Screen>
        <EmptyState
          message="El historial local no conserva este detalle. Vuelve al historial para revisar los registros disponibles."
          title="Detalle no disponible"
        />
        <PrimaryButton onPress={() => navigation.replace('History')} variant="secondary">
          VOLVER AL HISTORIAL
        </PrimaryButton>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ReceiptProofCard proof={toLocalProof(payment)} />
        {payment.receiptStatus !== 'generated' ? (
          <View style={styles.nextStep}>
            <Text style={styles.nextTitle}>Qué hacer ahora</Text>
            <Text style={styles.nextBody}>
              {payment.receiptStatus === 'pending'
                ? 'Revisa el estado demo antes de repetir la simulación.'
                : 'No hay comprobante de prueba disponible para este intento. Usa la referencia demo si necesitas ayuda.'}
            </Text>
          </View>
        ) : null}
        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.navigate('History')} variant="secondary">
            VOLVER
          </PrimaryButton>
          <PrimaryButton
            disabled={payment.receiptStatus !== 'generated'}
            onPress={() => void shareProof(payment)}
            variant="secondary"
          >
            COMPARTIR COMPROBANTE DE PRUEBA
          </PrimaryButton>
        </View>
      </ScrollView>
    </Screen>
  );
}

function toLocalProof(payment: Payment): ReceiptProof {
  const receiptPending = payment.receiptStatus === 'pending';
  const receiptUnavailable = payment.receiptStatus === 'unavailable' || payment.receiptStatus === 'voided';
  return {
    id: `local-proof-${payment.id}`,
    paymentId: payment.id,
    receiptId: payment.receiptId,
    serviceName: payment.serviceName,
    serviceProviderName: payment.providerName,
    serviceReferenceMasked: 'Referencia guardada',
    amountMinor: payment.amountMinor,
    feeMinor: payment.feeMinor,
    totalMinor: payment.totalMinor,
    currency: payment.currency,
    paymentStatus: payment.status,
    providerStatus: payment.status === 'succeeded' ? 'mock_succeeded' : payment.status,
    receiptStatus: payment.receiptStatus,
    proofStatus: receiptPending ? 'pending' : receiptUnavailable ? 'unavailable' : 'confirmed',
    cardLabelSafe: payment.paymentMethodLabel,
    providerReference: payment.mockReference,
    internalReference: payment.folio,
    correlationId: payment.correlationId,
    isMock: true,
    isSandbox: false,
    issuedAt: payment.paidAt,
    confirmedAt: payment.status === 'succeeded' ? payment.paidAt : undefined,
    disclaimer: 'Comprobante de prueba. No tiene validez fiscal ni financiera.',
  };
}

async function shareProof(payment: Payment) {
  await Share.share({
    message: [
      'FondixPay - comprobante de prueba',
      `Servicio: ${payment.providerName} - ${payment.serviceName}`,
      `Total simulado: ${payment.currency} ${(payment.totalMinor / 100).toFixed(2)}`,
      `Estado: ${payment.status}`,
      `Referencia: ${payment.folio}`,
      'Documento demo. No tiene validez fiscal ni financiera.',
    ].join('\n'),
  });
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  nextBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  nextStep: {
    gap: spacing.xs,
  },
  nextTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 18,
  },
  scroll: {
    gap: spacing.lg,
    padding: spacing.xl,
  },
});
