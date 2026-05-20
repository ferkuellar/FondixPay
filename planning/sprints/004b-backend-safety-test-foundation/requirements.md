# Sprint 004B - Backend Safety & Test Foundation Requirements

## Goal

Establish a repeatable backend safety baseline for FondixPay without adding product features or real payment integrations.

## In Scope

- Pytest structure for backend API and security smoke tests.
- Isolated test database using SQLite in memory.
- TestClient fixture and reusable data factories.
- Health and OpenAPI tests.
- Auth dev/test flow tests.
- Protected endpoint tests for users, user services, payments, receipts, and notifications.
- User-scoped data tests for user services, payments, receipts, and notifications.
- Documentation updates for validation, operations, API, security, risks, and decisions.

## Out of Scope

- Real payments.
- Real OTP/SMS provider.
- KYC, wallet, ledger implementation, or admin console.
- Full RBAC implementation.
- Full audit log persistence.
- Broad error response refactor.
- Alembic migration conversion.

## Constraints

- Preserve mock/dev flow.
- Do not use production databases or secrets.
- Keep tests deterministic and independent of local manual data.
- Do not change mobile navigation or product behavior.
