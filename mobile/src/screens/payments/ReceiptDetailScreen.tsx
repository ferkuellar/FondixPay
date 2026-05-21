import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ReceiptDetailCard } from '../../components/ReceiptDetailCard';
import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

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
        <ReceiptDetailCard payment={payment} />
        {payment.receiptStatus !== 'generated' ? (
          <View style={styles.nextStep}>
            <Text style={styles.nextTitle}>Qué hacer ahora</Text>
            <Text style={styles.nextBody}>
              {payment.receiptStatus === 'pending'
                ? 'Revisa el estado antes de intentar pagar otra vez.'
                : 'No hay comprobante confirmado para este intento. Usa la referencia mock si necesitas ayuda.'}
            </Text>
          </View>
        ) : null}
        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.navigate('History')} variant="secondary">
            VOLVER
          </PrimaryButton>
          <PrimaryButton disabled onPress={() => undefined} variant="secondary">
            DESCARGAR PRÓXIMAMENTE
          </PrimaryButton>
        </View>
      </ScrollView>
    </Screen>
  );
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
