import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { AddServiceScreen } from '../screens/AddServiceScreen';
import { ConfirmPaymentScreen } from '../screens/ConfirmPaymentScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PaymentSuccessScreen } from '../screens/PaymentSuccessScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { PhoneLoginScreen } from '../screens/auth/PhoneLoginScreen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isRestoring) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Preparando tu sesion...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={token ? 'Home' : 'PhoneLogin'}
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text },
      }}
    >
      {token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerBackVisible: false, title: 'FONDIX PAY' }} />
          <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Guardar servicio' }} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Tu servicio' }} />
          <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} options={{ title: 'Confirmar pago' }} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerBackVisible: false, title: 'Listo' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ title: 'Entrar' }} />
          <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} options={{ title: 'Codigo' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
