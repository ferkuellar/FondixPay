import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  MEXICO_STATE_OPTIONS,
  useStatePreferenceStore,
  type MexicoStateCode,
} from '../store/statePreferenceStore';
import { colors, radius, spacing, typography, useAppTheme } from '../theme';
import { resolveMexicoStateFromAddress } from '../utils/locationStateResolver';

type LocationPromptState = 'idle' | 'loading' | 'denied' | 'failed' | 'unresolved' | 'resolved';

export function StateSelectorCard() {
  const { theme } = useAppTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationPromptState, setLocationPromptState] = useState<LocationPromptState>('idle');
  const hasHydrated = useStatePreferenceStore((state) => state.hasHydrated);
  const preference = useStatePreferenceStore((state) => state.preference);
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
    setLocationPromptState('idle');
    setIsExpanded(false);
  }

  async function detectStateFromLocation() {
    setLocationPromptState('loading');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setLocationPromptState('denied');
        setIsExpanded(true);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const addresses = await Location.reverseGeocodeAsync(currentLocation.coords);
      const resolvedState = resolveMexicoStateFromAddress(addresses[0]);

      if (!resolvedState) {
        setLocationPromptState('unresolved');
        setIsExpanded(true);
        return;
      }

      await setSelectedState(resolvedState.code, 'gps');
      setLocationPromptState('resolved');
      setIsExpanded(false);
    } catch {
      setLocationPromptState('failed');
      setIsExpanded(true);
    }
  }

  const sourceLabel =
    preference.source === 'gps'
      ? 'Detectado por ubicación'
      : preference.source === 'manual'
        ? 'Elegido manualmente'
        : 'Puedes elegirlo manualmente';

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
          <Text style={[styles.sourceLabel, { color: theme.primary }]}>{sourceLabel}</Text>
          <Text style={[styles.helper, { color: theme.fg2 }]}>
            Usaremos el estado para mostrar servicios disponibles más adelante. Aún no filtra servicios reales.
          </Text>
        </View>
        <View style={styles.action}>
          <Text style={[styles.actionText, { color: theme.primary }]}>Cambiar</Text>
          <Feather color={theme.primary} name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} />
        </View>
      </Pressable>

      <View style={[styles.locationBlock, { borderTopColor: theme.divider }]}>
        <Text style={[styles.locationCopy, { color: theme.fg2 }]}>
          Podemos usar tu ubicación para sugerir tu estado. También puedes elegirlo manualmente.
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={locationPromptState === 'loading'}
          onPress={detectStateFromLocation}
          style={({ pressed }) => [
            styles.locationButton,
            { borderColor: theme.borderHi },
            locationPromptState === 'loading' ? styles.disabled : null,
            pressed ? styles.pressed : null,
          ]}
        >
          <Feather color={theme.primary} name="crosshair" size={16} />
          <Text style={[styles.locationButtonText, { color: theme.primary }]}>
            {locationPromptState === 'loading' ? 'Detectando estado...' : 'Usar mi ubicación'}
          </Text>
        </Pressable>
        {locationPromptState === 'denied' ? (
          <Text style={[styles.feedback, { color: theme.fg2 }]}>
            No pasa nada. Puedes elegir tu estado manualmente.
          </Text>
        ) : null}
        {locationPromptState === 'failed' || locationPromptState === 'unresolved' ? (
          <Text style={[styles.feedback, { color: theme.fg2 }]}>
            No pudimos detectar tu estado. Elígelo manualmente.
          </Text>
        ) : null}
        {locationPromptState === 'resolved' ? (
          <Text style={[styles.feedback, { color: theme.fg2 }]}>
            Estado sugerido por ubicación. Puedes cambiarlo manualmente cuando quieras.
          </Text>
        ) : null}
      </View>

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
  disabled: {
    opacity: 0.65,
  },
  feedback: {
    ...typography.caption,
  },
  locationBlock: {
    borderTopWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  locationButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
  locationButtonText: {
    ...typography.caption,
    fontWeight: '900',
  },
  locationCopy: {
    ...typography.caption,
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
  sourceLabel: {
    ...typography.caption,
    fontWeight: '800',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
});
