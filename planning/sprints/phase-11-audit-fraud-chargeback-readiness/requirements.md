# Phase 11 - Audit, Fraud & Chargeback Readiness Requirements

## Goal

Prepare FondixPay for auditability, fraud review, dispute investigation, chargeback evidence handling, and safe manual workflows before controlled production launch.

## In Scope

- Inspect existing payment, transaction, ledger, audit, receipt, reconciliation, support, and admin flows.
- Add fraud signal model/API/admin visibility if missing.
- Add dispute/chargeback case and evidence model/API/admin visibility if missing.
- Enforce RBAC on all new internal endpoints.
- Emit audit events for fraud and dispute operations.
- Document fraud readiness, chargeback readiness, manual workflows, security, and risks.
- Add tests for creation, status transitions, RBAC, and audit event generation.

## Out of Scope

- Automatic fraud blocking.
- Automatic refunds.
- Production chargeback automation.
- Card-network dispute submission.
- Real provider credentials or production Prontipagos changes.
- User-facing payment behavior changes.

## Acceptance

Phase is accepted when backend, admin UI, tests, docs, planning updates, and hygiene checks are complete and no production automation or secrets are introduced.
