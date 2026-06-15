const appEnv = process.env.EXPO_PUBLIC_APP_ENV?.trim().toLowerCase();

export function getAppEnv(): string {
  return appEnv ?? 'unknown';
}

export function isProductionEnv(): boolean {
  if (appEnv) return appEnv === 'production';
  return process.env.NODE_ENV === 'production';
}

/**
 * Returns true only when EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS=true is
 * explicitly set. Default is false so the internal scenario picker never
 * appears in builds where the flag is absent.
 */
export function isQaScenariosEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS === 'true';
}
