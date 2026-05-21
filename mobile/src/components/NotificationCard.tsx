import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NotificationItem } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { formatDateTime } from '../utils/date';

type Props = {
  item: NotificationItem;
  onPress: () => void;
};

export function NotificationCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.card, item.status === 'unread' && styles.unread]}>
      <View style={styles.heading}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.state}>{item.status === 'unread' ? 'Nueva' : 'Leida'}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.meta}>
        {item.type} - {formatDateTime(item.createdAt)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  state: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    fontWeight: '700',
  },
  unread: {
    backgroundColor: colors.primarySoft,
  },
});
