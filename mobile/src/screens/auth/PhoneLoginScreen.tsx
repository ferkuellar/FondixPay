import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import type { RootStackParamList } from '../../types';
import { sharedStyles } from '../styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneLogin'>;

export function PhoneLoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const cleanPhone = phone.replace(/\D/g, '');
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpDev = useAuthStore((state) => state.otpDev);
  const requestLoginCode = useAuthStore((state) => state.requestLoginCode);

  async function continueToOtp() {
    try {
      await requestLoginCode(cleanPhone);
      navigation.navigate('OtpVerification', { phone: cleanPhone });
    } catch {
      // The store keeps the user-facing error.
    }
  }

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>Ingresa tu numero</Text>
        <Text style={sharedStyles.body}>Te enviamos un codigo para entrar.</Text>
        <TextInput
          keyboardType="phone-pad"
          onChangeText={setPhone}
          placeholder="614 123 4567"
          style={sharedStyles.input}
          value={phone}
        />
        {otpDev ? <Text style={sharedStyles.body}>Codigo de prueba: {otpDev}</Text> : null}
        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
        <View style={sharedStyles.actions}>
          <PrimaryButton disabled={cleanPhone.length < 10 || isLoading} onPress={continueToOtp}>
            {isLoading ? 'Enviando...' : 'Continuar'}
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}
