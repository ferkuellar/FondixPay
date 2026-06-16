import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { startTekaeSession } from '../../services/tekaeApi';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TekaeSession'>;

type Status = 'loading' | 'in_progress' | 'error';

export function TekaeSessionScreen({ navigation, route }: Props) {
  const token = useAuthStore((state) => state.token);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const launch = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const { categoria, carrier, blockview } = route.params ?? {};
      const session = await startTekaeSession(
        { categoria: categoria ?? null, carrier: carrier ?? null, blockview: blockview ?? false },
        token ?? '',
      );
      await WebBrowser.openBrowserAsync(session.portalUrl);
      setStatus('in_progress');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No pudimos conectar con el servicio de pagos.');
      setStatus('error');
    }
  }, [route.params, token]);

  useEffect(() => {
    void launch();
  }, [launch]);

  return (
    <Screen>
      <View style={styles.container}>
        {status === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Preparando tu sesión de pago...</Text>
          </View>
        )}

        {status === 'in_progress' && (
          <View style={styles.center}>
            <View style={styles.iconWrap}>
              <Feather color={colors.primary} name="external-link" size={34} />
            </View>
            <Text style={styles.title}>Completando tu pago en el navegador</Text>
            <Text style={styles.body}>
              Cuando termines, cierra el navegador y regresa a FONDIXPAY.
            </Text>
            <Text style={styles.notice}>
              Abrir el portal no confirma el pago. La confirmación llegará por separado.
            </Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.center}>
            <View style={styles.iconWrapError}>
              <Feather color={colors.error} name="alert-circle" size={34} />
            </View>
            <Text style={styles.title}>No pudimos abrir el servicio</Text>
            <Text style={styles.body}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {status === 'error' && (
            <PrimaryButton onPress={() => void launch()}>Reintentar</PrimaryButton>
          )}
          {status === 'in_progress' && (
            <PrimaryButton onPress={() => void launch()} variant="secondary">
              Volver a abrir el navegador
            </PrimaryButton>
          )}
          <PrimaryButton onPress={() => navigation.goBack()} variant="secondary">
            {status === 'in_progress' ? 'Volver a FONDIXPAY' : 'Cancelar'}
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: 'auto',
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  iconWrapError: {
    alignItems: 'center',
    backgroundColor: `${colors.error}18`,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  notice: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
