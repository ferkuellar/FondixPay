import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneLogin'>;

export function PhoneLoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const cleanPhone = phone.replace(/\D/g, '');

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>Tu telefono</Text>
        <Text style={sharedStyles.body}>Te mandaremos un codigo para entrar. En desarrollo usa 123456.</Text>
        <TextInput
          keyboardType="phone-pad"
          onChangeText={setPhone}
          placeholder="55 1234 5678"
          style={sharedStyles.input}
          value={phone}
        />
        <View style={sharedStyles.actions}>
          <PrimaryButton disabled={cleanPhone.length < 10} onPress={() => navigation.navigate('OtpVerification', { phone: cleanPhone })}>
            Enviar codigo
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

