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

## Future Ledger/Audit/Payment APIs

These APIs are design-only for Phase 5A. They are not implemented yet.

### POST `/payments/intents`

- Purpose: create a payment intent with amount, fee, total, currency, user service, and idempotency key.
- Auth required: yes.
- Role required: `USER`.
- Request body conceptual: `user_service_id`, `amount_minor`, `fee_minor`, `currency`, `idempotency_key`.
- Response body conceptual: payment intent ID, status, totals, expiration, correlation ID.
- Audit events generated: `payment.intent_created`, `payment.fee_disclosed`.
- Idempotency behavior: duplicate key returns existing intent/current state.
- Error states: invalid service, cross-user service, expired service amount, duplicate conflict, validation error.

### GET `/payments/intents/{id}`

- Purpose: fetch current payment intent state for the owner.
- Auth required: yes.
- Role required: `USER` for own intent; future `SUPPORT`, `FINANCE`, `ADMIN`, `AUDITOR` read according to policy.
- Request body conceptual: none.
- Response body conceptual: intent, attempts summary, receipt status, user-facing status.
- Audit events generated: optional `payment.intent_viewed` if policy requires.
- Idempotency behavior: not applicable.
- Error states: not found, unauthorized, forbidden.

### POST `/payments/intents/{id}/confirm`

- Purpose: user confirms payment and starts provider submission.
- Auth required: yes.
- Role required: `USER`.
- Request body conceptual: `idempotency_key`, selected payment method token/reference, accepted fee/total snapshot.
- Response body conceptual: intent status, attempt status, user-facing status, correlation ID.
- Audit events generated: `payment.confirmed_by_user`, `payment.submitted_to_provider`, provider events as applicable.
- Idempotency behavior: duplicate confirm does not create a second provider submission.
- Error states: expired intent, fee mismatch, method missing, duplicate blocked, provider timeout, provider rejected.

### POST `/payments/intents/{id}/retry`

- Purpose: retry a failed or ambiguous payment according to safe retry rules.
- Auth required: yes.
- Role required: `USER`.
- Request body conceptual: `idempotency_key`, retry reason, payment method reference.
- Response body conceptual: current intent and attempt state.
- Audit events generated: `payment.retry_requested`, `payment.duplicate_blocked` if applicable.
- Idempotency behavior: retry key scopes duplicate retry.
- Error states: retry not allowed, provider pending, duplicate blocked, provider timeout.

### GET `/payments/{id}/status`

- Purpose: get user-facing payment status derived from internal state and provider evidence.
- Auth required: yes.
- Role required: `USER` for own payment; support/finance/admin/auditor future read policy.
- Request body conceptual: none.
- Response body conceptual: internal status, user-facing status, receipt status, support flag.
- Audit events generated: optional status viewed event if required.
- Idempotency behavior: not applicable.
- Error states: not found, forbidden.

### GET `/receipts/{id}`

- Purpose: fetch receipt proof and provider confirmation state.
- Auth required: yes.
- Role required: `USER` for own receipt; support/finance/admin/auditor future read policy.
- Request body conceptual: none.
- Response body conceptual: receipt, status, provider confirmation flag, download/share metadata.
- Audit events generated: `receipt.viewed`.
- Idempotency behavior: not applicable.
- Error states: not found, unavailable, forbidden.

### GET `/audit/events`

- Purpose: read audit events for authorized audit/support/admin use.
- Auth required: yes.
- Role required: `AUDITOR`, `ADMIN`, or `SUPER_ADMIN`; narrower support view may be added later.
- Request body conceptual: query filters for event type, entity, actor, correlation ID, time window.
- Response body conceptual: paginated audit events with redacted metadata.
- Audit events generated: `admin.audit_events_viewed` if implemented.
- Idempotency behavior: not applicable.
- Error states: forbidden, invalid filters.

### GET `/admin/reconciliation`

- Purpose: list reconciliation runs and mismatch summaries.
- Auth required: yes.
- Role required: `FINANCE`, `ADMIN`, `AUDITOR`, or `SUPER_ADMIN`.
- Request body conceptual: query filters for provider, date, status.
- Response body conceptual: reconciliation records, matched/mismatch counts, review status.
- Audit events generated: optional `provider.reconciliation_viewed`.
- Idempotency behavior: not applicable.
- Error states: forbidden, invalid date/provider.

### POST `/admin/reconciliation/run`

