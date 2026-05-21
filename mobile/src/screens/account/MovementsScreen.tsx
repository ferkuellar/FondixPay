import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DemoBalanceNotice } from '../../components/DemoBalanceNotice';
import { EmptyState } from '../../components/EmptyState';
import { MovementCard } from '../../components/MovementCard';
import { Screen } from '../../components/Screen';
import { useAccountStore } from '../../store/accountStore';
import { colors, spacing, typography } from '../../theme';

export function MovementsScreen() {
  const error = useAccountStore((state) => state.error);
  const isLoading = useAccountStore((state) => state.isLoading);
  const movements = useAccountStore((state) => state.movements);
  const refreshAccountData = useAccountStore((state) => state.refreshAccountData);

  useEffect(() => {
    void refreshAccountData();
  }, [refreshAccountData]);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <DemoBalanceNotice />
        <Text style={styles.title}>Movimientos demo</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!isLoading && movements.length === 0 ? (
          <EmptyState message="Los pagos y ajustes demo aparecerán aquí cuando existan." title="Sin movimientos" />
        ) : (
          <View style={styles.list}>
            {movements.map((movement) => (
              <MovementCard key={movement.id} movement={movement} />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    ...typography.bodySmall,
    color: colors.danger,
  },
  list: {
    gap: spacing.md,
  },
  scroll: {
    gap: spacing.lg,
    padding: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 20,
  },
});
