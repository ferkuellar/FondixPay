import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { colors, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Image
              accessibilityLabel="Ilustración de bienvenida de FondixPay"
              resizeMode="contain"
              source={require('../assets/images/onboarding-hero.png')}
              style={styles.heroImage}
            />
          </View>

          <View style={styles.copy}>
            <Text style={styles.title}>Paga todos tus servicios en un solo lugar</Text>
            <Text style={styles.subtitle}>Rápido, fácil y seguro</Text>
          </View>
        </View>

        <PrimaryButton onPress={() => navigation.navigate('PhoneLogin')}>EMPEZAR</PrimaryButton>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  copy: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  heroImage: {
    alignSelf: 'center',
    height: 380,
    maxWidth: 390,
    width: '112%',
  },
  heroSection: {
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
