import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { radius, spacing, typography, useAppTheme } from '../theme';

export type StatusBadgeVariant = 'due-today' | 'due-soon' | 'paid' | 'pending' | 'processing' | 'review' | 'failed' | 'saved';

type Props = {
  variant: StatusBadgeVariant;
  label: string;
};

export function StatusBadge({ variant, label }: Props) {
  const { theme } = useAppTheme();
  const tone = {
    'due-today': theme.warning,
    'due-soon': theme.pending,
    paid: theme.success,
    pending: theme.pending,
    processing: theme.processing,
    review: theme.review,
    failed: theme.error,
    saved: theme.info,
  }[variant];
  const icon = {
    'due-today': 'alert-triangle',
    'due-soon': 'clock',
    paid: 'check-circle',
    pending: 'clock',
    processing: 'loader',
    review: 'eye',
    failed: 'x-circle',
    saved: 'bookmark',
  }[variant] as keyof typeof Feather.glyphMap;

  return (
    <View style={[styles.badge, { backgroundColor: `${tone}22`, borderColor: `${tone}55` }]}>
      <Feather color={tone} name={icon} size={13} />
      <Text style={[styles.text, { color: tone }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
});
