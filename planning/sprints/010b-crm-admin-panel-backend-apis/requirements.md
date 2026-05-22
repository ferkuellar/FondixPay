# Phase 10B Requirements

## Goal

Implement the first backend CRM/Admin API foundation with authenticated RBAC, redacted operational reads, support tickets, manual review, audit events, and safe reconciliation placeholders.

## Included

- Backend `/admin/*` router, roles, permission dependencies, redaction, safe schemas, dashboard/users/payments/receipts/audit list routes.
- Support ticket and manual-review models plus controlled writes.
- Migration, tests, docs, backlog, state, decisions, risks, and completion report.

## Excluded

- CRM frontend, dedicated admin login/MFA, real reconciliation, provider integrations, destructive ledger changes, real money, PAN/CVV/tokens/secrets/raw provider payload exposure.
