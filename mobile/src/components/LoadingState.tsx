import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  message?: string;
};

export function LoadingState({ message = 'Cargando...' }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  wrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
