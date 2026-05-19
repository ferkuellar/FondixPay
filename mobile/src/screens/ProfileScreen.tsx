import { Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useSessionStore } from '../store/sessionStore';
import { sharedStyles } from './styles';

export function ProfileScreen() {
  const phone = useSessionStore((state) => state.phone);
  const clearSession = useSessionStore((state) => state.clearSession);

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>Mi perfil</Text>
        <View style={sharedStyles.card}>
          <Text style={sharedStyles.body}>Telefono</Text>
          <Text style={{ fontSize: 22, fontWeight: '800' }}>{phone ?? 'Demo'}</Text>
        </View>
        <PrimaryButton onPress={clearSession}>Cerrar sesion</PrimaryButton>
      </View>
    </Screen>
  );
}

