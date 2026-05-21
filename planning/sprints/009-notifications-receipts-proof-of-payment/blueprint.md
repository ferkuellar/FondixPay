# Phase 9 Blueprint

## Backend

- Build `ReceiptProof` as a safe projection over payment, receipt, payment intent, service attempt, and provider transaction data.
- Expose owner-scoped `GET /receipts/{receipt_id}` and `GET /payments/{payment_id}/proof`.
- Keep confirmed proof gated by `succeeded` payment plus provider-confirmed/mock-confirmed evidence.
- Extend notifications with type, title, related entity, audit, and owner-scoped read endpoint.

## Mobile

- Add receipt/notification API clients and Zustand stores.
- Render proof with breakdown, safe card label, statuses, references, and disclaimer.
- Share mock proof text only when a generated local mock receipt exists.
- Add notification list entry from Profile and keep pending/failed copy explicit.

## Documentation

- Record phase state, ADRs, risks, data/API/security/audit/operations/UI rules, and future backlogs.
