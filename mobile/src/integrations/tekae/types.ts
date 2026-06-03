/**
 * Tekae integration type stubs.
 *
 * All types here are PLACEHOLDERS. Field names, shapes, and values are unknown
 * until official Tekae documentation is reviewed.
 *
 * Do not implement these types until planning/TEKAE_OPEN_QUESTIONS.md is resolved.
 * Do not use these types in production payment code while TEKAE_ENABLED=false.
 */

/** Payment initiation request — shape TBD from official Tekae docs (Q-001, Q-002, Q-004). */
export type TekaePaymentRequest = {
  readonly _placeholder: 'TBD — awaiting Tekae documentation';
};

/** Payment result returned by Tekae — status model TBD (Q-005). */
export type TekaePaymentResult = {
  readonly _placeholder: 'TBD — awaiting Tekae documentation';
};

/** Webhook payload from Tekae — structure TBD (Q-006). */
export type TekaeWebhookPayload = {
  readonly _placeholder: 'TBD — awaiting Tekae documentation';
};

/**
 * Transaction status as FONDIXPAY understands it, mapped from Tekae statuses.
 * Specific Tekae status codes are TBD (Q-005).
 */
export type TekaeTransactionStatus =
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'reversed'
  | 'unknown';

/** Tekae error response shape — TBD from official docs (Q-010). */
export type TekaeErrorResponse = {
  readonly _placeholder: 'TBD — awaiting Tekae documentation';
};

/**
 * Safe reference FONDIXPAY stores for audit traceability.
 * Only IDs — no card data, no credentials.
 */
export type TekaeTransactionReference = {
  tekaeReferenceId: string;
  status: TekaeTransactionStatus;
  currency: 'MXN';
  amountMinor: number;
  capturedAt?: string;
};
