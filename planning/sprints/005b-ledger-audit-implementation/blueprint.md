# Sprint 005B Blueprint

## Backend Modules

- `backend/app/modules/audit/`: `AuditEvent` persistence and central writer.
- `backend/app/modules/ledger/`: ledger/payment intent models, repository, services, and state machine.
- `backend/app/core/request_context.py`: request/correlation context utilities and middleware.

## Integration Points

- `backend/app/main.py`: registers request context middleware and model metadata.
- `backend/app/modules/auth/`: emits OTP/login audit events.
- `backend/app/modules/user_services/`: emits create/validation audit events.
- `backend/app/modules/payments/`: creates payment intents/attempts, blocks duplicate idempotency keys, emits payment/receipt audit events, keeps mock payment behavior.
- `backend/alembic/versions/20260520_0001_ledger_audit_foundation.py`: migration for new tables.

## Test Strategy

- In-memory SQLite fixtures remain the test isolation mechanism.
- Tests do not depend on external providers or local manual data.
- Tests cover audit event creation/redaction, request ID, state transitions, idempotency duplicate blocking, mock payment trace records, and existing endpoint protections.

## Production Boundary

This implementation is an internal foundation. It does not make FondixPay production-ready and does not authorize real provider integration.
