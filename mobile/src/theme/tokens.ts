export type ThemeMode = 'day' | 'night';

export type AppTheme = {
  mode: ThemeMode;
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  overlay: string;
  primary: string;
  primaryHi: string;
  primaryLo: string;
  secondary: string;
  accent: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;
  pending: string;
  pendingBg: string;
  processing: string;
  processingBg: string;
  review: string;
  reviewBg: string;
  fg: string;
  fg2: string;
  fg3: string;
  border: string;
  borderHi: string;
  divider: string;
  disabledBg: string;
  disabledFg: string;
  shadowCard: string;
  shadowCardHi: string;
  shadowButton: string;
};

export const dayTheme: AppTheme = {
  mode: 'day',
  bg: '#F4F7FB',
  surface: '#FFFFFF',
  surface2: '#EEF3FA',
  surface3: '#E2EAF4',
  overlay: 'rgba(10, 22, 40, 0.45)',
  primary: '#1565E8',
  primaryHi: '#0D4FBF',
  primaryLo: '#5CB8FF',
  secondary: '#0A1628',
  accent: '#3B9BFF',
  success: '#15803D',
  successBg: '#DCFCE7',
  warning: '#B45309',
  warningBg: '#FEF3C7',
  error: '#B91C1C',
  errorBg: '#FEE2E2',
  info: '#1D4ED8',
  infoBg: '#DBEAFE',
  pending: '#A16207',
  pendingBg: '#FEF9C3',
  processing: '#0E7490',
  processingBg: '#CFFAFE',
  review: '#6D28D9',
  reviewBg: '#EDE9FE',
  fg: '#0A1628',
  fg2: '#3E5675',
  fg3: '#6E8AAC',
  border: '#D6DEEA',
  borderHi: '#C2CDDE',
  divider: '#E8EEF6',
  disabledBg: '#EEF2F7',
  disabledFg: '#9AAAC1',
  shadowCard: 'rgba(15, 30, 54, 0.12)',
  shadowCardHi: 'rgba(15, 30, 54, 0.18)',
  shadowButton: 'rgba(21, 101, 232, 0.32)',
};

export const nightTheme: AppTheme = {
  mode: 'night',
  bg: '#070F1E',
  surface: '#0F1E36',
  surface2: '#142848',
  surface3: '#1B335A',
  overlay: 'rgba(0, 4, 12, 0.66)',
  primary: '#3B9BFF',
  primaryHi: '#5CB8FF',
  primaryLo: '#1565E8',
  secondary: '#C9DEFF',
  accent: '#5CB8FF',
  success: '#34D399',
  successBg: 'rgba(52,211,153,0.14)',
  warning: '#FBBF24',
  warningBg: 'rgba(251,191,36,0.14)',
  error: '#F87171',
  errorBg: 'rgba(248,113,113,0.14)',
  info: '#60A5FA',
  infoBg: 'rgba(96,165,250,0.14)',
  pending: '#FCD34D',
  pendingBg: 'rgba(252,211,77,0.14)',
  processing: '#22D3EE',
  processingBg: 'rgba(34,211,238,0.14)',
  review: '#A78BFA',
  reviewBg: 'rgba(167,139,250,0.16)',
  fg: '#EAF1FB',
  fg2: '#9DB4D2',
  fg3: '#637E9F',
  border: '#1F385F',
  borderHi: '#264676',
  divider: '#142848',
  disabledBg: '#0F1E36',
  disabledFg: '#3E5675',
  shadowCard: 'rgba(0, 0, 0, 0.28)',
  shadowCardHi: 'rgba(0, 0, 0, 0.36)',
  shadowButton: 'rgba(59, 155, 255, 0.42)',
};
