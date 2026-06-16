# Sprint 086 — Tekae Backend Session Endpoint

## Objective

Implement the FONDIXPAY backend endpoint that generates a Tekae SSO session and returns the portal URL to the mobile app.

This sprint enables the mobile app to open the Tekae responsive payment platform. It does not implement payment confirmation, webhook handling, reconciliation, or mobile WebView.

## Context

- Sprint 011 confirmed the full sandbox API contract end-to-end.
- Authentication: `Authorization: Bearer {TEKAE_BEARER}` + `uid` + KMS-encrypted `password` in body.
- Step 1: `POST /tokens/cipherData` → `{ data, uid }`
- Step 2: `POST /tokens/generateTokenCiphered` → `{ accessToken, refreshToken }`
- Portal URL: `{TEKAE_RESPONSIVE_BASE_URL}/user/{TEKAE_PORTAL_UID}/token/{accessToken}`
- Token TTL: 30 minutes. No caching. New token per session.
- `TEKAE_UID` (API body) ≠ `TEKAE_PORTAL_UID` (portal URL). Two distinct credentials.
- `TEKAE_ENABLED=false` gating must be respected at runtime.

## In Scope

- Backend only. New endpoint: `POST /api/payments/tekae/session`.
- Tekae service module with `cipher_data()` and `generate_token_ciphered()` functions.
- Tekae config module reading from environment variables.
- Startup validation: if `TEKAE_ENABLED=true`, all required Tekae env vars must be present.
- Audit event on every session generation attempt (success and failure).
- Redaction: `accessToken`, full portal URL, raw Tekae error bodies must not appear in logs, audit events, or CRM views.
- `backend/.env.example` already updated (Sprint 011). No changes needed.
- Backend tests: happy path, env gate, missing config, Tekae error simulation.

## Out of Scope

- No mobile WebView implementation (separate sprint).
- No webhook endpoint for Tekae callbacks (Q-006 still unresolved).
- No payment success detection from Tekae (requires webhook/status mechanism — unresolved).
- No automatic receipt generation from Tekae session.
- No reconciliation changes.
- No CRM admin changes.
- No landing changes.
- No production credentials. Sandbox only.
- No database migration (no new models required in this sprint).

## API Contract

### `POST /api/payments/tekae/session`

**Auth:** FONDIXPAY JWT (authenticated mobile user required)

**Request body (optional fields):**
```json
{
  "menu":      null,
  "categoria": null,
  "carrier":   null,
  "blockview": false
}
```

**Response 200:**
```json
{
  "portalUrl":   "https://responsive-dot-tekae.../user/.../token/...",
  "expiresIn":   1800,
  "sessionRef":  "uuid-for-audit"
}
```
- `portalUrl` — complete URL for mobile to open. Never store this value; return once per request.
- `expiresIn` — seconds until the token expires (30 minutes = 1800).
- `sessionRef` — audit correlation ID. Does not expose the token.

**Response 503:**
```json
{ "detail": "Servicio de pago no disponible. Intenta más tarde." }
```
When `TEKAE_ENABLED=false` or Tekae API is unreachable.

**Response 401:** FONDIXPAY user not authenticated.

## Security Rules

- `TEKAE_BEARER`, `TEKAE_UID`, `TEKAE_PASSWORD`, `TEKAE_PORTAL_UID` are loaded from env vars only.
- `accessToken` is never stored in the database, logged, or returned beyond the `portalUrl`.
- `portalUrl` is never stored in the database or logged.
- Tekae error response bodies are logged only at DEBUG level with PII redacted.
- `refreshToken` returned by Tekae is discarded (not needed for the current flow).
- The endpoint is gated by `TEKAE_ENABLED` env var.

## Business Rules

- Generating a Tekae session is NOT payment success.
- Launching the portal URL is NOT payment success.
- FONDIXPAY may not infer payment success from any step in this sprint.
- Payment success requires a separate confirmed Tekae evidence channel (future sprint).

## Environment

- All testing against sandbox URL and sandbox credentials.
- No production credentials in any file.
- `TEKAE_ENABLED=false` remains the default in `.env.example`.
