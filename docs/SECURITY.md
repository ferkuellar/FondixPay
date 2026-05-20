# Security

## Current State

Authentication is mock/dev OTP based. The development OTP is configured as `OTP_DEV_CODE=123456` in `.env.example`.

FondixPay is not production financial software yet.

## Rules

- No real secrets in the repository.
- Secrets must come from environment-specific secret stores.
- Private endpoints must require authentication.
- Authorization must be enforced on the backend.
- Future financial actions must generate audit logs.
- Real provider webhooks must be authenticated and persisted.
- User-facing errors must not expose stack traces.

## Current Risk Areas

- Development OTP.
- Missing rate limiting.
- Missing production SMS/OTP delivery design.
- Missing RBAC implementation.
- Missing audit logs.
- Missing ledger.
- Missing real provider webhook validation.
- CORS must be restricted per environment.
- Payment provider and compliance decisions are pending.

## Mobile Security

- Expo Secure Store is available and should be used for sensitive session storage.
- Session expiration, refresh, revocation, and logout behavior require hardening.
- Avoid storing sensitive personal or financial data in plain client state.

## Backend Security

- Validate inputs for all write endpoints.
- Protect private endpoints.
- Enforce ownership checks.
- Use consistent error responses.
- Add rate limiting for OTP and payment-sensitive endpoints.
- Add security headers at deployment edge.

## Not Production Ready

Real financial use is blocked until authentication, authorization, audit, ledger, validation, observability, provider integration, and compliance review are completed.

## Phase 4A Auth & Session Rules

Current auth remains phone + OTP + access token. The implementation is still mock/dev for OTP delivery: no real SMS provider is integrated and the development OTP remains `123456` for local work.

Environment behavior:

- `development`: OTP dev code may be returned as `otp_dev` only when `OTP_DEV_RESPONSE_ENABLED=true`.
- `test`: OTP dev code may be returned for automated tests when explicitly enabled.
- `staging`: `otp_dev` must not be returned; `JWT_SECRET_KEY` must be strong; CORS must be explicit.
- `production`: same as staging; real OTP delivery requires an approved provider and separate implementation phase.

JWT rules:

- `JWT_SECRET_KEY` must not use placeholders such as `change-me`, `dev-secret`, `secret`, `changeme`, or short values outside development.
- `JWT_ALGORITHM` is currently `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES` is configurable and defaults to 60 minutes.
- Refresh tokens, server-side token revocation, session inventory, and device trust are not implemented yet.

Mobile session rules:

- Expo Secure Store may store the current access token only.
- Mobile must handle missing `otp_dev`; users can manually enter the OTP.
- Invalid session restore must clear local token state.

Remaining production blockers:

- Real OTP/SMS provider.
- Rate limiting and brute-force protection.
- Auth audit logs.
- Refresh/revocation/session inventory.
- RBAC enforcement.
- Ledger and audit foundation before any real payments.

## Phase 4B Security Validation Results

Automated tests now cover:

- Invalid bearer token rejected by `/auth/me`.
- Development OTP flow still works in test/dev conditions.
- Anonymous access rejected for:
  - `GET /users/me`
  - `GET /user-services`
  - `POST /user-services`
  - `GET /payments`
  - `POST /payments`
  - `GET /receipts`
  - `GET /notifications`
- User-scoped list endpoints do not return another user's services, payments, receipts, or notifications.
- Public service provider catalog remains public read-only.

Security risks still pending:

- Rate limiting and OTP abuse controls.
- RBAC/permissions beyond current user ownership.
- Audit log persistence.
- Server-side session revocation.
- Ledger and financial integrity checks.
- Payment idempotency and reconciliation.

Production remains blocked until rate limiting, RBAC, audit logs, ledger, migration discipline, and provider decisions are completed.
