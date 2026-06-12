import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { BalanceCard } from '../../components/BalanceCard';
import { BottomTabBar } from '../../components/BottomTabBar';
import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { ServiceCard } from '../../components/ServiceCard';
import { StateSelectorCard } from '../../components/StateSelectorCard';
import { useAccountStore } from '../../store/accountStore';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useServiceStore } from '../../store/serviceStore';
import { colors, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const QUICK_PAY = [
  { label: 'Luz', icon: 'zap' as const, color: colors.service.luz },
  { label: 'Agua', icon: 'droplet' as const, color: colors.service.agua },
  { label: 'Internet', icon: 'wifi' as const, color: colors.service.internet },
  { label: 'Celular', icon: 'smartphone' as const, color: colors.service.celular },
] as const;

function currentGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function HomeScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const services = useServiceStore((state) => state.services);
  const balance = useAccountStore((state) => state.balance);
  const accountError = useAccountStore((state) => state.error);
  const accountLoading = useAccountStore((state) => state.isLoading);
  const refreshAccountData = useAccountStore((state) => state.refreshAccountData);
  const selectService = usePaymentStore((state) => state.selectService);
  const user = useAuthStore((state) => state.user);

  const displayName = user?.name?.trim() || 'Usuario';
  const totalDue = services.reduce((sum, s) => sum + Math.max(s.amountDue, 0), 0);
  const urgentCount = services.filter((s) => {
    const due = s.dueText.toLowerCase();
    return s.amountDue > 0 && (due.includes('hoy') || due.includes('vence en 1') || due.includes('vence en 2') || due.includes('vence en 3'));
  }).length;

  const totalFormatted =
    '$' + totalDue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    void refreshAccountData();
  }, [refreshAccountData]);

  function payNow(serviceId: string) {
    selectService(serviceId);
    navigation.navigate('ConfirmPayment', { serviceId });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={styles.headerLeft}
            accessibilityRole="button"
            accessibilityLabel="Ver perfil"
          >
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarInitial}>{displayName[0]}</Text>
            </View>
            <View>
              <Text style={[styles.greeting, { color: theme.fg2 }]}>{currentGreeting()}</Text>
              <Text style={[styles.displayName, { color: theme.fg }]}>{displayName}</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.iconBtn, { borderColor: theme.border }]}
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
          >
            <Feather name="bell" size={20} color={theme.fg} />
          </Pressable>
        </View>

        {/* ── Total demo card ── */}
        <View style={styles.section}>
          <View style={[styles.totalCard, { backgroundColor: theme.primary }]}>
            <View style={styles.totalCardGlow} />
            <Text style={styles.totalLabel}>Total demo este mes</Text>
            <Text style={styles.totalAmount}>{totalFormatted}</Text>
            {urgentCount > 0 && (
              <View style={styles.urgentRow}>
                <Feather name="alert-triangle" size={13} color="rgba(255,255,255,0.9)" />
                <Text style={styles.urgentText}>
                  {urgentCount} servicio{urgentCount > 1 ? 's' : ''} vence{urgentCount > 1 ? 'n' : ''} pronto
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Simulación rápida grid ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.fg }]}>Simulación rápida</Text>
            <Pressable onPress={() => navigation.navigate('AddService')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>Ver todo</Text>
            </Pressable>
          </View>
          <View style={styles.quickGrid}>
            {QUICK_PAY.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => navigation.navigate('AddService')}
                style={[styles.quickTile, { backgroundColor: theme.surface }]}
                accessibilityRole="button"
                accessibilityLabel={`Simular ${item.label}`}
              >
                <View style={[styles.quickIcon, { backgroundColor: `${item.color}22` }]}>
                  <Feather name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={[styles.quickLabel, { color: theme.fg }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <StateSelectorCard />
        </View>

        {/* ── Balance card ── */}
        <View style={styles.section}>
          <BalanceCard balance={balance} error={accountError} loading={accountLoading} />
        </View>

        {/* ── Servicios demo ── */}
        <View style={styles.sectionHeader2}>
          <Text style={[styles.sectionTitle, { color: theme.fg }]}>Servicios demo</Text>
          {services.length > 0 && (
            <Text style={[styles.countLabel, { color: theme.fg3 }]}>
              {services.length} servicio{services.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {services.length === 0 ? (
          <View style={styles.section}>
            <EmptyState
              action={
                <PrimaryButton onPress={() => navigation.navigate('AddService')}>
                  Agregar servicio
                </PrimaryButton>
              }
              message="Agrega luz, internet o celular para verlos aquí."
              title="Aún no tienes servicios"
            />
          </View>
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
            {services.length > 1 && (
              <PrimaryButton onPress={() => navigation.navigate('AddService')}>
                Simular {services.length} servicios · {totalFormatted}
              </PrimaryButton>
            )}
          </View>
        )}
      </ScrollView>

      <BottomTabBar active="Home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scroll: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Header
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.select({
      android: (StatusBar.currentHeight ?? 0) + spacing.lg,
      default: spacing.xxl,
    }),
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  greeting: {
    fontSize: 12,
    fontWeight: '500',
  },
  displayName: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  iconBtn: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },

  // Layout helpers
  section: {
    paddingHorizontal: spacing.xl,
  },

  // Total card
  totalCard: {
    borderRadius: 22,
    overflow: 'hidden',
    padding: spacing.xl,
    position: 'relative',
  },
  totalCardGlow: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 80,
    height: 160,
    position: 'absolute',
    right: -40,
    top: -30,
    width: 160,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalAmount: {
    ...typography.amount,
    color: '#fff',
    marginTop: 4,
  },
  urgentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  urgentText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },

  // Quick pay grid
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 17,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickTile: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  quickIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  quickLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },

  // Servicios demo header
  sectionHeader2: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  countLabel: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Services list
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
});
