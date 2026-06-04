import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { SavedService } from '../types';
import { radius, shadows, spacing, typography, useAppTheme } from '../theme';
import { ServiceIconBadge } from './ServiceIconBadge';

type Props = {
  service: SavedService;
  onPress: () => void;
  onPay: () => void;
};

function dueState(service: SavedService): 'paid' | 'urgent' | 'normal' {
  if (service.amountDue <= 0) return 'paid';
  const due = service.dueText.toLowerCase();
  if (due.includes('hoy') || due.includes('vence en 1') || due.includes('vence en 2') || due.includes('vence en 3')) return 'urgent';
  return 'normal';
}

export function ServiceCard({ service, onPress, onPay }: Props) {
  const { theme } = useAppTheme();
  const state = dueState(service);
  const canPay = service.amountDue > 0;
  const amountFormatted =
    '$' +
    service.amountDue.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, shadows.card, { backgroundColor: theme.surface }]}
      accessibilityRole="button"
    >
      <ServiceIconBadge category={service.provider.category} size={48} />

      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.fg }]} numberOfLines={1}>
          {service.alias}
        </Text>
        <View style={styles.dueRow}>
          {state === 'urgent' && (
            <Feather name="alert-triangle" size={12} color={theme.warning} style={styles.dueIcon} />
          )}
          <Text
            style={[
              styles.dueText,
              {
                color:
                  state === 'urgent'
                    ? theme.warning
                    : state === 'paid'
                    ? theme.success
                    : theme.fg3,
              },
            ]}
            numberOfLines={1}
          >
            {state === 'paid' ? 'Simulación al día' : service.dueText}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: theme.fg }]}>{amountFormatted}</Text>
        {canPay ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Simular pago de ${service.alias}`}
            onPress={onPay}
            hitSlop={8}
          >
          <Text style={[styles.payLink, { color: theme.primary }]}>Simular →</Text>
          </Pressable>
        ) : (
          <Text style={[styles.paidLabel, { color: theme.success }]}>Demo listo</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.amountSmall,
    fontSize: 17,
    letterSpacing: -0.3,
    textAlign: 'right',
  },
  body: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  card: {
    alignItems: 'center',
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  dueIcon: {
    marginTop: 1,
  },
  dueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  dueText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  paidLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'right',
  },
  payLink: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'right',
  },
  right: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  title: {
    ...typography.body,
    fontWeight: '700',
    fontSize: 14.5,
  },
});
