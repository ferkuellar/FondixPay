# Phase 5F Blueprint

## Execution Mode
Documentation plus mobile mock/dev implementation. Backend provider behavior remains future work.

## Design Artifacts
- `docs/PAYMENT_RECOVERY_PATHS.md`
- Updated `docs/API.md`
- Updated `docs/AUDIT.md`
- Updated `docs/VALIDATION.md`
- Updated `docs/SECURITY.md`
- Updated `planning/STATE.md`
- Updated `planning/DECISIONS.md`
- Updated `planning/RISKS.md`
- Updated `planning/QUESTIONS.md`
- `mobile/src/screens/payments/PaymentFailedScreen.tsx`
- `mobile/src/screens/payments/PaymentPendingScreen.tsx`
- `mobile/src/screens/support/SupportPlaceholderScreen.tsx`
- `mobile/src/components/PaymentRecoverySummary.tsx`

## Recovery Model
Recovery starts when a payment is not cleanly completed:
- failure before provider submission
- provider rejection
- provider timeout
- pending confirmation
- paid without receipt
- charged but not applied
- duplicate attempt
- support/manual review

## Implementation Guidance For Future Builder
- Add state machine enforcement before provider integration.
- Add recovery case model only after RBAC/support roles are ready.
- Use idempotency keys for every retry.
- Never mark provider timeout as paid.
- Never generate final receipt without sufficient confirmation.

## Implemented Mobile Mock
- ConfirmPayment exposes deterministic demo scenarios.
- `failed` and `duplicate_blocked` route to PaymentFailed.
- `pending` and `timeout` route to PaymentPending.
- Support placeholder shows safe mock references.
- Retry returns to confirmation with the selected payment method flow preserved.
