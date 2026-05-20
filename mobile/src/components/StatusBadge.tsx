import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

export type StatusBadgeVariant = 'due-today' | 'due-soon' | 'paid' | 'pending';

type Props = {
  variant: StatusBadgeVariant;
  label: string;
};

export function StatusBadge({ variant, label }: Props) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  'due-soon': {
    backgroundColor: colors.bgSubtle,
  },
  'due-soonText': {
    color: colors.textSecondary,
  },
  'due-today': {
    backgroundColor: colors.warningSoft,
  },
  'due-todayText': {
    color: colors.warning,
  },
  paid: {
    backgroundColor: colors.successSoft,
  },
  paidText: {
    color: colors.success,
  },
  pending: {
    backgroundColor: colors.primarySoft,
  },
  pendingText: {
    color: colors.primary,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
