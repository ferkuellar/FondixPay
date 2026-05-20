# Sprint 005B - Ledger & Audit Implementation Requirements

## Goal

Implement the minimum backend foundation for ledger records, audit events, request/correlation IDs, idempotency, state transitions, and tests before any real payment provider work.

## In Scope

- SQLAlchemy models for audit events, payment intents, payment attempts, ledger accounts, ledger entries, provider transactions, and reconciliation records.
- Central audit event writer with redaction of sensitive values.
- Request ID middleware and payment-flow correlation IDs.
- Mock payment idempotency through optional `idempotency_key`.
- Payment intent and attempt state transition validation.
- Audit events for OTP, login, user service creation, mock payment, and receipt generation.
- Alembic migration when viable.
- Backend tests for audit, request context, state machine, idempotency, ledger models, and mock payment integration.

## Out Of Scope

- Real payment provider integration.
- Prontipagos API calls.
- Real money movement.
- Wallet balances.
- Provider webhooks.
- Real reconciliation jobs.
- Mobile UI changes.
- Admin/auditor console.

## Acceptance Summary

The sprint is accepted only if backend compile and pytest pass, no real payments are connected, and documentation reflects implemented, partial, and pending controls.
