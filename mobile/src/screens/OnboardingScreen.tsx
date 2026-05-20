import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { colors, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <Text style={styles.logoMark}>F</Text>
          <Text style={styles.brandText}>
            FONDIX <Text style={styles.brandAccent}>PAY</Text>
          </Text>
        </View>

        {/* TODO: Replace with production splash illustration asset (person + floating service icons). */}
        <View accessibilityLabel="Ilustración de bienvenida (placeholder)" style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>👩‍💻📱</Text>
          <View style={styles.floatingIcons}>
            <Text style={styles.floatIcon}>⚡</Text>
            <Text style={styles.floatIcon}>📶</Text>
            <Text style={styles.floatIcon}>📱</Text>
            <Text style={styles.floatIcon}>💧</Text>
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>Paga todos tus servicios en un solo lugar</Text>
          <Text style={styles.subtitle}>Rápido, fácil y seguro</Text>
        </View>

        <PrimaryButton onPress={() => navigation.navigate('PhoneLogin')}>EMPEZAR</PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxxl,
  },
  brandAccent: {
    color: colors.primary,
  },
  brandText: {
    ...typography.heading,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  floatIcon: {
    fontSize: 20,
  },
  floatingIcons: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  illustration: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 120,
    height: 220,
    justifyContent: 'center',
    width: 220,
  },
  illustrationEmoji: {
    fontSize: 56,
  },
  logoMark: {
    color: colors.primary,
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '800',
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
