import { dayTheme } from './tokens';

export const colors = {
  primary: dayTheme.primary,
  primaryDark: dayTheme.primaryHi,
  primarySoft: '#EAF4FF',
  primaryLo: dayTheme.primaryLo,
  secondary: dayTheme.secondary,
  accent: dayTheme.accent,
  success: dayTheme.success,
  successSoft: '#E8F7EE',
  warning: dayTheme.warning,
  warningSoft: '#FFF5DF',
  danger: dayTheme.error,
  dangerSoft: '#FDECEC',
  error: dayTheme.error,
  errorSoft: '#FDECEC',
  info: dayTheme.info,
  infoSoft: '#EAF2FF',
  pending: dayTheme.pending,
  processing: dayTheme.processing,
  review: dayTheme.review,
  bg: dayTheme.bg,
  bgSubtle: dayTheme.surface2,
  surface: dayTheme.surface,
  surface2: dayTheme.surface2,
  surface3: dayTheme.surface3,
  border: dayTheme.border,
  borderHi: dayTheme.borderHi,
  divider: dayTheme.divider,
  textPrimary: dayTheme.fg,
  textSecondary: dayTheme.fg2,
  textMuted: dayTheme.fg3,
  disabledBg: dayTheme.disabledBg,
  disabledFg: dayTheme.disabledFg,
  service: {
    luz: '#22C55E',
    internet: '#3B82F6',
    celular: '#8B5CF6',
    gas: '#F97316',
    agua: '#06B6D4',
  },
  /** @deprecated Use bgSubtle */
  background: '#F9FAFB',
  /** @deprecated Use textPrimary */
  text: '#111827',
  /** @deprecated Use textSecondary */
  muted: '#6B7280',
};

export type ServiceCategoryKey = 'ELECTRICITY' | 'INTERNET' | 'PHONE' | 'GAS' | 'WATER' | 'TV' | 'OTHER';

export function serviceColorForCategory(category: string) {
  const map: Record<string, string> = {
    ELECTRICITY: colors.service.luz,
    electricity: colors.service.luz,
    INTERNET: colors.service.internet,
    internet: colors.service.internet,
    telecom: colors.service.internet,
    PHONE: colors.service.celular,
    mobile_topup_or_bill: colors.service.celular,
    GAS: colors.service.gas,
    gas: colors.service.gas,
    WATER: colors.service.agua,
    water: colors.service.agua,
    TV: colors.service.internet,
    government: colors.textSecondary,
    OTHER: colors.textSecondary,
    other: colors.textSecondary,
  };
  return map[category] ?? colors.primary;
}
