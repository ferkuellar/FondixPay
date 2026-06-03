import { dayTheme } from './tokens';

export const colors = {
  primary: dayTheme.primary,
  primaryDark: dayTheme.primaryHi,
  primarySoft: '#EAF4FF',
  primaryLo: dayTheme.primaryLo,
  secondary: dayTheme.secondary,
  accent: dayTheme.accent,
  success: dayTheme.success,
  successSoft: dayTheme.successBg,
  warning: dayTheme.warning,
  warningSoft: dayTheme.warningBg,
  danger: dayTheme.error,
  dangerSoft: dayTheme.errorBg,
  error: dayTheme.error,
  errorSoft: dayTheme.errorBg,
  info: dayTheme.info,
  infoSoft: dayTheme.infoBg,
  pending: dayTheme.pending,
  pendingSoft: dayTheme.pendingBg,
  processing: dayTheme.processing,
  processingSoft: dayTheme.processingBg,
  review: dayTheme.review,
  reviewSoft: dayTheme.reviewBg,
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
    luz: '#D97706',        // amber — CFE/Electricity
    internet: '#15803D',   // green — Internet
    celular: '#6D28D9',    // purple — Celular/TAE
    gas: '#C2410C',        // orange-red — Gas
    agua: '#0369A1',       // blue — Water
    streaming: '#BE185D',  // rose — Streaming/TV
    gobierno: '#047857',   // emerald — Government services
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
    TV: colors.service.streaming,
    government: colors.service.gobierno,
    OTHER: colors.textSecondary,
    other: colors.textSecondary,
  };
  return map[category] ?? colors.primary;
}
