import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SavedService } from '../types';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { ServiceIconBadge } from './ServiceIconBadge';
import { StatusBadge, type StatusBadgeVariant } from './StatusBadge';

type Props = {
  service: SavedService;
  onPress: () => void;
  onPay: () => void;
};

function badgeForService(service: SavedService): { variant: StatusBadgeVariant; label: string } {
  const due = service.dueText.toLowerCase();
  if (service.amountDue <= 0) return { variant: 'paid', label: 'Pagado' };
  if (due.includes('hoy')) return { variant: 'due-today', label: 'Vence hoy' };
  if (due.includes('pendiente')) return { variant: 'pending', label: 'Pendiente' };
  return { variant: 'due-soon', label: service.dueText };
}

export function ServiceCard({ service, onPress, onPay }: Props) {
  const badge = badgeForService(service);
  const canPay = service.amountDue > 0;

  return (
    <View style={[styles.card, shadows.card]}>
      <Pressable onPress={onPress} style={styles.main}>
        <ServiceIconBadge category={service.provider.category} />
        <View style={styles.body}>
          <Text style={styles.title}>
            {service.alias} ({service.provider.displayName})
          </Text>
          <StatusBadge label={badge.label} variant={badge.variant} />
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Text style={[styles.amount, !canPay && styles.amountPaid]}>${service.amountDue.toFixed(0)}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={!canPay}
          onPress={onPay}
          style={[styles.payButton, !canPay && styles.payButtonDisabled]}
        >
          <Text style={styles.payButtonText}>{canPay ? 'PAGAR' : 'LISTO'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  amount: {
    ...typography.heading,
    color: colors.danger,
    fontSize: 18,
  },
  amountPaid: {
    color: colors.success,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  main: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  payButtonDisabled: {
    opacity: 0.45,
  },
  payButtonText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
