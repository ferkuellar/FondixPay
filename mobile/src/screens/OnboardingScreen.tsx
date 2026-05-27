import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { spacing, typography, useAppTheme } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const { theme } = useAppTheme();

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Image resizeMode="contain" source={require('../assets/images/logo-fondix-pay.png')} style={styles.logo} />
            <Pressable onPress={() => navigation.navigate('PhoneLogin')}>
              <Text style={[styles.skip, { color: theme.fg2 }]}>Saltar</Text>
            </Pressable>
          </View>
          <View style={styles.heroSection}>
            <Image
              accessibilityLabel="Ilustración de bienvenida de FondixPay"
              resizeMode="contain"
              source={require('../assets/images/onboarding-hero.png')}
              style={styles.heroImage}
            />
          </View>

          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.fg }]}>
              Paga tus servicios <Text style={{ color: theme.primary }}>fácil, rápido y seguro</Text>
            </Text>
            <Text style={[styles.subtitle, { color: theme.fg2 }]}>
              Luz, agua, internet, gas y recargas — todo en un solo lugar, en menos de un minuto.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={() => navigation.navigate('PhoneLogin')}>Empezar ahora</PrimaryButton>
          <Pressable onPress={() => navigation.navigate('PhoneLogin')} style={styles.loginLink}>
            <Text style={[styles.loginText, { color: theme.fg2 }]}>
              ¿Ya tienes cuenta? <Text style={{ color: theme.primary, fontWeight: '700' }}>Inicia sesión</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  copy: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroImage: {
    alignSelf: 'center',
    height: 390,
    maxWidth: 450,
    width: '112%',
  },
  heroSection: {
    alignItems: 'center',
    height: 390,
    justifyContent: 'center',
    marginHorizontal: -spacing.lg,
    overflow: 'hidden',
  },
  subtitle: {
    ...typography.bodyLg,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  logo: {
    height: 34,
    width: 86,
  },
  loginLink: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  loginText: {
    ...typography.caption,
  },
  skip: {
    ...typography.caption,
    fontWeight: '700',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
  },
});
