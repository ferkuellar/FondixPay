import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';
import type { PaymentMethod } from '../types';

type Props = {
  method: PaymentMethod;
  selected?: boolean;
  compact?: boolean;
  onPress?: () => void;
};

export function PaymentMethodCard({ method, selected, compact, onPress }: Props) {
  const content = (
    <>
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Feather color={selected ? '#FFFFFF' : colors.primary} name="credit-card" size={18} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{method.label}</Text>
          {method.isMock ? <Text style={styles.badge}>DEMO</Text> : null}
        </View>
        <Text style={styles.description}>{method.description}</Text>
        {method.displayLast4 ? <Text style={styles.last4}>Terminación demo {method.displayLast4}</Text> : null}
      </View>
      {selected ? <Feather color={colors.success} name="check-circle" size={20} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed }) => [styles.card, compact && styles.compact, selected && styles.selected, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.card, compact && styles.compact, selected && styles.selected]}>{content}</View>;
}

const styles = StyleSheet.create({
  badge: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  compact: {
    padding: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconWrapSelected: {
    backgroundColor: colors.primary,
  },
  last4: {
    ...typography.caption,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.9,
  },
  selected: {
    borderColor: colors.primary,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
