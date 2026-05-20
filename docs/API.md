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

## Phase 4A Auth Endpoint Rules

### POST `/auth/request-otp`

Purpose: request an OTP for phone login.

Auth required: no.

Development/test behavior: returns `message`, `expires_in_seconds`, and may include `otp_dev` only when `OTP_DEV_RESPONSE_ENABLED=true`.

Staging/production behavior: returns `message` and `expires_in_seconds`; never returns `otp_dev`.

Expected errors: validation error for invalid phone payload.

Pending risk: no rate limiting or external OTP provider yet.

### POST `/auth/verify-otp`

Purpose: verify phone + OTP and return an access token.

Auth required: no.

Behavior: returns `access_token`, `token_type`, and `user` when the OTP matches. Incorrect OTP returns `400` with `Codigo incorrecto`.

Pending risk: no brute-force lockout, no OTP attempt counter, no audit log.

### GET `/auth/me`

Purpose: return the current authenticated user from the bearer token.

Auth required: yes.

Behavior: valid token returns user; invalid, expired, malformed, or unknown-user tokens return `401` with `Sesion no valida`.

Pending risk: access-token-only lifecycle; no server-side session inventory.

### POST `/auth/logout`

Purpose: local logout signal for the current access-token model.

Auth required: yes.

Behavior: returns a logout message. Server-side revocation is not implemented in Phase 4A.

Pending risk: stolen access tokens remain valid until expiry.

## Phase 4B Endpoint Matrix

| Endpoint | Public/Protected | Expected Success | Expected Errors | Pending |
| --- | --- | --- | --- | --- |
| `GET /health` | Public | `200` with app status | N/A | Add readiness/DB check later |
| `GET /openapi.json` | Public/dev docs | `200` OpenAPI schema | N/A | Review exposure by environment |
| `POST /auth/request-otp` | Public | OTP request accepted; dev may include `otp_dev` | `422` invalid phone | Rate limiting, real OTP provider |
| `POST /auth/verify-otp` | Public | token + user | `400` wrong OTP, `422` invalid payload | Brute-force controls, audit logs |
| `GET /auth/me` | Protected | current user | `401` invalid/missing token | Session inventory |
| `POST /auth/logout` | Protected | logout message | `401` invalid/missing token | Server-side revocation |
| `GET /users/me` | Protected | current user | `401` missing/invalid token | RBAC later |
| `GET /service-providers` | Public read | provider list | N/A | Admin-only writes if added |
| `GET /service-providers/category/{category}` | Public read | filtered provider list | `422` invalid category | Admin-only writes if added |
| `GET /service-providers/{provider_id}` | Public read | provider detail | `404` missing provider | Admin-only writes if added |
| `GET /user-services` | Protected | current user's services | `401` missing/invalid token | More ownership mutation tests |
| `POST /user-services` | Protected | creates current user's service | `401`, `404`, `422` | Provider validation hardening |
| `GET /user-services/{service_id}` | Protected | own service detail | `401`, `404` cross-user/missing | Full ownership matrix |
| `GET /payments` | Protected | current user's payments | `401` missing/invalid token | Idempotency, ledger, audit |
| `POST /payments` | Protected | mock payment | `401`, `400`, `404` | No real money, no idempotency |
| `GET /receipts` | Protected | current user's receipts | `401` missing/invalid token | Receipt verification |
| `GET /notifications` | Protected | current user's notifications | `401` missing/invalid token | Delivery channels |

Phase 4B tests cover the basic protected/public classification and user-scoped list boundaries. They do not certify production readiness.
