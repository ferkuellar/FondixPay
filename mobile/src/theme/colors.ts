export const colors = {
  primary: '#1E5FE8',
  primaryDark: '#1748B8',
  primarySoft: '#EFF6FF',
  success: '#22C55E',
  successSoft: '#DCFCE7',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  bg: '#FFFFFF',
  bgSubtle: '#F9FAFB',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  service: {
    luz: '#22C55E',
    internet: '#3B82F6',
    celular: '#8B5CF6',
    gas: '#F97316',
    agua: '#06B6D4',
  },
  /** @deprecated Use bgSubtle */
  background: '#F9FAFB',
  /** @deprecated Use bg */
  surface: '#FFFFFF',
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
