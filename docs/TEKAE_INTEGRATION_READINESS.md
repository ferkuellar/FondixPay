# Tekae Integration Readiness Pack

Status: Sprint 019 canonical readiness pack. Documentation and planning only; no runtime Tekae integration is implemented by this file.

Last updated: 2026-06-04

## Purpose

This document is the canonical pre-implementation readiness pack for the future FONDIXPAY to Tekae integration. It consolidates the currently known Tekae launch model, security boundary, proposed backend session contract, environment gates, error handling expectations, and open questions that must be resolved before implementation.

Sprint 019 does not enable Tekae, configure credentials, create endpoints, add webhooks, change payment logic, alter provider adapters, modify schemas, deploy infrastructure, or change mobile/backend runtime behavior.

## Current Status

- Tekae is the approved provider target for FONDIXPAY.
- FONDIXPAY remains an app/platform using Tekae capabilities. It is not a fintech, bank, wallet, card processor, acquirer, SPEI processor, tokenization service, or banking core.
- Tekae runtime remains disabled until a later approved implementation sprint.
- DEV remains mock/demo only.
- STAGING is the first target for Tekae sandbox/test validation after readiness approval.
- PROD is blocked until secure network path, production credentials, backend token flow, audit, rollback, observability, reconciliation/support rules, and operational ownership are approved.

## Known Tekae Launch Model

Current Tekae documentation describes a responsive URL flow. FONDIXPAY can potentially open Tekae through one of these approved mobile strategies after product/security review:

- Browser redirect.
- WebView.
- Embedded iframe or equivalent web container where platform policy permits.

The rendering strategy is not finalized. Mobile must treat the launch as provider handoff only. Opening Tekae does not mean the user paid, that Tekae confirmed a transaction, or that FONDIXPAY may issue a production receipt.

## Token Generation Flow

Token/session generation is backend-only.

Tekae flow documented for readiness:

1. Backend prepares the required data: `UserCustomer`, `uid`, and `password`.
2. Optional Tekae launch parameters may include `redirect`, `menu`, `categoria`, `carrier`, and `blockview`.
3. Backend calls Tekae `POST /tokens/cipherData`.
4. Backend calls Tekae `POST /tokens/generateTokenCiphered`.
5. Tekae returns `accessToken`.
6. Backend builds the responsive launch URL:

```text
https://tekae.com.mx/responsive/user/uid/token/accessToken
```

Token lifecycle rules:

- `accessToken` is returned by Tekae and must be treated as sensitive.
- `refreshToken` is internal to Tekae and must not be used unless Tekae explicitly requires it and architecture approves it.
- `accessToken` is active for approximately 20 minutes.
- Token is unique per user/session.
- Backend must request a new token each time the user enters the Tekae tool.
- Expired tokens must not be reused; access after expiration is no longer allowed.

## Backend-Only Boundary

Mobile, admin, landing, and frontend code must never:

- Generate Tekae JWTs, tokens, or access URLs.
- Store or receive Tekae `uid`, `password`, provider credentials, or secrets.
- Log or persist raw `accessToken`, full launch URLs, provider passwords, or raw Tekae errors.
- Treat provider launch as provider-confirmed payment success.

The FONDIXPAY backend may generate/conform the Tekae access URL only after approval and only with server-side credentials stored in an approved secret store.

## Future Conceptual Architecture

```text
Mobile -> FONDIXPAY Backend -> Tekae token endpoints -> Tekae responsive URL -> Mobile opens approved launch strategy
```

Future backend responsibilities:

- Validate authenticated FONDIXPAY user.
- Validate environment gate and Tekae mode.
- Validate user eligibility, role, service coverage, catalog availability, and duplicate-flow protection.
- Build safe audit context and idempotency/correlation identifiers.
- Call Tekae `POST /tokens/cipherData`.
- Call Tekae `POST /tokens/generateTokenCiphered`.
- Build the responsive URL.
- Return only short-lived session metadata and launch URL to mobile.
- Record an audit event for every session creation attempt.
- Redact tokens, full URLs, credentials, provider payloads, and raw provider errors from logs/support/CRM.

Future mobile responsibilities:

- Request a backend session only after authenticated user action.
- Open Tekae through the approved rendering strategy.
- Display safe unavailable, pending, expired, failed, duplicate, or support copy when launch/session fails.
- Never infer payment success from launch, redirect, or client-side state.

## Proposed API Contract

Status: proposed only; not implemented.

Endpoint:

```text
POST /api/payments/tekae/session
```

Purpose: request a short-lived Tekae launch session for the authenticated user.

Required controls:

