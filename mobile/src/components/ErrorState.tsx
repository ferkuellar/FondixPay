import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ message, onRetry, retryLabel = 'REINTENTAR' }: Props) {
  return (
    <View style={styles.wrap}>
      <Feather color={colors.danger} name="alert-circle" size={48} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <PrimaryButton onPress={onRetry}>{retryLabel}</PrimaryButton> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  wrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
});
