/**
 * Tekae integration feature flags.
 *
 * TEKAE_ENABLED must remain false until:
 *   1. Official Tekae documentation is reviewed.
 *   2. All open questions in planning/TEKAE_OPEN_QUESTIONS.md are resolved.
 *   3. Sprint 008b-tekae-integration-discovery acceptance criteria are met.
 *   4. A new implementation sprint is approved.
 *
 * Do not set TEKAE_ENABLED=true without explicit product + security approval.
 */

export const TEKAE_ENABLED: boolean = process.env.EXPO_PUBLIC_TEKAE_ENABLED === 'true';

export type TekaeMode = 'disabled' | 'unavailable' | 'ready_for_sandbox' | 'ready_for_production';

export const TEKAE_MODE: TekaeMode = TEKAE_ENABLED ? 'ready_for_sandbox' : 'disabled';

/**
 * User-facing message shown in any screen where Tekae payment action would appear.
 * Must not reveal "Tekae" as a provider name without product approval.
 */
export const TEKAE_UNAVAILABLE_MESSAGE =
  'Servicio en preparación. La función estará disponible cuando el proveedor aprobado esté listo.' as const;

/**
 * Tekae integration states, in order of progression.
 * FONDIXPAY must not skip states.
 */
export const TEKAE_STATES = {
  DISABLED: 'disabled',
  UNAVAILABLE: 'unavailable',
  READY_FOR_SANDBOX: 'ready_for_sandbox',
  READY_FOR_PRODUCTION: 'ready_for_production',
} as const satisfies Record<string, TekaeMode>;
