import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BalanceCard } from '../../components/BalanceCard';
import { BottomTabBar } from '../../components/BottomTabBar';
import { EmptyState } from '../../components/EmptyState';
import { AmountCard } from '../../components/AmountCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { ServiceCard } from '../../components/ServiceCard';
import { useAccountStore } from '../../store/accountStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const services = useServiceStore((state) => state.services);
  const balance = useAccountStore((state) => state.balance);
  const accountError = useAccountStore((state) => state.error);
  const accountLoading = useAccountStore((state) => state.isLoading);
  const refreshAccountData = useAccountStore((state) => state.refreshAccountData);
  const selectService = usePaymentStore((state) => state.selectService);
  const userName = 'Ana';
  const totalDue = services.reduce((sum, service) => sum + Math.max(service.amountDue, 0), 0);

  useEffect(() => {
    void refreshAccountData();
  }, [refreshAccountData]);

  function payNow(serviceId: string) {
    selectService(serviceId);
    navigation.navigate('ConfirmPayment', { serviceId });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.fg }]}>Hola, {userName}</Text>
          <Text style={[styles.headerCopy, { color: theme.fg2 }]}>Estos son tus servicios por pagar.</Text>
        </View>

        <View style={styles.balanceSection}>
          <AmountCard
            amountMinor={Math.round(totalDue * 100)}
            label="Total por pagar este mes"
            footer="Tus montos se muestran antes de confirmar cualquier pago."
          />
          <View style={styles.quickActions}>
            <PrimaryButton onPress={() => navigation.navigate('AddService')} size="md">
              Pagar ahora
            </PrimaryButton>
            <PrimaryButton onPress={() => navigation.navigate('Notifications')} size="md" variant="secondary">
              Avisos
            </PrimaryButton>
          </View>
          <BalanceCard balance={balance} error={accountError} loading={accountLoading} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.fg }]}>Por pagar</Text>

        {services.length === 0 ? (
          <EmptyState
            action={<PrimaryButton onPress={() => navigation.navigate('AddService')}>AGREGAR PRIMER SERVICIO</PrimaryButton>}
            message="Agrega luz, internet o celular para verlos aquí."
            title="Aún no tienes servicios"
          />
        ) : (
          <View style={styles.list}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                onPay={() => payNow(service.id)}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
                service={service}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <BottomTabBar active="Home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    ...typography.title,
    fontSize: 24,
  },
  headerCopy: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  header: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: 0,
  },
  balanceSection: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 18,
    paddingHorizontal: spacing.xl,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
