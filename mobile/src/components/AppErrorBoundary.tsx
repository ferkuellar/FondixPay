import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { Screen } from './Screen';

type Props = {
  children: ReactNode;
};

type State = {
  error?: Error;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FondixPay render error', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <Screen>
          <View style={styles.content}>
            <Text style={styles.title}>No pudimos mostrar la app</Text>
            <Text style={styles.body}>Revisa el primer error en Metro antes de continuar.</Text>
            <Text selectable style={styles.error}>
              {this.state.error.message}
            </Text>
          </View>
        </Screen>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
  error: {
    ...typography.bodySmall,
    color: colors.danger,
    textAlign: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
