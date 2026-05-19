import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useSessionStore } from '../store/sessionStore';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

export function OtpVerificationScreen({ navigation, route }: Props) {
  const [otp, setOtp] = useState('');
  const setSession = useSessionStore((state) => state.setSession);

  async function continueToHome() {
    await setSession(route.params.phone, 'mock-token');
    navigation.replace('Home');
  }

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>Escribe el codigo</Text>
        <Text style={sharedStyles.body}>Usa 123456 para entrar al demo.</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setOtp}
          placeholder="123456"
          style={sharedStyles.input}
          value={otp}
        />
        <View style={sharedStyles.actions}>
          <PrimaryButton disabled={otp.length < 6} onPress={continueToHome}>Entrar</PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

