import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { EmptyState } from '../../components/EmptyState';
import { ReceiptCard } from '../../components/ReceiptCard';
import { Screen } from '../../components/Screen';
import { ServiceIconBadge } from '../../components/ServiceIconBadge';
import { usePaymentStore } from '../../store/paymentStore';
import { colors, radius, spacing, typography } from '../../theme';

type Filter = 'all' | 'paid' | 'pending';

export function HistoryScreen() {
  const payments = usePaymentStore((state) => state.payments);
  const [filter, setFilter] = useState<Filter>('paid');

  const filtered = useMemo(() => {
    if (filter === 'all') return payments;
    if (filter === 'paid') return payments.filter((payment) => payment.status === 'SUCCESS');
    return [];
  }, [filter, payments]);

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.tabs}>
        {(
          [
            ['all', 'Todos'],
            ['paid', 'Pagados'],
            ['pending', 'Pendientes'],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setFilter(key)}
            style={[styles.tab, filter === key && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <EmptyState
            message={filter === 'pending' ? 'No tienes pagos pendientes por ahora.' : 'Aquí aparecerán tus pagos.'}
            title="Sin movimientos"
          />
        ) : (
          filtered.map((payment, index) => (
            <View key={payment.id} style={styles.row}>
              <ServiceIconBadge category="OTHER" size={40} />
              <View style={styles.rowBody}>
                <ReceiptCard payment={payment} receiptUnavailable={index === 0} />
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BottomTabBar active="History" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowBody: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  tab: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.successSoft,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  tabTextActive: {
    color: colors.success,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});
