import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type Props = {
  unreadCount: number;
};

export function NotificationBadge({ unreadCount }: Props) {
  if (unreadCount <= 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{unreadCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 22,
    minWidth: 22,
    paddingHorizontal: spacing.xs,
  },
  text: {
    ...typography.caption,
    color: colors.bg,
    fontWeight: '700',
  },
});
