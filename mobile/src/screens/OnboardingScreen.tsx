import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { colors, spacing, typography, useAppTheme } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type Slide = {
  accentColor: string;
  titlePrefix: string;
  titleHighlight: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    accentColor: colors.service.luz,
    titlePrefix: 'Paga tus servicios ',
    titleHighlight: 'fácil, rápido y seguro',
    body: 'Luz, agua, internet, gas y recargas — todo en un solo lugar, en menos de un minuto.',
  },
  {
    accentColor: colors.service.internet,
    titlePrefix: 'Tus recibos, ',
    titleHighlight: 'siempre a la mano',
    body: 'Guardamos tus servicios y te avisamos antes de que venzan. Nunca más una multa por olvido.',
  },
  {
    accentColor: colors.service.celular,
    titlePrefix: 'Paga en ',
    titleHighlight: '2 taps, sin filas',
    body: 'Confirmación en 5 segundos y tu comprobante directo a WhatsApp. Así de simple.',
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const [slideIndex, setSlideIndex] = useState(0);

  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      navigation.navigate('PhoneLogin');
    } else {
      setSlideIndex((i) => i + 1);
    }
  }

  return (
    <Screen padded={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Image
              resizeMode="contain"
              source={require('../assets/images/logo-fondix-pay.png')}
              style={styles.logo}
            />
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
            {/* Pagination dots */}
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: i === slideIndex ? theme.primary : theme.border,
                      width: i === slideIndex ? 28 : 8,
                    },
                  ]}
                />
              ))}
            </View>

            <Text style={[styles.title, { color: theme.fg }]}>
              {slide.titlePrefix}
              <Text style={{ color: theme.primary }}>{slide.titleHighlight}</Text>
            </Text>
            <Text style={[styles.subtitle, { color: theme.fg2 }]}>{slide.body}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton onPress={handleNext}>
            {isLast ? 'Empezar ahora' : 'Continuar'}
          </PrimaryButton>
          <Pressable onPress={() => navigation.navigate('PhoneLogin')} style={styles.loginLink}>
            <Text style={[styles.loginText, { color: theme.fg2 }]}>
              ¿Ya tienes cuenta?{' '}
              <Text style={{ color: theme.primary, fontWeight: '700' }}>Inicia sesión</Text>
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
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
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
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.sm,
  },
  dot: {
    borderRadius: 2,
    height: 4,
  },
  heroImage: {
    alignSelf: 'center',
    height: 360,
    maxWidth: 450,
    width: '112%',
  },
  heroSection: {
    alignItems: 'center',
    height: 360,
    justifyContent: 'center',
    marginHorizontal: -spacing.lg,
    overflow: 'hidden',
  },
  logo: {
    height: 34,
    width: 86,
  },
  loginLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  loginText: {
    ...typography.caption,
  },
  skip: {
    ...typography.caption,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.bodyLg,
    minHeight: 72,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
  },
});
