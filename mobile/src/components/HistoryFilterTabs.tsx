import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useAppTheme } from '../theme';
import type { TransactionHistoryFilter } from '../types';

type Props = {
  selected: TransactionHistoryFilter;
  onSelect: (filter: TransactionHistoryFilter) => void;
};

const filters: Array<[TransactionHistoryFilter, string]> = [
  ['all', 'Todos'],
  ['succeeded', 'Pagados'],
  ['pending', 'Pendientes'],
  ['failed', 'En revisión'],
];

export function HistoryFilterTabs({ selected, onSelect }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.tabs}>
      {filters.map(([filter, label]) => (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: filter === selected }}
          key={filter}
          onPress={() => onSelect(filter)}
          style={[
            styles.tab,
            { backgroundColor: theme.surface, borderColor: theme.border },
            filter === selected && { backgroundColor: `${theme.primary}18`, borderColor: theme.primary },
          ]}
        >
          <Text style={[styles.tabText, { color: filter === selected ? theme.primary : theme.fg2 }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tabText: {
    ...typography.caption,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});
