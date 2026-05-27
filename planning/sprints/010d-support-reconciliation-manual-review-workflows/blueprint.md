# Phase 10D Blueprint

## Backend

- Extend admin CRM models for ticket/manual review links, summaries, close timestamps, and manual review event status fields.
- Add reversible Alembic migration `20260522_0005_phase_10d_crm_workflows.py`.
- Enforce resolution requirements in admin services.
- Add `/admin/search` with RBAC and redacted results.
- Return structured separated reconciliation placeholders for card processor and Prontipagos.
- Emit admin audit events for support, manual review, reconciliation, and search workflows.

## Admin Frontend

- Extend admin types and API client.
- Add permission-aware search page.
- Update support/manual review detail pages to require resolution when closing.
- Show reconciliation summaries with `production_ready=false`.
- Keep UI read-mostly and backend-authorized.

## Documentation

- Update API, data model, permissions, audit, security, operations, validation, CRM architecture, backlog, state, decisions, and risks.

