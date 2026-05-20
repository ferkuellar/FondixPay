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

## Payment Method Validation

Future validation checklist:

- User cannot confirm real payment without a valid selected method.
- User can see selected method before paying.
- User can change method before paying.
- UI does not show phantom cards.
- PAN and CVV are never persisted.
- Mock method appears only in dev/internal validation.
- Payment method actions generate audit events.
- Payment method APIs enforce ownership.
- Tokenized card flow rejects raw PAN/CVV payloads.
- Non-banked users can complete validation with an approved non-card path if selected for MVP.

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

## Phase 5B Backend Validation

Commands:

```powershell
cd backend
python -m compileall app
python -m pytest
```

Current coverage added:

- Audit event creation and sensitive metadata redaction.
- Auth audit events for OTP request, OTP failure, OTP success, and login success.
- Request ID generation and response echo.
- Valid and invalid payment intent transitions.
- Valid and invalid payment attempt transitions.
- Integer minor-unit conversion for ledger amounts.
- Ledger account and ledger entry persistence.
- Mock payment idempotency duplicate blocking.
- Mock payment audit, payment intent, payment attempt, provider transaction, and ledger trace creation.

Still not covered:

- Real provider submission.
- Provider timeout/retry semantics.
- Reconciliation import and mismatch review.
- Admin/auditor audit read endpoints.
- DB-level append-only enforcement.

## Phase 5C Fee Transparency Validation

Checklist:

- User sees service amount before paying.
- User sees FondixPay fee before paying.
- User sees final total before confirming.
- Payment CTA shows final total.
- Success screen shows amount, fee, and total.
- Receipt/history card shows amount, fee, and total.
- Backend calculates `total_minor = amount_minor + fee_minor`.
- Backend uses integer minor units, not floats, for fee fields.
- Mobile displays the same mock fee and total as backend configuration.
- Trust copy is specific and avoids unsupported compliance/security claims.
- Manual user validation should include users aged 30-65 before any real-money pilot.

Automated validation:

```powershell
cd backend
python -m compileall app
python -m pytest

cd mobile
npm run typecheck
```
# Payment Method Mock UX Validation

- App can start with no payment methods.
- User can add a demo payment method.
- User can select a demo payment method.
- ConfirmPayment shows selected method.
- ConfirmPayment blocks or disables payment when no method is selected.
- CTA keeps the Phase 5C final total.
- No phantom hardcoded card is shown.
- No real card number, CVV, CLABE, expiration date, or bank credential is requested.
- PaymentSuccess and receipt show method used when available.
- `npm run typecheck` must pass after mobile changes.

# Payment Recovery Validation

Future implementation must validate:

- Provider timeout does not mark payment as paid.
- Paid state requires sufficient confirmation.
- Failed validation does not generate receipt.
- Paid without receipt creates receipt recovery path.
- Duplicate retry is blocked by idempotency.
- Retry is allowed only for retry-safe states.
- Failed payment method allows method change.
- Ambiguous provider state creates recovery/support case.
- User cannot access another user's recovery case.
- SUPPORT/FINANCE/ADMIN roles are required for recovery queues.
- Every recovery state transition emits audit event.
- User-facing copy always gives next action.

Phase 5F is documentation-only. No runtime tests are required unless code is changed.

## Phase 5F Mock Recovery UX Checklist

- Failed payment shows clear non-technical message.
- Failed payment states when no real charge occurred.
- Pending/timeout never routes to PaymentSuccess.
- Retry returns to confirmation and does not create a hidden second outcome.
- Change method works from failed recovery.
- Support placeholder shows safe mock references.
- Fee breakdown remains visible in failed and pending screens.
- Selected method remains visible in recovery context.
- User can exit recovery flow without being trapped.
- `npm run typecheck` passes after mobile changes.
