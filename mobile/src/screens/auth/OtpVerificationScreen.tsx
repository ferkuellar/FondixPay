import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OtpInput } from '../../components/OtpInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

function formatPhoneDisplay(phone: string) {
  const clean = phone.replace(/\D/g, '');
  if (clean.length <= 3) return `+52 ${clean}`;
  if (clean.length <= 6) return `+52 ${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `+52 ${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
}

export function OtpVerificationScreen({ route }: Props) {
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
      <View style={styles.container}>
        <Text style={styles.title}>Código de verificación</Text>
        <Text style={styles.body}>
          Enviamos un código a{'\n'}
          {formatPhoneDisplay(route.params.phone)}
        </Text>
        {otpDev ? <Text style={styles.devHint}>Código de prueba: {otpDev}</Text> : null}
        <OtpInput error={Boolean(error)} onChange={setOtp} value={otp} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.resendPrompt}>¿No recibiste el código?</Text>
        <Text style={styles.resend}>
          {secondsLeft > 0 ? (
            <Text style={styles.resendMuted}>Reenviar código en 00:{String(secondsLeft).padStart(2, '0')}</Text>
          ) : (
            <Text style={styles.resendAction}>Reenviar código</Text>
          )}
        </Text>
        <View style={styles.actions}>
          <PrimaryButton disabled={otp.length < 6} loading={isLoading} onPress={continueToHome}>
            ENTRAR
          </PrimaryButton>
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
    color: colors.textSecondary,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  devHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    ...typography.bodySmall,
  },
  resend: {
    textAlign: 'center',
  },
  resendAction: {
    color: colors.primary,
    fontWeight: '700',
  },
  resendMuted: {
    color: colors.textMuted,
  },
  resendPrompt: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
