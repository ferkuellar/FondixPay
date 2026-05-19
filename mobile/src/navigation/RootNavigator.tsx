import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddServiceScreen } from '../screens/AddServiceScreen';
import { ConfirmPaymentScreen } from '../screens/ConfirmPaymentScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { OtpVerificationScreen } from '../screens/OtpVerificationScreen';
import { PaymentSuccessScreen } from '../screens/PaymentSuccessScreen';
import { PhoneLoginScreen } from '../screens/PhoneLoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ title: 'Entrar' }} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} options={{ title: 'Codigo' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerBackVisible: false, title: 'FONDIX PAY' }} />
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Guardar servicio' }} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Tu servicio' }} />
      <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} options={{ title: 'Confirmar pago' }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerBackVisible: false, title: 'Listo' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

