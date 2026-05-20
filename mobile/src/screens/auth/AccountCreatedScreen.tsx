import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SuccessIllustration } from '../../components/SuccessIllustration';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountCreated'>;

export function AccountCreatedScreen({ navigation }: Props) {
  const dismissAccountWelcome = useAuthStore((state) => state.dismissAccountWelcome);

  function goHome() {
    dismissAccountWelcome();
    navigation.replace('Home');
  }

  function goAddService() {
    dismissAccountWelcome();
    navigation.replace('AddService');
  }

  return (
    <Screen padded={false} style={styles.screen}>
      <View style={styles.content}>
        <SuccessIllustration />
        <Text style={styles.title}>¡Listo!</Text>
        <Text style={styles.body}>Tu cuenta ha sido creada correctamente</Text>
        <View style={styles.actions}>
          <PrimaryButton onPress={goAddService}>AGREGAR SERVICIO</PrimaryButton>
          <SecondaryButton onPress={goHome}>Ahora no</SecondaryButton>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.xxxl,
    width: '100%',
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  screen: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
});
