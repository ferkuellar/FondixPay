import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { HistoryFilterTabs } from '../../components/HistoryFilterTabs';
import { LoadingState } from '../../components/LoadingState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { TransactionHistoryCard } from '../../components/TransactionHistoryCard';
import { usePaymentStore } from '../../store/paymentStore';
import { spacing } from '../../theme';
import type { RootStackParamList, TransactionHistoryFilter } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const error = usePaymentStore((state) => state.historyError);
  const isLoading = usePaymentStore((state) => state.isHistoryLoading);
  const payments = usePaymentStore((state) => state.payments);
  const [filter, setFilter] = useState<TransactionHistoryFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return payments;
    if (filter === 'pending') return payments.filter((payment) => payment.status === 'pending' || payment.status === 'timeout');
    if (filter === 'failed') return payments.filter((payment) => payment.status === 'failed' || payment.status === 'duplicate_blocked');
    return payments.filter((payment) => payment.status === 'succeeded');
  }, [filter, payments]);

  return (
    <Screen padded={false} style={styles.screen}>
      <HistoryFilterTabs onSelect={setFilter} selected={filter} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading ? <LoadingState message="Cargando historial..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && payments.length === 0 ? (
          <EmptyState
            action={<PrimaryButton onPress={() => navigation.navigate('AddService')}>Agregar servicio</PrimaryButton>}
            emoji="🧾"
            message="Simula tu primer pago para verlo aquí. Comienza agregando un servicio."
            title="Aún no hay movimientos"
          />
        ) : null}
        {!isLoading && !error && payments.length > 0 && filtered.length === 0 ? (
          <EmptyState
            message="No hay pagos demo que coincidan con este filtro."
            title="Sin resultados"
          />
        ) : null}
        {!isLoading && !error ? (
          filtered.map((payment, index) => (
            <TransactionHistoryCard
              key={`${payment.id}-${index}`}
              onPress={() => navigation.navigate('ReceiptDetail', { paymentId: payment.id })}
              payment={payment}
            />
          ))
        ) : null}
      </ScrollView>
      <BottomTabBar active="History" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
});
