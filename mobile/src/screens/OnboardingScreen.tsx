import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../types';
import { sharedStyles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={[sharedStyles.container, { justifyContent: 'center' }]}>
        <Text style={sharedStyles.title}>Paga tus servicios sin vueltas</Text>
        <Text style={sharedStyles.body}>Guarda tu luz, telefono, agua o internet una vez. Luego solo toca pagar.</Text>
        <View style={sharedStyles.actions}>
          <PrimaryButton onPress={() => navigation.navigate('PhoneLogin')}>Empezar</PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

