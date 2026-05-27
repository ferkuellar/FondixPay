import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'Bricolage Grotesque',
  android: 'Bricolage Grotesque',
  default: 'System',
});
const monoFamily = Platform.select({
  ios: 'Azeret Mono',
  android: 'Azeret Mono',
  default: 'monospace',
});

export const fontSizes = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  display: 40,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  display: {
    fontFamily,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: 42,
  } satisfies TextStyle,
  title: {
    fontFamily,
    fontSize: 28,
    fontWeight: fontWeights.bold,
    lineHeight: 32,
  } satisfies TextStyle,
  heading: {
    fontFamily,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    lineHeight: 27,
  } satisfies TextStyle,
  body: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 23,
  } satisfies TextStyle,
  bodyLg: {
    fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: 26,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 19,
  } satisfies TextStyle,
  label: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  } satisfies TextStyle,
  button: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
  } satisfies TextStyle,
  caption: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 18,
  } satisfies TextStyle,
  micro: {
    fontFamily,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.8,
    lineHeight: 14,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  amount: {
    fontFamily: monoFamily,
    fontSize: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 38,
  } satisfies TextStyle,
  amountSmall: {
    fontFamily: monoFamily,
    fontSize: 20,
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    lineHeight: 24,
  } satisfies TextStyle,
  mono: {
    fontFamily: monoFamily,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0,
  } satisfies TextStyle,
};
