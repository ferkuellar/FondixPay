import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpDev = useAuthStore((state) => state.otpDev);
  const signInWithOtp = useAuthStore((state) => state.signInWithOtp);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

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
          <Text style={styles.resend}>
            {secondsLeft > 0 ? (
              <Text style={[styles.resendMuted, { color: theme.fg3 }]}>Reenviar código en 00:{String(secondsLeft).padStart(2, '0')}</Text>
            ) : (
              <Text style={[styles.resendAction, { color: theme.primary }]}>Reenviar código</Text>
            )}
          </Text>
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
  resend: {
    textAlign: 'center',
  },
  resendAction: {
    fontWeight: '700',
  },
  resendMuted: {},
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