- Purpose: start a reconciliation run against imported/provider report data.
- Auth required: yes.
- Role required: `FINANCE`, `ADMIN`, or `SUPER_ADMIN`.
- Request body conceptual: provider name, reconciliation date, report reference/import ID.
- Response body conceptual: reconciliation run ID, status, summary.
- Audit events generated: `provider.reconciliation_started`, `provider.reconciliation_completed`, `provider.reconciliation_mismatch`.
- Idempotency behavior: duplicate run key prevents duplicate reconciliation for same provider/date/report.
- Error states: duplicate run, missing report, provider unavailable, mismatch detected.

## Phase 5B Current API Changes

### Request Headers

- `X-Request-ID`: optional inbound header. If provided, the backend echoes it in the response. If omitted, the backend generates a `req_...` value.
- `X-Correlation-ID`: accepted by request context for future financial flow propagation. Current payment flows generate a correlation ID when none is supplied.

### POST `/payments`

Status: implemented mock/dev endpoint, contract preserved.

Change:

- Request body now accepts optional `idempotency_key`.

Conceptual body:

```json
{
  "user_service_id": 1,
  "idempotency_key": "client-generated-key"
}
```

Behavior:

- With a new key, the backend creates a mock payment, payment intent, payment attempt, provider transaction trace, ledger trace entry, receipt, notification, and audit events.
- With the same key for the same user after success, the backend returns the existing mock payment and emits `payment.duplicate_blocked`.
- Payments remain mock/dev and are not provider-confirmed real money movement.

No new public ledger, audit, admin, or reconciliation endpoints were implemented in Phase 5B.

## Phase 5C Fee Transparency Fields

Current implemented mock/dev payment response fields:

- `amount_minor`: service amount in centavos.
- `fee_minor`: FondixPay fee in centavos.
- `total_minor`: service amount plus fee in centavos.
- `currency`: currently `MXN`.
- `fee_label`: user-facing fee label.
- `fee_description`: user-facing fee explanation.
- `is_mock`: marks the response as mock/dev.

`POST /payments` returns these fields while preserving existing payment fields such as `amount`, `status`, and `external_reference`.

Receipt responses now expose derived breakdown fields when listing `/receipts`:

- `amount_minor`
- `fee_minor`
- `total_minor`
- `currency`
- `fee_label`
- `payment_reference`
- `is_mock`

Pending:

- A dedicated pre-confirmation quote endpoint does not exist yet.
- Mobile local mock store still calculates the same fixed fee until it consumes backend payment responses directly.

## Future Payment Method APIs

Status: proposed, not implemented.

### GET `/payment-methods`

- Purpose: list safe payment methods for the current user.
- Auth required: yes.
- Role: `USER`.
- Response: id, type, display label, status, default flag, mock flag.
- Audit events: optional `payment_method.list_viewed`.
- Security notes: no PAN/CVV.

### POST `/payment-methods`

- Purpose: create a future tokenized method.
- Auth required: yes.
- Role: `USER`.
- Request body conceptual: type, provider token reference, display metadata.
- Response body conceptual: created safe payment method.
- Audit events: `payment_method.add_started`, `payment_method.add_completed`, `payment_method.add_failed`.
- Security notes: provider tokenization required; raw card data is rejected.

### POST `/payment-methods/mock`

- Purpose: create/select dev-only mock payment method.
- Auth required: yes.
- Role: `USER`.
- Response body conceptual: mock method with `is_mock=true`.
- Audit events: `payment_method.mock_selected`.
- Security notes: disabled outside dev/internal validation.

### PATCH `/payment-methods/{id}/default`

- Purpose: set selected/default method.
- Auth required: yes.
- Role: `USER`.
- Audit events: `payment_method.selected`, `payment_method.changed`.
- Security notes: ownership required.

### DELETE `/payment-methods/{id}`

- Purpose: soft delete/detach method.
- Auth required: yes.
- Role: `USER`.
- Audit events: `payment_method.removed`.
- Security notes: detach provider token when applicable.

### GET `/payment-methods/{id}`

- Purpose: read safe detail.
- Auth required: yes.
- Role: `USER`.
- Security notes: safe display fields only.

### POST `/payment-methods/{id}/validate`

- Purpose: validate availability before payment.
- Auth required: yes.
- Role: `USER`.
- Audit events: `payment_method.validation_failed` if invalid.
- Security notes: no provider secrets in response.
# Phase 5E Payment Method API Status

Phase 5E does not implement backend payment method endpoints. The payment method flow is local mobile mock/dev state only.

Future/proposed payment method endpoints remain not implemented:

- `GET /payment-methods`
- `POST /payment-methods`
- `POST /payment-methods/mock`
- `PATCH /payment-methods/{id}/default`
- `DELETE /payment-methods/{id}`
- `POST /payment-methods/{id}/validate`

Do not document these endpoints as available until backend models, authorization, audit events, tokenization strategy, and tests exist.
