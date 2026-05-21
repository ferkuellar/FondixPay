# Sprint 008C Blueprint

## Runtime Slice

- `backend/app/modules/providers/card_processor/`: card sandbox interface, schemas, adapter, and contractual mock.
- `backend/app/modules/providers/prontipagos/`: service-payment interface, schemas, adapter, and contractual mock.
- `backend/app/modules/payments/orchestrator.py`: sandbox orchestration over existing payment intent, attempt, provider transaction, ledger trace, audit, receipt, and notification services.
- `POST /payments/sandbox`: protected sandbox endpoint that does not change the existing `POST /payments` mock contract.

## Safety Rules

- Card failure/pending/timeout never calls Prontipagos.
- Prontipagos pending/timeout/failure enters recovery/manual-review status and does not generate a confirmed receipt.
- Duplicate idempotency returns existing sandbox result.
- Provider payload storage is hash-only in the sandbox traces.

## Validation

- `cd backend; python -m compileall app`
- `cd backend; python -m pytest`
- `cd mobile; npm run typecheck`

