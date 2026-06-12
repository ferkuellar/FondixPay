import { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { NotificationCard } from '../../components/NotificationCard';
import { Screen } from '../../components/Screen';
import { useNotificationStore } from '../../store/notificationStore';
import { spacing } from '../../theme';

export function NotificationsScreen() {
  const error = useNotificationStore((state) => state.error);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const markRead = useNotificationStore((state) => state.markRead);
  const notifications = useNotificationStore((state) => state.notifications);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading ? <LoadingState message="Cargando notificaciones..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && notifications.length === 0 ? (
          <EmptyState
            emoji="🔔"
            message="Cuando realices un pago, aquí verás los avisos y estados de tus operaciones."
            title="Sin notificaciones"
          />
        ) : null}
        {!isLoading && !error
          ? notifications.map((item) => (
              <NotificationCard key={item.id} item={item} onPress={() => void markRead(item.id)} />
            ))
          : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: spacing.md,
    padding: spacing.xl,
  },
});
