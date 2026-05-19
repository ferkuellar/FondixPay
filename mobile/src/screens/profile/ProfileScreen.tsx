import { Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import { sharedStyles } from '../styles';

export function ProfileScreen() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <Screen>
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>Mi perfil</Text>
        <View style={sharedStyles.card}>
          <Text style={sharedStyles.body}>Telefono</Text>
          <Text style={{ fontSize: 22, fontWeight: '800' }}>{user?.phone ?? 'Sin telefono'}</Text>
        </View>
        <View style={sharedStyles.card}>
          <Text style={sharedStyles.body}>Cuenta</Text>
          <Text style={{ fontSize: 18, fontWeight: '800' }}>Demo segura</Text>
        </View>
        <PrimaryButton disabled={isLoading} onPress={logout}>
          {isLoading ? 'Cerrando...' : 'Cerrar sesion'}
        </PrimaryButton>
      </View>
    </Screen>
  );
}
