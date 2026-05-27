import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { NumericKeypad } from '../../components/NumericKeypad';
import { PhoneInput } from '../../components/PhoneInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneLogin'>;

export function PhoneLoginScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const [phone, setPhone] = useState('');
  const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpDev = useAuthStore((state) => state.otpDev);
  const requestLoginCode = useAuthStore((state) => state.requestLoginCode);

  function appendDigit(digit: string) {
    if (cleanPhone.length >= 10) return;
    setPhone((current) => `${current.replace(/\D/g, '')}${digit}`.slice(0, 10));
  }

  function backspace() {
    setPhone((current) => current.replace(/\D/g, '').slice(0, -1));
  }

  async function continueToOtp() {
    try {
      await requestLoginCode(cleanPhone);
      navigation.navigate('OtpVerification', { phone: cleanPhone });
    } catch {
      // Store keeps user-facing error.
    }
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.centered}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.fg }]}>Tu número de celular</Text>
            <Text style={[styles.subtitle, { color: theme.fg2 }]}>Te enviaremos un código por SMS para entrar. Es gratis.</Text>
            <PhoneInput value={cleanPhone} />
            <Text style={[styles.hint, { color: theme.fg3 }]}>Solo lo usaremos para identificarte.</Text>
            <View style={[styles.securityCard, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
              <Text style={[styles.securityTitle, { color: theme.info }]}>Tu información está segura</Text>
              <Text style={[styles.securityCopy, { color: theme.fg2 }]}>
                FONDIX PAY no comparte tu número. Cumplimos con la Ley Federal de Protección de Datos Personales.
              </Text>
            </View>
            {otpDev ? <Text style={[styles.devHint, { color: theme.fg3 }]}>Código de prueba: {otpDev}</Text> : null}
            {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}
            <PrimaryButton disabled={cleanPhone.length < 10} loading={isLoading} onPress={continueToOtp}>
              CONTINUAR
            </PrimaryButton>
          </View>
          <NumericKeypad onBackspace={backspace} onKeyPress={appendDigit} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  devHint: {
    ...typography.bodySmall,
  },
  error: {
    ...typography.bodySmall,
  },
  flex: {
    flex: 1,
  },
  hint: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  securityCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  securityCopy: {
    ...typography.caption,
  },
  securityTitle: {
    ...typography.caption,
    fontWeight: '800',
  },
  screen: {
    flex: 1,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
  },
});
