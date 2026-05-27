import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { NotificationBadge } from '../../components/NotificationBadge';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, typography, useAppTheme } from '../../theme';
import { useNotificationPreferencesStore } from '../../store/notificationPreferencesStore';
import { useNotificationStore } from '../../store/notificationStore';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { mode, theme, toggleMode } = useAppTheme();
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const whatsappReceipt = useNotificationPreferencesStore((state) => state.whatsappReceipt);
  const preferencesLoading = useNotificationPreferencesStore((state) => state.isLoading);
  const preferencesError = useNotificationPreferencesStore((state) => state.error);
  const fetchPreferences = useNotificationPreferencesStore((state) => state.fetchPreferences);
  const setWhatsappReceiptEnabled = useNotificationPreferencesStore((state) => state.setWhatsappReceiptEnabled);

  useEffect(() => {
    void fetchPreferences();
  }, [fetchPreferences]);

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.fg }]}>Mi perfil</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.fg2 }]}>Teléfono</Text>
          <Text style={[styles.value, { color: theme.fg }]}>{user?.phone ?? 'Sin teléfono'}</Text>
        </View>
        <PrimaryButton onPress={() => navigation.navigate('Notifications')} variant="secondary">
          <View style={styles.notificationAction}>
            <Text style={styles.notificationLabel}>VER NOTIFICACIONES</Text>
            <NotificationBadge unreadCount={unreadCount} />
          </View>
        </PrimaryButton>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.preferenceHeader}>
            <View style={styles.preferenceCopy}>
              <Text style={[styles.preferenceTitle, { color: theme.fg }]}>Modo {mode === 'night' ? 'Night' : 'Day'}</Text>
              <Text style={[styles.preferenceBody, { color: theme.fg2 }]}>Cambia entre vista clara y oscura.</Text>
            </View>
            <Switch
              onValueChange={toggleMode}
              thumbColor={mode === 'night' ? theme.primaryHi : theme.surface}
              trackColor={{ false: theme.borderHi, true: theme.primary }}
              value={mode === 'night'}
            />
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.preferenceHeader}>
            <View style={styles.preferenceCopy}>
              <Text style={[styles.preferenceTitle, { color: theme.fg }]}>Recibir comprobantes por WhatsApp</Text>
              <Text style={[styles.preferenceBody, { color: theme.fg2 }]}>
                Autorizo recibir por WhatsApp comprobantes de pagos exitosos de FondixPay. Puedo desactivarlo cuando quiera.
              </Text>
            </View>
            <Switch
              disabled={preferencesLoading}
              onValueChange={(enabled) => void setWhatsappReceiptEnabled(enabled)}
              value={Boolean(whatsappReceipt?.enabled)}
            />
          </View>
          {preferencesError ? <Text style={[styles.errorText, { color: theme.error }]}>{preferencesError}</Text> : null}
        </View>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.fg2 }]}>Cuenta</Text>
          <Text style={[styles.value, { color: theme.fg }]}>Demo segura</Text>
          <Text style={[styles.note, { color: theme.warning }]}>Pagos simulados - no es dinero real.</Text>
        </View>
        <PrimaryButton disabled={isLoading} loading={isLoading} onPress={logout} variant="danger">
          CERRAR SESIÓN
        </PrimaryButton>
      </View>
      <BottomTabBar active="Profile" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  note: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.sm,
  },
  notificationAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notificationLabel: {
    ...typography.button,
    color: colors.primary,
  },
  preferenceBody: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  preferenceCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  preferenceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  preferenceTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  screen: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  value: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 20,
  },
});
