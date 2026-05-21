import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BalanceCard } from '../../components/BalanceCard';
import { DemoBalanceNotice } from '../../components/DemoBalanceNotice';
import { EmptyState } from '../../components/EmptyState';
import { MovementCard } from '../../components/MovementCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAccountStore } from '../../store/accountStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

export function AccountScreen({ navigation }: Props) {
  const balance = useAccountStore((state) => state.balance);
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
        <BalanceCard balance={balance} error={error} loading={isLoading} />
        <DemoBalanceNotice />
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Movimientos recientes</Text>
          <PrimaryButton onPress={() => navigation.navigate('Movements')} size="md" variant="secondary">
            VER TODOS
          </PrimaryButton>
        </View>
        {movements.length === 0 && !isLoading ? (
          <EmptyState message="Aún no hay movimientos demo para mostrar." title="Sin movimientos demo" />
        ) : (
          <View style={styles.list}>
            {movements.slice(0, 3).map((movement) => (
              <MovementCard key={movement.id} movement={movement} />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  list: {
    gap: spacing.md,
  },
  scroll: {
    gap: spacing.lg,
    padding: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
  },
});
