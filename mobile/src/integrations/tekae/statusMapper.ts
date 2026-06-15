/**
 * Tekae session outcome mapper — placeholder only.
 *
 * Tekae uses an SSO responsivo model (Manual v3.1). There is no direct transaction
 * status API confirmed. This mapper will translate Tekae session/callback states
 * to FONDIXPAY's TekaeSessionOutcome once the webhook/status contract is confirmed.
 *
 * Current behavior: throws TekaeIntegrationDisabledError if called.
 * This is intentional — calling this function before the integration
 * is approved is a programming error.
 *
 * Do not implement real mapping until:
 *   - Q-006 (webhook/callback model) is resolved with official Tekae documentation
 *   - TEKAE_ENABLED=true is approved
 */

import { TekaeIntegrationDisabledError } from './errors';
import { TEKAE_ENABLED } from './constants';
import type { TekaeSessionOutcome } from './types';

/**
 * Maps a raw Tekae session/callback state to FONDIXPAY's TekaeSessionOutcome.
 *
 * Throws TekaeIntegrationDisabledError while TEKAE_ENABLED=false.
 * Mapping logic is TBD — SSO model does not expose direct transaction status codes.
 * Do not implement until Q-006 (webhook/callback) and Q-010 (error codes) are resolved.
 */
export function mapTekaeSessionOutcome(_rawState: unknown): TekaeSessionOutcome {
  if (!TEKAE_ENABLED) {
    throw new TekaeIntegrationDisabledError();
  }

  // TODO: implement when official Tekae callback/webhook contract is received (Q-006).
  // The SSO model does not guarantee a status callback — do not invent states.
  return 'unknown';
}

/**
 * Returns true if the outcome is terminal (non-retriable) for the session.
 * Logic is TBD — depends on Q-006 (Tekae webhook/callback model).
 */
export function isTekaeTerminalOutcome(outcome: TekaeSessionOutcome): boolean {
  if (!TEKAE_ENABLED) {
    throw new TekaeIntegrationDisabledError();
  }

  // TODO: implement when Q-006 and Q-010 are resolved.
  return outcome === 'launched' || outcome === 'failed' || outcome === 'expired';
}
