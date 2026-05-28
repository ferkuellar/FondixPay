# Phase 11 - Blueprint

## Architecture

Phase 11 extends the existing CRM/Admin backend and frontend. It does not change customer payment flows.

## Backend

- Add `FraudSignal` for explainable review signals.
- Add `DisputeCase` and `DisputeEvidence` for dispute/chargeback readiness.
- Add internal `/admin/fraud/signals` and `/admin/disputes` routes.
- Keep all endpoints authenticated and permission-protected.
- Use the existing central audit writer for operational evidence.

## Frontend

- Add CRM/Admin pages for fraud signals and dispute cases.
- Hide writable controls unless the role has update permissions.
- Show loading, empty, error, filtered list, detail, status update, and evidence states.

## Security

- No PAN/CVV/secrets/raw provider payloads.
- Internal fraud labels are admin-only.
- Dispute evidence stores private references, not public files.
- Backend authorization remains authoritative.

## Data Migration

Add Alembic revision `20260527_0007_phase_11_fraud_chargeback_readiness.py` with reversible table creation.
