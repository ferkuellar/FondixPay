/**
 * Tekae integration error classes — stubs only.
 *
 * These classes define the error taxonomy for when Tekae integration is live.
 * They must not be thrown in production from real payment logic until
 * TEKAE_ENABLED=true and the integration is approved.
 *
 * Error categories must align with docs/OBSERVABILITY.md error taxonomy.
 */

/** Thrown when a Tekae action is attempted while TEKAE_ENABLED=false. */
export class TekaeIntegrationDisabledError extends Error {
  readonly category = 'provider_disabled' as const;

  constructor() {
    super(
      'Tekae integration is disabled. Set TEKAE_ENABLED=true only after sprint 008b-tekae-integration-discovery acceptance criteria are met.',
    );
    this.name = 'TekaeIntegrationDisabledError';
  }
}

/** Thrown when FONDIXPAY cannot reach Tekae. Maps to error category: network_unreachable. */
export class TekaeNetworkError extends Error {
  readonly category = 'network_unreachable' as const;

  constructor(message?: string) {
    super(message ?? 'No pudimos conectar con el servicio de pagos.');
    this.name = 'TekaeNetworkError';
  }
}

/** Thrown when Tekae does not respond within the timeout window. Maps to: provider_timeout. */
export class TekaeTimeoutError extends Error {
  readonly category = 'provider_timeout' as const;

  constructor() {
    super('El servicio de pagos no respondió a tiempo. Intenta de nuevo.');
    this.name = 'TekaeTimeoutError';
  }
}

/** Thrown when Tekae rejects the payment. Maps to: provider_rejected. */
export class TekaePaymentRejectedError extends Error {
  readonly category = 'provider_rejected' as const;

  constructor(message?: string) {
    super(message ?? 'No pudimos completar tu pago. Intenta de nuevo.');
    this.name = 'TekaePaymentRejectedError';
  }
}

/** Thrown when Tekae returns a 5xx or service error. Maps to: provider_unavailable. */
export class TekaeServiceError extends Error {
  readonly category = 'provider_unavailable' as const;

  constructor() {
    super('El servicio de pagos no está disponible en este momento. Intenta más tarde.');
    this.name = 'TekaeServiceError';
  }
}

/** Thrown when idempotency key indicates a duplicate payment attempt. Maps to: payment_duplicate. */
export class TekaePaymentDuplicateError extends Error {
  readonly category = 'payment_duplicate' as const;
  readonly originalPaymentId: string;

  constructor(originalPaymentId: string) {
    super('Este pago ya fue procesado.');
    this.name = 'TekaePaymentDuplicateError';
    this.originalPaymentId = originalPaymentId;
  }
}

/** Union of all Tekae-specific errors. */
export type TekaeError =
  | TekaeIntegrationDisabledError
  | TekaeNetworkError
  | TekaeTimeoutError
  | TekaePaymentRejectedError
  | TekaeServiceError
  | TekaePaymentDuplicateError;

export function isTekaeError(error: unknown): error is TekaeError {
  return (
    error instanceof TekaeIntegrationDisabledError ||
    error instanceof TekaeNetworkError ||
    error instanceof TekaeTimeoutError ||
    error instanceof TekaePaymentRejectedError ||
    error instanceof TekaeServiceError ||
    error instanceof TekaePaymentDuplicateError
  );
}
