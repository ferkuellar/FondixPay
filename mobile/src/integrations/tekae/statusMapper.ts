/**
 * Tekae status mapper — placeholder only.
 *
 * This file will translate Tekae's raw status codes to FONDIXPAY's
 * TekaeTransactionStatus type once official documentation is available.
 *
 * Current behavior: throws TekaeIntegrationDisabledError if called.
 * This is intentional — calling this function before the integration
 * is approved is a programming error.
 *
 * Do not implement real mapping until:
 *   - Q-005 (transaction status model) is resolved
 *   - TEKAE_ENABLED=true is approved
 */

import { TekaeIntegrationDisabledError } from './errors';
import { TEKAE_ENABLED } from './constants';
import type { TekaeTransactionStatus } from './types';

/**
 * Maps a raw Tekae status string to FONDIXPAY's internal status.
 *
 * Throws TekaeIntegrationDisabledError while TEKAE_ENABLED=false.
 * Mapping logic is TBD — depends on Q-005 (Tekae status model).
 */
export function mapTekaeStatus(_rawStatus: unknown): TekaeTransactionStatus {
  if (!TEKAE_ENABLED) {
    throw new TekaeIntegrationDisabledError();
  }

  // TODO: implement when Q-005 (Tekae transaction status model) is resolved.
  // Raw Tekae status codes and their FONDIXPAY equivalents are unknown.
  // Do not guess or invent status codes.
  return 'unknown';
}

/**
 * Returns true if the status represents a terminal (non-retriable) outcome.
 * Logic is TBD — depends on Q-005 and Q-010 (error handling).
 */
export function isTekaeTerminalStatus(status: TekaeTransactionStatus): boolean {
  if (!TEKAE_ENABLED) {
    throw new TekaeIntegrationDisabledError();
  }

  // TODO: implement when Q-005 and Q-010 are resolved.
  return status === 'succeeded' || status === 'failed' || status === 'reversed';
}