- Auth required.
- User-bound and environment-gated.
- Backend-only Tekae credentials.
- No provider tokens in logs.
- No raw provider errors in user responses.
- Audit event required for success, failure, timeout, duplicate, unauthorized, invalid config, and environment mismatch.
- Rate limiting required before production.
- Idempotency or duplicate-flow protection required before production.
- Bounded timeouts required for Tekae calls.

Conceptual request:

```json
{
  "intent": "open_tekae_tool",
  "user_service_id": "optional-internal-id",
  "menu": "optional-tekae-menu",
  "categoria": "optional-tekae-category",
  "carrier": "optional-tekae-carrier",
  "blockview": true,
  "redirect": "optional-approved-return-url",
  "idempotency_key": "client-or-backend-generated-key"
}
```

Conceptual response:

```json
{
  "session_id": "internal-session-id",
  "launch_url": "short-lived-tekae-responsive-url",
  "expires_at": "timestamp",
  "launch_mode": "browser_or_webview_or_redirect",
  "status": "session_ready"
}
```

This contract must remain proposed until the implementation sprint defines exact request/response schemas, RBAC, audit fields, idempotency behavior, timeout values, and safe error mappings.

## Environment Rules

DEV:

- Tekae disabled.
- No Tekae credentials.
- No token generation.
- Mock/demo only.

STAGING:

- First target for Tekae sandbox/test validation.
- Requires Tekae sandbox/test credentials, exact sandbox base URLs, and approved secret management.
- No real users or real money.
- Sandbox behavior must not be treated as production readiness.

PROD:

- Blocked until Tekae production credentials, secure network path, audit, rollback, observability, support, and operational ownership are approved.
- Production token generation must satisfy Tekae VPN/VPC or another approved secure network path.
- Production may not use sandbox credentials or dev auth behavior.

## Security Requirements

- Tekae `uid` and `password` are server-side secrets only.
- Mobile/frontend/admin must never receive provider credentials.
- `accessToken` and full access URLs must be redacted in logs, analytics, crash reports, screenshots, support tickets, CRM views, and audit metadata.
- `refreshToken` remains internal to Tekae unless Tekae explicitly requires use and architecture approves the change.
- `UserCustomer` must be a safe identifier and must avoid unnecessary PII.
- Raw Tekae errors must be mapped to safe user-facing messages.
- Every session creation attempt must be auditable.
- Provider payloads must be stored only as redacted summaries or hashes unless a later security review approves otherwise.
- Tekae launch/session creation must not mutate payment, receipt, ledger, reconciliation, or success state without provider-confirmed evidence defined in a later sprint.

## Required Error States

Future implementation must map these states to safe user-facing copy and support/audit behavior:

- Tekae unavailable.
- Cipher request failed.
- Token generation failed.
- Token expired.
- Invalid or expired session.
- Network timeout.
- Duplicate session/request attempt.
- Unauthorized user.
- Service unavailable in user location/state.
- Provider maintenance.
- Invalid provider config.
- Sandbox/prod mismatch.

## Branding And Personalization Readiness

Tekae supports or may require personalization inputs that should be requested and approved before launch:

- Header color.
- Menu color.
- Button color.
- Logo.
- Banners.
- Chat URL.
- FAQ link.
- Promo code field.
- Cobranding receipt configuration.

Branding changes must go through product review because they can affect user trust, support expectations, and visual consistency with FONDIXPAY.

## Operational Readiness Checklist

Implementation remains blocked until these items are approved or explicitly scoped:

- Tekae sandbox credentials and swagger/test URL obtained.
- Exact sandbox and production base URLs confirmed.
- Mobile rendering strategy selected: WebView, browser, redirect, embed, or other approved option.
- PROD secure network path confirmed: VPN, VPC, private connectivity, allowlist, or other Tekae-approved mechanism.
- Secret store selected for STAGING and PROD.
- `UserCustomer` identifier selected with PII constraints.
- Tekae error response formats confirmed.
- Timeout and retry recommendations confirmed.
- Audit fields finalized.
- Session metadata persistence policy finalized.
- Support process for failed/expired/duplicate/provider-maintenance sessions finalized.
- Branding/personalization settings requested and approved.
- Receipt/comprobante model confirmed: Tekae receipt sufficient, internal receipt required, or both.
- Service/catalog/geolocation mapping confirmed for `menu`, `categoria`, `carrier`, state coverage, and national services.
- Rollback and kill switch defined.
- Observability alerts and redaction validated.

## Non-Scope For Sprint 019

Sprint 019 does not change:

- Backend runtime behavior.
- Mobile runtime behavior.
- Payment logic or state transitions.
- Internal type names or store behavior.
- Provider adapters.
- Schemas or migrations.
- Webhook endpoints.
- `.env` secret values.
- Infrastructure, workflow, deployment, domain, DNS, or Vercel behavior.
- Screenshots or emulator evidence.
