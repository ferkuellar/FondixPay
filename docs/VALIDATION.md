# Validation Strategy

## Backend

- `GET /health` smoke check.
- Unit tests for domain services.
- API tests for auth, user services, payments, receipts, and notifications.
- Auth tests for OTP, token creation, expiration, and invalid credentials.
- Payment mock tests for success, failure, duplicate/idempotency-like behavior, and receipt consistency.
- Permission tests for user ownership.

## Mobile

- `npm run typecheck`.
- Navigation smoke test across onboarding, login, OTP, home, add service, detail, confirm, success, history, and profile.
- Main flow validation with development OTP `123456`.
- Empty, loading, error, success, disabled, and pending payment states.
- API client error handling.

## Security

- Verify protected endpoints.
- Verify no real secrets are committed.
- Verify role/permission assumptions before admin work.
- Verify CORS configuration per environment.

## Financial

- Mock payments must not alter real money.
- Receipts must be clearly mock/dev until provider integration.
- Ledger and audit design must exist before real payments.

## Phase 1 Validation

Phase 1 validates documentation completeness only. It does not certify runtime behavior.
