import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { getProviderReadinessPresentation } from '../../integrations/providerReadiness';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderCallback'>;

export function ProviderCallbackScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const presentation = getProviderReadinessPresentation('PROVIDER_PENDING');

  return (
    <Screen>
      <View style={styles.container}>
        <View style={[styles.icon, { backgroundColor: `${theme.processing}18` }]}>
          <Feather color={theme.processing} name="clock" size={34} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.fg }]}>{presentation.title}</Text>
          <Text style={[styles.body, { color: theme.fg2 }]}>{presentation.message}</Text>
          <Text style={[styles.note, { color: theme.fg3 }]}>
            Esta pantalla es un placeholder seguro para `fondixpay://provider/callback`. No procesa datos del proveedor ni
            interpreta parámetros hasta recibir documentación oficial.
          </Text>
        </View>
        <PrimaryButton onPress={() => navigation.replace('Home')}>VOLVER AL INICIO</PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'center',
  },
  copy: {
    gap: spacing.md,
  },
  icon: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: radius.xl,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  note: {
    ...typography.caption,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
});
