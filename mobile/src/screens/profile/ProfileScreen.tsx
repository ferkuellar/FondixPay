import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { useNotificationPreferencesStore } from '../../store/notificationPreferencesStore';
import { colors, radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type PaymentMethod = {
  badge: string;
  color: string;
  title: string;
  subtitle: string;
  isPrimary?: boolean;
};

type SavedService = {
  name: string;
  provider: string;
};

const paymentMethods: PaymentMethod[] = [
  {
    badge: 'DEMO',
    color: '#0F5CC8',
    isPrimary: true,
    subtitle: 'Método de prueba principal',
    title: 'Método demo •••0000',
  },
  {
    badge: 'DEMO',
    color: '#A7191D',
    subtitle: 'Escenario alterno de prueba',
    title: 'Método demo •••1111',
  },
];

const savedServices: SavedService[] = [
  { name: 'Luz · Casa', provider: 'CFE' },
  { name: 'Internet Izzi', provider: 'Izzi' },
  { name: 'Agua bimestral · SACMEX', provider: 'SACMEX' },
];

export function ProfileScreen({ navigation }: Props) {
  const { mode, theme, toggleMode } = useAppTheme();
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const whatsappReceipt = useNotificationPreferencesStore((state) => state.whatsappReceipt);
  const preferencesError = useNotificationPreferencesStore((state) => state.error);
  const fetchPreferences = useNotificationPreferencesStore((state) => state.fetchPreferences);

  const displayName = user?.name?.trim() || 'Sofía Ramírez';
  const displayPhone = formatProfilePhone(user?.phone);
  const notificationsStatus = whatsappReceipt?.enabled === false ? 'Inactivas' : 'Activas';

  useEffect(() => {
    void fetchPreferences();
  }, [fetchPreferences]);

  return (
    <Screen padded={false} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Text style={[styles.title, { color: theme.fg }]}>Cuenta</Text>

        <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial(displayName)}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={[styles.profileName, { color: theme.fg }]}>{displayName}</Text>
            <Text style={[styles.profilePhone, { color: theme.fg2 }]}>{displayPhone}</Text>
          </View>
          <Pressable accessibilityLabel="Editar perfil" hitSlop={10} style={styles.iconButton}>
            <Feather color={theme.fg2} name="edit-2" size={20} />
          </Pressable>
        </View>

        <SectionTitle label="PRUEBAS DE PAGO" />
        <View style={[styles.groupCard, { backgroundColor: theme.surface }]}>
          {paymentMethods.map((method, index) => (
            <View
              key={method.title}
              style={[
                styles.row,
                index < paymentMethods.length - 1 ? { borderBottomColor: theme.divider, borderBottomWidth: 1 } : null,
              ]}
            >
              <View style={[styles.bankLogo, { backgroundColor: method.color }]}>
                <Text style={styles.bankLogoText}>{method.badge}</Text>
              </View>
              <View style={styles.rowCopy}>
                <Text style={[styles.rowTitle, { color: theme.fg }]}>{method.title}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.fg2 }]}>{method.subtitle}</Text>
              </View>
              {method.isPrimary ? (
                <View style={styles.primaryPill}>
                  <Feather color={colors.primary} name="star" size={12} />
                  <Text style={styles.primaryPillText}>Principal</Text>
                </View>
              ) : null}
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, styles.actionRow, pressed ? styles.pressed : null]}
          >
            <View style={styles.softIcon}>
              <Feather color={theme.fg2} name="plus" size={22} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.fg }]}>Agregar método demo</Text>
            <Feather color={theme.fg2} name="chevron-right" size={21} />
          </Pressable>
        </View>

        <SectionTitle label="SERVICIOS GUARDADOS" />
        <View style={[styles.groupCard, { backgroundColor: theme.surface }]}>
          {savedServices.map((service, index) => (
            <Pressable
              accessibilityRole="button"
              key={service.name}
              style={({ pressed }) => [
                styles.row,
                styles.serviceRow,
                index < savedServices.length - 1 ? { borderBottomColor: theme.divider, borderBottomWidth: 1 } : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <View style={styles.softIcon}>
                <Feather color={theme.fg2} name="credit-card" size={18} />
              </View>
              <Text style={[styles.serviceName, { color: theme.fg }]}>{service.name}</Text>
              <Text style={[styles.provider, { color: theme.fg2 }]}>{service.provider}</Text>
              <Feather color={theme.fg2} name="chevron-right" size={20} />
            </Pressable>
          ))}
        </View>

        <SectionTitle label="AJUSTES" />
        <View style={[styles.groupCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.row, styles.settingsRow, { borderBottomColor: theme.divider, borderBottomWidth: 1 }]}>
            <View style={styles.softIcon}>
              <Feather color={theme.fg2} name="sun" size={18} />
            </View>
            <Text style={[styles.settingsLabel, { color: theme.fg }]}>Tema oscuro</Text>
            <Switch
              onValueChange={toggleMode}
              thumbColor={mode === 'night' ? theme.primaryHi : theme.surface}
              trackColor={{ false: theme.borderHi, true: theme.primary }}
              value={mode === 'night'}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Notifications')}
            style={({ pressed }) => [
              styles.row,
              styles.settingsRow,
              { borderBottomColor: theme.divider, borderBottomWidth: 1 },
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.softIcon}>
              <Feather color={theme.fg2} name="bell" size={18} />
            </View>
            <Text style={[styles.settingsLabel, { color: theme.fg }]}>Notificaciones</Text>
            <Text style={[styles.settingsMeta, { color: theme.fg2 }]}>{notificationsStatus}</Text>
            <Feather color={theme.fg2} name="chevron-right" size={20} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.row,
              styles.settingsRow,
              { borderBottomColor: theme.divider, borderBottomWidth: 1 },
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.softIcon}>
              <Feather color={theme.fg2} name="shield" size={18} />
            </View>
            <Text style={[styles.settingsLabel, { color: theme.fg }]}>Seguridad y privacidad</Text>
            <Feather color={theme.fg2} name="chevron-right" size={20} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, styles.settingsRow, pressed ? styles.pressed : null]}
          >
            <View style={styles.softIcon}>
              <Feather color={theme.fg2} name="help-circle" size={18} />
            </View>
            <Text style={[styles.settingsLabel, { color: theme.fg }]}>Ayuda y soporte</Text>
            <Feather color={theme.fg2} name="chevron-right" size={20} />
          </Pressable>
        </View>

        {preferencesError ? <Text style={[styles.errorText, { color: theme.error }]}>{preferencesError}</Text> : null}

        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutCard,
            { backgroundColor: theme.surface, opacity: isLoading ? 0.65 : 1 },
            pressed ? styles.pressed : null,
          ]}
        >
          <View style={styles.logoutIcon}>
            <Feather color={colors.danger} name="log-out" size={18} />
          </View>
          <Text style={styles.logoutText}>{isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}</Text>
        </Pressable>

        <Text style={[styles.version, { color: theme.fg3 }]}>FONDIX PAY · v1.0.0</Text>
      </ScrollView>
      <BottomTabBar active="Profile" />
    </Screen>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'S';
}

