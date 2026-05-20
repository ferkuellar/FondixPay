import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { ServiceCard } from '../../components/ServiceCard';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const services = useServiceStore((state) => state.services);
  const selectService = usePaymentStore((state) => state.selectService);
  const userName = 'Ana';
  const totalDue = services.reduce((sum, service) => sum + Math.max(service.amountDue, 0), 0);

  function payNow(serviceId: string) {
    selectService(serviceId);
    navigation.navigate('ConfirmPayment', { serviceId });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {userName} 👋</Text>
        </View>

        <Text style={styles.sectionTitle}>Pagos pendientes</Text>

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

        {services.length > 0 ? (
          <View style={[styles.summaryCard, shadows.card]}>
            <View>
              <Text style={styles.summaryLabel}>Total a pagar este mes</Text>
              <Text style={styles.summaryAmount}>${totalDue.toFixed(0)}</Text>
            </View>
            <Text style={styles.summaryEmoji}>👛</Text>
          </View>
        ) : null}
      </ScrollView>
      <BottomTabBar active="Home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    ...typography.title,
    color: colors.textPrimary,
    fontSize: 24,
  },
  header: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: 0,
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
    color: colors.textPrimary,
    fontSize: 18,
    paddingHorizontal: spacing.xl,
  },
  summaryAmount: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
  },
  summaryEmoji: {
    fontSize: 40,
  },
  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
