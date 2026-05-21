import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { TransactionHistoryFilter } from '../types';

type Props = {
  selected: TransactionHistoryFilter;
  onSelect: (filter: TransactionHistoryFilter) => void;
};

const filters: Array<[TransactionHistoryFilter, string]> = [
  ['all', 'Todos'],
  ['succeeded', 'Pagados'],
  ['pending', 'Pendientes'],
  ['failed', 'Fallidos'],
];

export function HistoryFilterTabs({ selected, onSelect }: Props) {
  return (
    <View style={styles.tabs}>
      {filters.map(([filter, label]) => (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: filter === selected }}
          key={filter}
          onPress={() => onSelect(filter)}
          style={[styles.tab, filter === selected && styles.tabActive]}
        >
          <Text style={[styles.tabText, filter === selected && styles.tabTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
  },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});
