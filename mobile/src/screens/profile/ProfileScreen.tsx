import { StyleSheet, Text, View } from 'react-native';

import { BottomTabBar } from '../../components/BottomTabBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, typography } from '../../theme';

export function ProfileScreen() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi perfil</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{user?.phone ?? 'Sin teléfono'}</Text>
        </View>
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
