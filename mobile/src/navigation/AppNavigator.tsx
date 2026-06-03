import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { LoadingState } from '../components/LoadingState';
import { Screen } from '../components/Screen';
import { AccountCreatedScreen } from '../screens/auth/AccountCreatedScreen';
import { AccountScreen } from '../screens/account/AccountScreen';
import { MovementsScreen } from '../screens/account/MovementsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { PhoneLoginScreen } from '../screens/auth/PhoneLoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AddPaymentMethodMockScreen } from '../screens/payments/AddPaymentMethodMockScreen';
import { ConfirmPaymentScreen } from '../screens/payments/ConfirmPaymentScreen';
import { HistoryScreen } from '../screens/payments/HistoryScreen';
import { PaymentFailedScreen } from '../screens/payments/PaymentFailedScreen';
import { PaymentMethodsScreen } from '../screens/payments/PaymentMethodsScreen';
import { PaymentPendingScreen } from '../screens/payments/PaymentPendingScreen';
import { PaymentSuccessScreen } from '../screens/payments/PaymentSuccessScreen';
import { ProviderCallbackScreen } from '../screens/payments/ProviderCallbackScreen';
import { ReceiptDetailScreen } from '../screens/payments/ReceiptDetailScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AddServiceScreen } from '../screens/services/AddServiceScreen';
import { ServiceDetailScreen } from '../screens/services/ServiceDetailScreen';
import { SupportPlaceholderScreen } from '../screens/support/SupportPlaceholderScreen';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { theme } = useAppTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const showAccountWelcome = useAuthStore((state) => state.showAccountWelcome);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isRestoring) {
    return (
      <Screen>
        <LoadingState message="Preparando tu sesión..." />
      </Screen>
    );
  }

  const authenticatedInitial = showAccountWelcome ? 'AccountCreated' : 'Home';

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? authenticatedInitial : 'Onboarding'}
      screenOptions={{
        contentStyle: { backgroundColor: theme.bg },
        headerStyle: { backgroundColor: theme.bg },
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.fg, fontWeight: '700' },
        headerTintColor: theme.primary,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="AccountCreated"
            component={AccountCreatedScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Agregar servicio' }} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Tu servicio' }} />
          <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} options={{ title: 'Confirmar pago' }} />
          <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Métodos de pago' }} />
          <Stack.Screen
            name="AddPaymentMethodMock"
            component={AddPaymentMethodMockScreen}
            options={{ title: 'Agregar tarjeta demo' }}
          />
          <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Cuenta demo' }} />
          <Stack.Screen name="Movements" component={MovementsScreen} options={{ title: 'Movimientos demo' }} />
          <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} options={{ title: 'Pago no completado' }} />
          <Stack.Screen name="PaymentPending" component={PaymentPendingScreen} options={{ title: 'Pago pendiente' }} />
          <Stack.Screen
            name="SupportPlaceholder"
            component={SupportPlaceholderScreen}
            options={{ title: 'Ayuda' }}
          />
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{ headerBackVisible: false, title: 'Listo' }}
          />
          <Stack.Screen
            name="ProviderCallback"
            component={ProviderCallbackScreen}
            options={{ headerBackVisible: false, title: 'Estado de operación' }}
          />
          <Stack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} options={{ title: 'Detalle' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} options={{ title: 'Código' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
