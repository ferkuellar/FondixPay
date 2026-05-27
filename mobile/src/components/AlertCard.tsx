import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography, useAppTheme } from '../theme';

type Tone = 'success' | 'warning' | 'error' | 'info';

type Props = {
  tone?: Tone;
  title: string;
  message?: string;
};

export function AlertCard({ tone = 'info', title, message }: Props) {
  const { theme } = useAppTheme();
  const color = {
    success: theme.success,
    warning: theme.warning,
    error: theme.error,
    info: theme.info,
  }[tone];
  const icon = {
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle',
    info: 'info',
  }[tone] as keyof typeof Feather.glyphMap;

  return (
    <View style={[styles.card, { backgroundColor: `${color}18`, borderColor: `${color}55` }]}>
      <Feather color={color} name={icon} size={18} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.fg }]}>{title}</Text>
        {message ? <Text style={[styles.message, { color: theme.fg2 }]}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  message: {
    ...typography.caption,
  },
  title: {
    ...typography.body,
    fontWeight: '700',
  },
});
