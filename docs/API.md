# API

Source of truth for Phase 1: `backend/app/main.py`.

## `GET /health`

- Purpose: local/dev health check.
- Auth required: no.
- Current state: returns status and app name.
- Risks: does not report database or dependency health.
- Pending: expand checks for production readiness.

## `/auth`

- Purpose: phone login, development OTP, JWT/session flow.
- Auth required: mixed; login/OTP entry points are public.
- Current state: mock/dev OTP flow.
- Risks: OTP hardening, rate limiting, brute-force protection, production delivery, session revocation pending.
- Pending: Phase 4 auth/session security.

## `/users`

- Purpose: user profile/domain endpoints.
- Auth required: should be required for private user data.
- Current state: existing module.
- Risks: authorization boundaries must be verified.
- Pending: ownership tests and RBAC strategy.

## `/service-providers`

- Purpose: list/provider catalog for CFE, Telmex, Telcel-style billers.
- Auth required: to be reviewed; public catalog may be acceptable, management must be restricted.
- Current state: existing module with seed support.
- Risks: admin mutations must not be public.
- Pending: catalog permission rules.

## `/user-services`

- Purpose: manage service references owned by a user.
- Auth required: yes.
- Current state: existing module.
- Risks: cross-user access would be critical.
- Pending: ownership enforcement tests.

## `/payments`

- Purpose: create/confirm mock service payments.
- Auth required: yes.
- Current state: mock/dev only.
- Risks: can be mistaken for real payment; audit/idempotency/ledger missing.
- Pending: mock hardening before real provider work.

## `/receipts`

- Purpose: expose generated mock receipts.
- Auth required: yes.
- Current state: existing module.
- Risks: receipt ownership and traceability must be enforced.
- Pending: receipt verification model.

## `/notifications`

- Purpose: user notifications/messages.
- Auth required: yes for user-specific notifications.
- Current state: existing module.
- Risks: delivery and privacy rules pending.
- Pending: notification channels and permissions.
