/**
 * Tekae integration type stubs — SSO model confirmed by Manual de integración Tekae Business v3.1.
 *
 * Tekae uses an SSO responsivo model: backend generates a token and constructs a launch URL.
 * Mobile receives only the session URL and opens it in a WebView or browser.
 * Mobile never calls Tekae token endpoints directly.
 * Mobile never receives uid, password, accessToken, or raw Tekae credentials.
 *
 * Do not implement active types until TEKAE_ENABLED=true is approved.
 */

/**
 * Optional parameters that backend may include when requesting a Tekae session.
 * Values confirmed from Manual de integración Tekae Business v3.1.
 * Backend constructs these — mobile only passes intent/context to the backend session endpoint.
 */
export type TekaeMenuValue = null | '1' | '2' | '3';
// null   = Home (default)
// "1"    = Tiempo Aire
// "2"    = Pago de Servicios
// "3"    = Entretenimiento

export type TekaeSessionParams = {
  menu?: TekaeMenuValue;
  categoria?: string | null;
  carrier?: string | null;
  blockview?: boolean;
  redirect?: boolean;
};

/**
 * Request mobile sends to the FondixPay backend session endpoint.
 * POST /api/payments/tekae/session
 * Backend handles all Tekae credential logic — mobile only passes optional context.
 */
export type TekaeSessionRequest = {
  menu?: TekaeMenuValue;
  categoria?: string | null;
  carrier?: string | null;
  blockview?: boolean;
};

/**
 * Response mobile receives from the FondixPay backend session endpoint (Sprint 086).
 * Mobile opens portalUrl in the device browser — never stores or logs this URL.
 * portalUrl contains an embedded accessToken valid for expiresIn seconds.
 * sessionRef is a safe audit correlation ID only.
 */
export type TekaeSessionResponse = {
  portalUrl: string;
  expiresIn: number;
  sessionRef: string;
};

/**
 * Tekae session result as FONDIXPAY tracks it internally.
 * SSO launch is NOT payment success — it only proves the user entered Tekae.
 * Payment outcomes require Tekae webhook/status evidence (pending contract).
 */
export type TekaeSessionOutcome =
  | 'launched'
  | 'expired'
  | 'failed'
  | 'unavailable'
  | 'unknown';

/**
 * Webhook payload from Tekae — structure UNKNOWN pending official Tekae contract.
 * Do not implement until Q-006 is resolved with official Tekae documentation.
 */
export type TekaeWebhookPayload = {
  readonly _placeholder: 'TBD — awaiting official Tekae webhook specification (Q-006)';
};

/** Tekae error response shape — TBD from official Swagger (Q-010). */
export type TekaeErrorResponse = {
  readonly _placeholder: 'TBD — awaiting official Tekae Swagger (Q-010)';
};