function formatProfilePhone(phone?: string | null) {
  const digits = phone?.replace(/\D/g, '') ?? '';
  const national = digits.startsWith('52') ? digits.slice(2) : digits;

  if (national.length === 10) {
    return `+52 ${national.slice(0, 2)} ${national.slice(2, 6)} ${national.slice(6)}`;
  }

  return '+52 61 4123 4567';
}

const styles = StyleSheet.create({
  actionLabel: {
    ...typography.body,
    flex: 1,
    fontWeight: '800',
  },
  actionRow: {
    minHeight: 60,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#3B9BFF',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  avatarText: {
    ...typography.heading,
    color: colors.surface,
    fontSize: 22,
  },
  bankLogo: {
    alignItems: 'center',
    borderRadius: 5,
    height: 29,
    justifyContent: 'center',
    width: 43,
  },
  bankLogoText: {
    color: colors.surface,
    fontSize: 8,
    fontWeight: '900',
  },
  errorText: {
    ...typography.caption,
    marginHorizontal: spacing.sm,
  },
  groupCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#1C2F4D',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  iconButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  logoutCard: {
    alignItems: 'center',
    borderRadius: radius.xl,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.xs,
    marginTop: spacing.sm,
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    shadowColor: '#1C2F4D',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  logoutIcon: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  logoutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.72,
  },
  primaryPill: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  primaryPillText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: radius.xl,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    minHeight: 84,
    paddingHorizontal: spacing.lg,
    shadowColor: '#1C2F4D',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...typography.heading,
    fontSize: 17,
  },
  profilePhone: {
    ...typography.bodySmall,
    letterSpacing: 0.4,
  },
  provider: {
    ...typography.bodySmall,
    minWidth: 48,
    textAlign: 'right',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowSubtitle: {
    ...typography.caption,
  },
  rowTitle: {
    ...typography.bodySmall,
    fontWeight: '900',
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    marginTop: spacing.xs,
  },
  serviceName: {
    ...typography.body,
    flex: 1,
    fontWeight: '900',
  },
  serviceRow: {
    minHeight: 60,
  },
  settingsLabel: {
    ...typography.body,
    flex: 1,
    fontWeight: '900',
  },
  settingsMeta: {
    ...typography.bodySmall,
  },
  settingsRow: {
    minHeight: 58,
  },
  softIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  title: {
    ...typography.title,
    fontSize: 27,
    marginBottom: spacing.md,
  },
  version: {
    ...typography.caption,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
