import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

export function OtpVerificationScreen({ route }: Props) {
  const [otp, setOtp] = useState('');
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpDev = useAuthStore((state) => state.otpDev);
  const signInWithOtp = useAuthStore((state) => state.signInWithOtp);

  async function continueToHome() {
    try {
      await signInWithOtp(route.params.phone, otp);
    } catch {
      // The store keeps the user-facing error.
    }
  }

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>Ya casi</Text>
        <Text style={sharedStyles.body}>Escribe el codigo que te enviamos.</Text>
        {otpDev ? <Text style={sharedStyles.body}>Codigo de prueba: {otpDev}</Text> : null}
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setOtp}
          placeholder="123456"
          style={sharedStyles.input}
          value={otp}
        />
        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
        <View style={sharedStyles.actions}>
          <PrimaryButton disabled={otp.length < 6 || isLoading} onPress={continueToHome}>
            {isLoading ? 'Revisando...' : 'Entrar'}
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}
