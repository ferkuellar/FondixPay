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

## Phase 4B Backend Validation

Backend commands:

```powershell
cd backend
python -m compileall app
python -m pytest
```

Mobile compatibility command:

```powershell
cd mobile
npm run typecheck
```

Pytest strategy:

- Tests live under `backend/tests/`.
- `conftest.py` provides a FastAPI `TestClient`, isolated in-memory SQLite database, `get_db` override, and data factories.
- Tests do not depend on PostgreSQL, Docker, external providers, or manual local data.
- Schema is created and dropped per test through SQLAlchemy metadata for the isolated test database.

Current coverage:

- App import through TestClient.
- `GET /health`.
- `GET /openapi.json`.
- Development auth flow: request OTP and verify OTP.
- Phase 4A security/config behavior.
- Invalid token rejection.
- Public service provider catalog.
- Protected route rejection without token for users, user-services, payments, receipts, and notifications.
- User-scoped list boundaries for user services, payments, receipts, and notifications.

Not covered yet:

- Rate limiting.
- RBAC roles.
- Full mutation ownership matrix.
- Payment idempotency.
- Ledger entries.
- Audit log persistence.
- Alembic migration execution.
- Provider webhook behavior.

Before any real payment integration:

- Backend pytest must pass.
- Payment and receipt tests must be expanded around idempotency, ledger, and audit.
- User-scoped ownership tests must cover detail and mutation paths.
- CI must run backend tests and mobile typecheck.

## UX/Product Validation Before Real Payments

The product must be validated with users before real payment launch:

- User understands FondixPay commission before tapping confirm.
- User can identify the final total.
- User understands what to do if payment fails.
- User can find support from a failed or uncertain payment state.
- User understands whether they were charged or not charged.
- User can download or share a receipt.
- User can add or select a payment method without anxiety or ambiguity.
- User does not depend on a card-only path if the target segment includes non-bancarized users.
- Test the payment flow with users aged 30-65 before closed beta with real money.

## Ledger and Audit Validation

Future Phase 5B+ tests must validate:

- Amounts are stored as integer minor units.
- `fee_minor + amount_minor = total_minor`.
- Duplicate idempotency key does not create a second payment intent or provider submission.
- Payment state transitions follow the approved state machine.
- Invalid transitions are rejected.
- Ledger entries are append-only.
- Audit event is created for each financial state change.
- Receipt is not marked `provider_confirmed` without provider confirmation rules being satisfied.
- Provider timeout does not equal success.
- Reconciliation mismatch creates a review record.
- User cannot access another user's payment intent.
- Admin/auditor roles are required for audit endpoints.
- Provider payloads are redacted or hashed in tests.
- Reversal creates compensating ledger entries instead of destructive updates.

Before real payment integration:

- Backend tests must cover idempotency, audit event creation, ledger append-only behavior, and ownership.
- API tests must cover payment intent create/confirm/retry/status.
- Security tests must cover forbidden access to audit/admin endpoints.
- Reconciliation tests must cover matched and mismatched provider records.
