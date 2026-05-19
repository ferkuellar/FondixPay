import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { PhoneLoginScreen } from '../screens/auth/PhoneLoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ConfirmPaymentScreen } from '../screens/payments/ConfirmPaymentScreen';
import { HistoryScreen } from '../screens/payments/HistoryScreen';
import { PaymentSuccessScreen } from '../screens/payments/PaymentSuccessScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AddServiceScreen } from '../screens/services/AddServiceScreen';
import { ServiceDetailScreen } from '../screens/services/ServiceDetailScreen';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const restoreSession = useAuthStore((state) => state.restoreSession);

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
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerBackVisible: false, title: 'FONDIX PAY' }} />
          <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Agregar servicio' }} />
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
