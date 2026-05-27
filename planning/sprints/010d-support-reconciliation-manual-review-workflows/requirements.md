# Phase 10D - Support, Reconciliation & Manual Review Workflows Requirements

## Goal

Harden CRM Admin operational workflows for support tickets, manual review, reconciliation placeholders, operational search, RBAC, audit, and redaction.

## Scope

- Support tickets can link to user, payment, receipt, manual review, and correlation references.
- Tickets require resolution before `resolved` or `closed`.
- Manual review cases support ambiguous payment/provider states and require resolution before `resolved` or `closed`.
- Manual review events capture status transitions and notes.
- Card processor and Prontipagos reconciliation remain separate placeholders with `production_ready=false`.
- `/admin/search` supports safe operational investigation by IDs, correlation ID, and provider reference.
- Admin frontend connects to workflow updates and search.
- Backend tests and admin typecheck/build must pass.

## Non-Goals

- No real provider reconciliation.
- No card processor or Prontipagos production integration.
- No money movement.
- No destructive ledger edits.
- No PAN/CVV/tokens/secrets/raw provider payloads.
- No production readiness declaration.

