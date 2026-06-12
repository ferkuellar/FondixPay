import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SuccessIllustration } from '../../components/SuccessIllustration';
import { PRIVACY_PAGE_URL } from '../../constants/links';
import { useAuthStore } from '../../store/authStore';
import { spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountCreated'>;

export function AccountCreatedScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const dismissAccountWelcome = useAuthStore((state) => state.dismissAccountWelcome);
  const user = useAuthStore((state) => state.user);

  const firstName = user?.name?.trim().split(' ')[0];
  const title = firstName ? `¡Hola, ${firstName}!` : '¡Listo!';

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
        <Text style={[styles.title, { color: theme.fg }]}>{title}</Text>
        <Text style={[styles.body, { color: theme.fg2 }]}>Tu cuenta ha sido creada correctamente</Text>
        <View style={styles.actions}>
          <PrimaryButton onPress={goAddService}>AGREGAR SERVICIO</PrimaryButton>
          <SecondaryButton onPress={goHome}>Ahora no</SecondaryButton>
        </View>
        <Text style={[styles.consentNote, { color: theme.fg3 }]}>
          {'Al crear tu cuenta aceptas nuestro '}
          <Text
            accessibilityRole={PRIVACY_PAGE_URL ? 'link' : 'text'}
            onPress={PRIVACY_PAGE_URL ? () => void Linking.openURL(PRIVACY_PAGE_URL) : undefined}
            style={PRIVACY_PAGE_URL ? [styles.consentLink, { color: theme.primary }] : undefined}
          >
            Aviso de Privacidad
          </Text>
          {'.'}
        </Text>
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
    marginTop: spacing.md,
    textAlign: 'center',
  },
  consentLink: {
    fontWeight: '600',
  },
  consentNote: {
    ...typography.caption,
    marginTop: spacing.lg,
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
    marginTop: spacing.xl,
  },
});
