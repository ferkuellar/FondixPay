import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { NumericKeypad } from '../../components/NumericKeypad';
import { PhoneInput } from '../../components/PhoneInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneLogin'>;

export function PhoneLoginScreen({ navigation }: Props) {
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
        <View style={styles.content}>
          <Text style={styles.title}>Ingresa tu número de celular</Text>
          <PhoneInput value={cleanPhone} />
          <Text style={styles.hint}>Te enviaremos un código de verificación</Text>
          {otpDev ? <Text style={styles.devHint}>Código de prueba: {otpDev}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton disabled={cleanPhone.length < 10} loading={isLoading} onPress={continueToOtp}>
            CONTINUAR
          </PrimaryButton>
        </View>
        <NumericKeypad onBackspace={backspace} onKeyPress={appendDigit} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  devHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  error: {
    color: colors.danger,
    ...typography.bodySmall,
  },
  flex: {
    flex: 1,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  screen: {
    flex: 1,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
