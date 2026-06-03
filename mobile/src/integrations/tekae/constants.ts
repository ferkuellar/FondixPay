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

export const TEKAE_ENABLED = false as const;

export type TekaeMode = 'disabled' | 'unavailable' | 'ready_for_sandbox' | 'ready_for_production';

export const TEKAE_MODE: TekaeMode = 'disabled';

/**
 * User-facing message shown in any screen where Tekae payment action would appear.
 * Must not reveal "Tekae" as a provider name without product approval.
 */
export const TEKAE_UNAVAILABLE_MESSAGE =
  'Servicio en preparación. Muy pronto podrás pagar desde FONDIXPAY.' as const;

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
