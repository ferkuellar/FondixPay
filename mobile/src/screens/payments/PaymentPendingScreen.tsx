import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PaymentRecoverySummary } from '../../components/PaymentRecoverySummary';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { AlertCard } from '../../components/AlertCard';
import { radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentPending'>;

export function PaymentPendingScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const recovery = route.params.recovery;
  const isTimeout = recovery.status === 'timeout';

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: `${theme.processing}18` }]}>
            <Feather color={theme.processing} name="loader" size={34} />
          </View>
          <Text style={[styles.title, { color: theme.fg }]}>Pago de prueba en revisión</Text>
          <Text style={[styles.body, { color: theme.fg2 }]}>Esta pantalla simula un estado pendiente. No hay una operación real en proceso.</Text>
        </View>
        <View style={[styles.status, { backgroundColor: `${theme.processing}18`, borderColor: `${theme.processing}55` }]}>
          <Text style={[styles.statusLabel, { color: theme.fg2 }]}>Estado</Text>
          <Text style={[styles.statusValue, { color: theme.fg }]}>{isTimeout ? 'Simulación en verificación' : 'Simulación pendiente'}</Text>
          <Text style={[styles.statusHint, { color: theme.fg2 }]}>Comprobante de prueba pendiente. No depende de un proveedor real.</Text>
        </View>
        <AlertCard tone="warning" title="Modo prueba" message="No hay operación bancaria real ni confirmación de proveedor en curso." />
        <PaymentRecoverySummary recovery={recovery} />
        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.replace('History')}>VER HISTORIAL DEMO</PrimaryButton>
          <PrimaryButton onPress={() => navigation.navigate('SupportPlaceholder', { recovery })} variant="secondary">
            NECESITO AYUDA
          </PrimaryButton>
          <PrimaryButton onPress={() => navigation.replace('Home')} variant="secondary">
            IR AL INICIO
          </PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  body: {
    ...typography.body,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  status: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  statusLabel: {
    ...typography.caption,
  },
  statusValue: {
    ...typography.body,
    fontWeight: '700',
  },
  statusHint: {
    ...typography.caption,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
});
