import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  MEXICO_STATE_OPTIONS,
  useStatePreferenceStore,
  type MexicoStateCode,
} from '../store/statePreferenceStore';
import { colors, radius, spacing, typography, useAppTheme } from '../theme';

export function StateSelectorCard() {
  const { theme } = useAppTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasHydrated = useStatePreferenceStore((state) => state.hasHydrated);
  const restoreSelectedState = useStatePreferenceStore((state) => state.restoreSelectedState);
  const selectedState = useStatePreferenceStore((state) => state.selectedState);
  const setSelectedState = useStatePreferenceStore((state) => state.setSelectedState);

  useEffect(() => {
    if (!hasHydrated) {
      void restoreSelectedState();
    }
  }, [hasHydrated, restoreSelectedState]);

  function chooseState(code: MexicoStateCode) {
    void setSelectedState(code);
    setIsExpanded(false);
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cambiar estado seleccionado"
        onPress={() => setIsExpanded((value) => !value)}
        style={({ pressed }) => [styles.summaryRow, pressed ? styles.pressed : null]}
      >
        <View style={styles.iconWrap}>
          <Feather color={theme.primary} name="map-pin" size={18} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.label, { color: theme.fg2 }]}>Estado seleccionado</Text>
          <Text style={[styles.stateName, { color: theme.fg }]}>{selectedState.name}</Text>
          <Text style={[styles.helper, { color: theme.fg2 }]}>
            Esto prepara la disponibilidad futura de servicios por estado. Aún no filtra servicios reales.
          </Text>
        </View>
        <View style={styles.action}>
          <Text style={[styles.actionText, { color: theme.primary }]}>Cambiar</Text>
          <Feather color={theme.primary} name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} />
        </View>
      </Pressable>

      {isExpanded ? (
        <View style={[styles.options, { borderTopColor: theme.divider }]}>
          {MEXICO_STATE_OPTIONS.map((state) => {
            const isSelected = state.code === selectedState.code;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={state.code}
                onPress={() => chooseState(state.code)}
                style={({ pressed }) => [
                  styles.optionRow,
                  isSelected ? { backgroundColor: `${theme.primary}18` } : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View style={styles.optionCopy}>
                  <Text style={[styles.optionName, { color: theme.fg }]}>{state.name}</Text>
                  <Text style={[styles.optionCode, { color: theme.fg2 }]}>{state.code}</Text>
                </View>
                {isSelected ? <Feather color={theme.primary} name="check-circle" size={19} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  actionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '900',
  },
  card: {
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  helper: {
    ...typography.caption,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  label: {
    ...typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  optionCode: {
    ...typography.caption,
  },
  optionCopy: {
    flex: 1,
    gap: 1,
  },
  optionName: {
    ...typography.bodySmall,
    fontWeight: '900',
  },
  optionRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  options: {
    borderTopWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm,
  },
  pressed: {
    opacity: 0.72,
  },
  stateName: {
    ...typography.body,
    fontWeight: '900',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
});
