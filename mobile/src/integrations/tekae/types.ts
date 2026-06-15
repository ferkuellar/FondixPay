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
 * POST /api/payments/tekae/session (proposed — not yet implemented)
 * Mobile sends intent and optional context; backend handles all Tekae credential logic.
 */
export type TekaeSessionRequest = {
  intent: 'open_tekae_tool';
  user_service_id?: string;
  menu?: TekaeMenuValue;
  categoria?: string | null;
  carrier?: string | null;
  blockview?: boolean;
  redirect?: boolean;
  idempotency_key?: string;
};

/**
 * Response mobile receives from the FondixPay backend session endpoint.
 * Mobile opens launch_url in an approved WebView or browser.
 * Mobile never receives uid, password, accessToken, or raw Tekae URLs with credentials embedded.
 * launch_url is a short-lived Tekae responsive URL valid for ~20 minutes.
 */
export type TekaeSessionResponse = {
  session_id: string;
  launch_url: string;
  expires_at: string;
  launch_mode: 'browser' | 'webview' | 'redirect';
  status: 'session_ready';
};

/**
 * Internal session state FONDIXPAY tracks for audit traceability.
 * Only safe identifiers — no credentials, no raw accessToken, no uid/password.
 */
export type TekaeSessionReference = {
  sessionId: string;
  launchMode: 'browser' | 'webview' | 'redirect';
  requestedAt: string;
  expiresAt: string;
  menuContext: TekaeMenuValue;
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
