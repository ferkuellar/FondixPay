import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OtpInput } from '../../components/OtpInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

function formatPhoneDisplay(phone: string) {
  const clean = phone.replace(/\D/g, '');
  if (clean.length <= 3) return `+52 ${clean}`;
  if (clean.length <= 6) return `+52 ${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `+52 ${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
}

export function OtpVerificationScreen({ route }: Props) {
  const { theme } = useAppTheme();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState<string | undefined>();
  const resendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpDev = useAuthStore((state) => state.otpDev);
  const requestLoginCode = useAuthStore((state) => state.requestLoginCode);
  const signInWithOtp = useAuthStore((state) => state.signInWithOtp);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    return () => {
      if (resendTimer.current) clearTimeout(resendTimer.current);
    };
  }, []);

  async function resendCode() {
    if (isLoading || secondsLeft > 0) return;
    setResendError(undefined);
    if (resendTimer.current) clearTimeout(resendTimer.current);
    try {
      await requestLoginCode(route.params.phone);
      setSecondsLeft(25);
      setResendSent(true);
      resendTimer.current = setTimeout(() => setResendSent(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No pudimos reenviar el código. Intenta en un momento.';
      clearError();
      setResendError(message);
      resendTimer.current = setTimeout(() => setResendError(undefined), 5000);
    }
  }

  async function continueToHome() {
    try {
      await signInWithOtp(route.params.phone, otp);
    } catch {
      // Store keeps user-facing error.
    }
  }

  return (
    <Screen>
      <View style={styles.centered}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.fg }]}>Código de verificación</Text>
          <Text style={[styles.body, { color: theme.fg2 }]}>
            Enviamos un código a{'\n'}
            {formatPhoneDisplay(route.params.phone)}
          </Text>
          {otpDev ? <Text style={[styles.devHint, { color: theme.fg3 }]}>Código de prueba: {otpDev}</Text> : null}
          <OtpInput error={Boolean(error)} onChange={setOtp} value={otp} />
          {error ? (
            <View style={[styles.errorCard, { backgroundColor: `${theme.error}18`, borderColor: `${theme.error}55` }]}>
              <Text style={[styles.error, { color: theme.error }]}>
                Código incorrecto. Revisa los 6 dígitos. Te quedan 2 intentos.
              </Text>
            </View>
          ) : null}
          <Text style={[styles.resendPrompt, { color: theme.fg2 }]}>¿No recibiste el código?</Text>
          {secondsLeft > 0 ? (
            <Text style={[styles.resendMuted, { color: theme.fg3 }]}>
              Reenviar código en 00:{String(secondsLeft).padStart(2, '0')}
            </Text>
          ) : (
            <Pressable
              disabled={isLoading}
              onPress={resendCode}
              accessibilityRole="button"
              accessibilityLabel="Reenviar código de verificación"
            >
              <Text style={[styles.resendAction, { color: isLoading ? theme.fg3 : theme.primary }]}>
                Reenviar código
              </Text>
            </Pressable>
          )}
          {resendSent ? (
            <Text style={[styles.resendConfirm, { color: theme.success ?? '#16A34A' }]}>
              Código reenviado
            </Text>
          ) : null}
          {resendError ? (
            <View style={[styles.resendErrorCard, { backgroundColor: `${theme.warning ?? '#F59E0B'}18`, borderColor: `${theme.warning ?? '#F59E0B'}55` }]}>
              <Text style={[styles.resendErrorText, { color: theme.warning ?? '#92400E' }]}>
                {resendError}
              </Text>
            </View>
          ) : null}
          <View style={styles.actions}>
            <PrimaryButton disabled={otp.length < 6} loading={isLoading} onPress={continueToHome}>
              ENTRAR
            </PrimaryButton>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.xl,
  },
  body: {
    ...typography.body,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  container: {
    gap: spacing.lg,
  },
  devHint: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  error: {
    ...typography.bodySmall,
  },
  errorCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  resendAction: {
    ...typography.bodySmall,
    fontWeight: '700',
    textAlign: 'center',
  },
  resendConfirm: {
    ...typography.caption,
    textAlign: 'center',
  },
  resendErrorCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    width: '100%',
  },
  resendErrorText: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  resendMuted: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  resendPrompt: {
    ...typography.bodySmall,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
});
