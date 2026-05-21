import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { NotificationBadge } from '../../components/NotificationBadge';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, typography } from '../../theme';
import { useNotificationStore } from '../../store/notificationStore';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi perfil</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{user?.phone ?? 'Sin teléfono'}</Text>
        </View>
        <PrimaryButton onPress={() => navigation.navigate('Notifications')} variant="secondary">
          <View style={styles.notificationAction}>
            <Text style={styles.notificationLabel}>VER NOTIFICACIONES</Text>
            <NotificationBadge unreadCount={unreadCount} />
          </View>
        </PrimaryButton>
        <View style={styles.card}>
          <Text style={styles.label}>Cuenta</Text>
          <Text style={styles.value}>Demo segura</Text>
          <Text style={styles.note}>Pagos simulados — no es dinero real.</Text>
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
