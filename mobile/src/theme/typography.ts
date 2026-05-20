import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
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
  } satisfies TextStyle,
  title: {
    fontFamily,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  } satisfies TextStyle,
  heading: {
    fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  } satisfies TextStyle,
  body: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
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
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  caption: {
    fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
  } satisfies TextStyle,
};
