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
