import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';

type Props = {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
};

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'back'],
];

export function NumericKeypad({ onKeyPress, onBackspace }: Props) {
  return (
    <View style={styles.container}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="spacer" style={styles.keySpacer} />;
            }
            if (key === 'back') {
              return (
                <Pressable key="back" accessibilityRole="button" onPress={onBackspace} style={styles.key}>
                  <Feather color={colors.textPrimary} name="delete" size={22} />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={key}
                onPress={() => onKeyPress(key)}
                style={styles.key}
              >
                <Text style={styles.keyText}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSubtle,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  key: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  keySpacer: {
    flex: 1,
  },
  keyText: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
