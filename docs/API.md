# API

Source of truth for Phase 1: `backend/app/main.py`.

## Sprint 012 Dev Readiness API Boundary

Status: documentation/readiness only. No Sprint 012 API is implemented.

Sprint 012 does not add backend endpoints, mobile runtime calls, webhook endpoints, migrations, provider sessions, or payment execution.

Current API posture:

- Existing `/payments` and `/receipts` behavior remains mock/dev unless a later approved runtime sprint changes it.
- Future Tekae session, status, webhook, reconciliation, receipt, or support APIs remain blocked until Sprint 011 contract readiness passes.
- CI/typecheck readiness does not prove provider readiness.
- Mock success must not be documented or consumed as provider-confirmed payment success.

API documentation rule:

- Any future Tekae endpoint must be marked proposed/blocked until official Tekae API, webhook/status, reconciliation, reference/folio, and receipt contracts are available.

## Sprint 010 Tekae API Boundary

Status: proposed future contract only. No Sprint 010 API is implemented.

Tekae is the approved payment/service capability provider. FONDIXPAY must not implement card vault, wallet, ledger balance, tokenization, acquiring, SPEI processor, or banking core APIs.

### Future POST `/api/payments/tekae/session`

Purpose: create a backend-brokered Tekae responsive launch session for an authenticated user.

Auth: required.

Status: proposed, not implemented. Sprint 019 documents readiness only and does not create this endpoint.

Request concept:

```json
{
  "intent": "open_tekae_tool",
  "user_service_id": "optional-internal-id",
  "menu": "optional-tekae-menu",
  "categoria": "optional-tekae-category",
  "carrier": "optional-tekae-carrier",
  "blockview": true,
  "redirect": "optional-approved-return-url",
  "idempotency_key": "client-or-backend-generated-key"
}
```

Response concept:

```json
{
  "session_id": "internal-session-id",
  "launch_url": "[REDACTED_SHORT_LIVED_TEKAE_URL]",
  "expires_at": "timestamp",
  "launch_mode": "browser_or_webview_or_redirect",
  "status": "session_ready"
}
```

Rules:

- Backend is the only component allowed to call Tekae token endpoints or build the responsive access URL.
- Backend validates authenticated user, environment, eligibility/role, duplicate-flow protection, and audit context before calling Tekae.
- Backend calls Tekae `POST /tokens/cipherData`, then `POST /tokens/generateTokenCiphered`, then builds the short-lived responsive URL.
- Frontend/mobile/admin must never receive Tekae `uid`, `password`, secret keys, provider credentials, raw `accessToken`, or raw provider errors.
- Tekae tokens and full URLs must be redacted in logs, analytics, screenshots, crash reports, support tickets, CRM views, and audit metadata.
- Opening Tekae must not mark payment as successful.
- Unknown outcomes must remain pending or manual-review states.
- Rate limiting, idempotency/duplicate protection, bounded timeouts, safe error mapping, and audit events are required before runtime.

### Future Tekae Admin/Operations APIs

These are proposed only:

| Endpoint | Purpose | Status |
|---|---|---|
| `GET /api/admin/tekae/sessions` | Review safe Tekae session metadata. | future |
| `GET /api/admin/reconciliation/tekae` | Review Tekae reconciliation summary when specs exist. | future |
| `POST /api/webhooks/tekae` | Receive Tekae events if Tekae provides signed webhooks. | future |

Implementation is blocked until Tekae webhook, reconciliation, transaction query, sandbox, and production connectivity details are confirmed.

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

# Future Payment Recovery APIs

Phase 5F defines these endpoints as future/proposed only. They are not implemented.

| Endpoint | Purpose | Auth Required | Future Role | Audit Event | Status |
|---|---|---|---|---|---|
| `GET /payments/{payment_id}/status` | Read payment status | yes | owner, SUPPORT, FINANCE | future `payment.status_viewed` | proposed |
| `POST /payments/{payment_id}/retry` | Request retry | yes | owner | `payment.retry_requested` or `payment.retry_blocked` | proposed |
| `POST /payments/{payment_id}/cancel` | Cancel safe pending payment | yes | owner, SUPPORT | `payment.cancelled` | proposed |
| `POST /payments/{payment_id}/recovery-case` | Open recovery case | yes | owner, SUPPORT | `recovery.case_created` | proposed |
| `GET /payment-recovery-cases` | List recovery cases | yes | SUPPORT, FINANCE, ADMIN | future `recovery.case_listed` | proposed |
| `GET /payment-recovery-cases/{case_id}` | Read recovery case | yes | SUPPORT, FINANCE, ADMIN | future `recovery.case_viewed` | proposed |
| `POST /payment-recovery-cases/{case_id}/assign` | Assign support case | yes | SUPPORT, ADMIN | `recovery.case_assigned` | proposed |
| `POST /payment-recovery-cases/{case_id}/resolve` | Resolve support case | yes | SUPPORT, FINANCE, ADMIN | `recovery.case_resolved` | proposed |
| `POST /receipts/{receipt_id}/regenerate` | Regenerate failed receipt | yes | SUPPORT, SYSTEM | `receipt.regeneration_requested` | proposed |

Recovery endpoints require RBAC, audit logs, idempotency, provider status mapping, and support workflow before implementation.

## Phase 5F Runtime Status

Phase 5F recovery implementation is mobile mock/dev only. No backend recovery endpoints were added.

Future backend error/status concepts must distinguish:

- `payment_failed`
- `provider_timeout`
- `duplicate_payment_attempt`
- `payment_pending_confirmation`
- `receipt_unavailable`

Clients must not map `provider_timeout` or `payment_pending_confirmation` to success.

# Future Account and Balance APIs

Phase 6A proposes these endpoints only:

| Endpoint | Purpose | Auth | Future Role | Status |
|---|---|---|---|---|
| `GET /account` | Own account metadata | yes | USER owner | proposed |
| `GET /account/balance` | Own derived balance/snapshot | yes | USER owner | proposed |
| `GET /account/movements` | Own visible movements | yes | USER owner | proposed |
| `GET /account/statements` | Statement periods/export metadata | yes | USER owner | proposed |
| `GET /account/status` | Account restriction/status | yes | USER owner | proposed |
| `POST /account/demo-credit` | Future dev-only demo credit | yes | INTERNAL/DEV | proposed |
| `POST /account/hold` | Future internal hold | yes | SYSTEM/FINANCE | proposed |
| `POST /account/release-hold` | Future internal hold release | yes | SYSTEM/FINANCE | proposed |

Account/balance responses must label demo balance and must not claim real money unless approved production gates exist.

## Phase 6B Demo Account APIs

The following endpoints are implemented for authenticated demo/mock use:

| Endpoint | Auth | Behavior |
|---|---|---|
| `GET /account` | Required | Returns the current user's demo account and creates it if absent. |
| `GET /account/balance` | Required | Returns demo balance fields in integer MXN minor units. |
| `GET /account/movements` | Required | Returns the current user's demo movement list. |

`GET /account/balance` returns `available_minor`, `pending_minor`, `held_minor`, `simulated_minor`, `currency`, `is_demo=true`, `is_real_money=false`, `label`, `disclaimer`, and `as_of`.

`POST /account/demo-credit`, statements, holds, and real balance operations remain future/proposed.
## Phase 7 Payment History And Receipt Projection

Phase 7 keeps runtime history hardening in the mobile mock/dev projection. The current backend `GET /payments` and `GET /receipts` endpoints remain authenticated and continue to expose persisted successful mock payment and generated receipt records.

Mobile history now expects explicit display concepts:
- payment display status: `succeeded`, `pending`, `timeout`, `failed`, `duplicate_blocked`
- receipt status: `generated`, `pending`, `unavailable`, `voided`
- amount breakdown: `amount_minor`, `fee_minor`, `total_minor`, `currency`
- safe trace labels: payment id, receipt id when present, mock reference, `request_id` or `correlation_id` when available

Future provider-backed history APIs must expose receipt status and must not mark `payment_pending_confirmation`, `provider_timeout`, `payment_failed`, `duplicate_payment_attempt`, or `receipt_unavailable` responses as provider-confirmed success.

## Future Card Payment Method APIs

The payment-method roadmap is card-only. Future card endpoints remain proposed until a card processor is selected:

| Endpoint | Purpose | Notes |
|---|---|---|
| `GET /payment-methods` | List safe saved card references for current user. | Auth required; safe label, brand, last4, expiry, status only. |
| `POST /payment-methods/card-token` | Attach processor tokenization result for a card. | Depends on future approved card processor; no PAN/CVV persistence. |
| `PATCH /payment-methods/{id}/default` | Select default card. | Ownership check and audit required. |
| `DELETE /payment-methods/{id}` | Soft delete/detach card reference. | Provider detach/delete rules required. |
| `GET /payment-methods/{id}` | Read safe card detail. | No raw provider payload or sensitive card fields. |

SPEI, CoDi, OXXO/store payment, cash-in, cash, bank transfer, wallet balance, and stored balance do not have user-facing payment-method APIs in the current roadmap.

## Future Card Processor APIs

Status: future/proposed for Phase 8A. These endpoints do not exist yet.

| Endpoint | Purpose | Auth | Future Role | Idempotency | Audit / Security Notes |
|---|---|---|---|---|---|
| `POST /card/tokenization-session` | Create processor tokenization handoff/session. | yes | `USER` | provider/session key if stateful | Public/session material only; never return secret keys. |
| `POST /card/payment-methods` | Attach tokenized card reference. | yes | `USER` | recommended for attach | Reject PAN/CVV; emit card payment method audit. |
| `GET /card/payment-methods` | List own safe card metadata. | yes | `USER` | n/a | Owner-scoped brand/last4/expiry/status only. |
| `PATCH /card/payment-methods/{id}/default` | Select default card. | yes | `USER` | duplicate-safe | Ownership and selection audit required. |
| `DELETE /card/payment-methods/{id}` | Soft delete/detach card reference. | yes | `USER` | duplicate-safe | Provider detach policy required. |
| `POST /card/charges` | Future card charge/auth sandbox submission. | yes | `USER` | required | Card attempt, processor idempotency, audit, safe error mapping. |
| `GET /card/charges/{id}` | Read safe charge status. | yes | owner; support/finance later | n/a | No raw provider payload. |
| `POST /card/webhooks/{provider}` | Receive processor event. | provider signature | provider/system | event id/replay required | Signature verification, replay protection, redaction. |
| `GET /admin/card/reconciliation` | Review card reconciliation summaries. | yes | `FINANCE`, `ADMIN`, `AUDITOR` | n/a | RBAC and audit required. |

## Superseded Prontipagos / Service Payment APIs

The following Prontipagos API concepts are historical and superseded by Sprint 010 Tekae discovery. Do not implement new Prontipagos work.

Status: future/proposed. These endpoints do not exist in the current mock/dev backend.

| Endpoint | Purpose | Auth / Role | Idempotency | Security Notes |
|---|---|---|---|---|
| `POST /service-payments/intents` | Prepare service-payment execution context. | authenticated owner | future create key | Preserve amount snapshot and approved card prerequisite evidence. |
| `POST /service-payments/{id}/execute` | Execute Prontipagos payment. | owner/system | required | Do not call when card charge failed, pending, timeout, or unknown. |
| `GET /service-payments/{id}/status` | Read normalized service-payment status. | owner | n/a | Return safe status and receipt/support references only. |
| `POST /service-payments/{id}/retry` | Request safe retry/status recovery. | owner/system | required | Timeout must not create a blind duplicate execution. |
| `GET /service-providers/catalog` | Read normalized service catalog. | policy to finalize | n/a | No provider secrets. |
| `POST /service-providers/{id}/validate-reference` | Validate reference. | owner | bounded | Audit safe reference-validation outcome. |
| `POST /service-providers/{id}/lookup-amount` | Lookup provider amount. | owner | bounded | Detect amount mismatch before execution. |
| `GET /admin/prontipagos/reconciliation` | Review reconciliation records. | finance/admin future | n/a | RBAC and redaction required. |
| `POST /admin/prontipagos/reconciliation/run` | Run reconciliation job. | finance/admin/system future | job key future | Audit run and mismatches. |

## Phase 8C Sandbox Payment API

`POST /payments/sandbox` is implemented for authenticated backend sandbox/mock validation. It does not replace the existing `POST /payments` mock/dev endpoint and does not call real providers.

Conceptual request:

```json
{
  "user_service_id": 1,
  "mock_card_token": "pm_mock_card_demo",
  "idempotency_key": "client-sandbox-key",
  "card_scenario": "success",
  "prontipagos_scenario": "success"
}
```

Safe response fields include `payment_id`, `status`, `card_status`, `service_payment_status`, `receipt_status`, amount/fee/total minor units, `currency`, mock/sandbox flags, safe card/provider references, `correlation_id`, and safe `message`.

Implemented sandbox scenarios are controlled mocks. The API never accepts PAN or CVV and never returns raw provider payloads or secrets.

## Phase 9 Receipt Proof APIs

The following owner-scoped endpoints are implemented and require bearer auth:

| Endpoint | Purpose | Notes |
|---|---|---|
| `GET /receipts` | List generated current-user receipts. | Existing list contract remains compatible. |
| `GET /receipts/{receipt_id}` | Read safe receipt proof detail. | Emits `receipt.viewed`; `404` for another user. |
| `GET /payments/{payment_id}/proof` | Read safe proof from a current-user payment, including pending/unavailable states. | Emits `proof.viewed`; `404` for another user. |

Proof response fields include `payment_id`, nullable `receipt_id`, service/provider labels, masked service reference, `amount_minor`, `fee_minor`, `total_minor`, `currency`, `payment_status`, `provider_status`, `receipt_status`, `proof_status`, safe card label, safe internal/provider/correlation references, mock/sandbox flags, issued/confirmed timestamps, unavailable reason, and disclaimer.

`proof_status=confirmed` requires succeeded payment plus provider-confirmed or mock-confirmed evidence. Pending, timeout, failed, and unknown provider states do not become confirmed proof.

Mobile demo-card note:

- The current `ConfirmPayment` tarjeta demo UX still uses the local mobile mock payment store for Phase 5E/5F scenarios.
- That local success path opens `ReceiptDetail` with a local mock proof projection and does not call `/payments/{payment_id}/proof` because its `paymentId` is not a backend payment id.
- Backend proof endpoints remain the source for authenticated persisted backend mock/sandbox payments.

## Phase 9 In-App Notification APIs

| Endpoint | Purpose | Auth | Notes |
|---|---|---|---|
| `GET /notifications` | List current-user in-app notifications. | required | Returns type, title, message, entity context, read state, timestamp. |
| `PATCH /notifications/{id}/read` | Mark one current-user notification read. | required | Emits `notification.read`; `404` for another user. |

Push and email delivery remain future channels. Notification bodies must stay safe and must not include PAN, CVV, raw provider payloads, or secrets.

## Implemented CRM Admin APIs

Status: Phase 10B backend implementation. These routes require bearer auth plus the explicit runtime permission listed below. They return redacted operational fields only.

| Endpoint | Purpose | Role | Permission | Sensitive response rule | Audit |
|---|---|---|---|---|---|
| `GET /admin/dashboard` | Operational KPI summary | CRM roles | `admin.dashboard.view` | aggregates only | `admin.dashboard_viewed` |
| `GET /admin/users` | Search users by safe query | CRM roles | `admin.users.list` | identity masked for non-admin roles | `admin.users_list_viewed` |
| `GET /admin/users/{id}` | User detail | CRM roles | `admin.users.view` | minimum necessary role view | `admin.user_viewed` |
| `GET /admin/payments` | Payment list/filter | CRM roles | `admin.payments.list` | mapped payment/provider fields only | `admin.payments_list_viewed` |
| `GET /admin/payments/{id}` | Payment detail | CRM roles | `admin.payments.view` | no raw provider payload/card secret | `admin.payment_viewed` |
| `GET /admin/receipts` | Receipt list/filter | CRM roles | `admin.receipts.list` | proof-safe fields | `admin.receipts_list_viewed` |
| `GET /admin/receipts/{id}` | Receipt detail | CRM roles | `admin.receipts.view` | proof-safe fields | `admin.receipt_viewed` |
| `GET /admin/audit-events` | Audit event list/filter | `ADMIN`, `AUDITOR`, `SUPER_ADMIN` | `admin.audit.list` | redacted metadata | `admin.audit_events_viewed` |
| `GET /admin/reconciliation/card` | Card reconciliation placeholder | finance/audit/admin | `admin.reconciliation.card.view` | `status=not_implemented` | `admin.reconciliation_viewed` |
| `GET /admin/reconciliation/prontipagos` | Prontipagos reconciliation placeholder | finance/audit/admin | `admin.reconciliation.prontipagos.view` | `status=not_implemented` | `admin.reconciliation_viewed` |
| `GET /admin/manual-review` | Manual review queue | permitted CRM roles | `admin.manual_review.list` | safe references | none on list |
| `GET /admin/manual-review/{id}` | Manual review detail | permitted CRM roles | `admin.manual_review.view` | safe references | none on detail |
| `POST /admin/manual-review` | Create review case | finance/admin | `admin.manual_review.update` | safe references | `admin.manual_review_created` |
| `PATCH /admin/manual-review/{id}` | Assign/update review | finance/admin | `admin.manual_review.update` | safe resolution | `admin.manual_review_updated` |
| `GET /admin/support/tickets` | Ticket list | permitted CRM roles | `admin.support_tickets.list` | safe notes only | none on list |
| `GET /admin/support/tickets/{id}` | Ticket detail | permitted CRM roles | `admin.support_tickets.list` | safe notes only | none on detail |
| `POST /admin/support/tickets` | Create ticket | support/admin | `admin.support_tickets.create` | safe body | `admin.ticket_created` |
| `PATCH /admin/support/tickets/{id}` | Update ticket | support/admin | `admin.support_tickets.update` | safe fields | `admin.ticket_updated` |
| `POST /admin/support/tickets/{id}/notes` | Add ticket note | support/admin | `admin.support_tickets.update` | safe note body | `admin.ticket_note_added` |

`/admin/users`, `/admin/payments`, `/admin/receipts`, `/admin/audit-events`, `/admin/manual-review`, and `/admin/support/tickets` expose bounded `limit`/`offset` pagination. Payment list supports status, user, provider-reference, and correlation filters. Reconciliation endpoints are placeholders, not production reconciliation evidence. Ledger and catalog admin APIs remain future. Export is denied unless a later endpoint and permission explicitly allow it.

## Phase 10C Admin Frontend Consumption

The separate `admin/` React/Vite frontend consumes the implemented `/admin/*` endpoints above through `VITE_API_BASE_URL`. The UI marks card and Prontipagos reconciliation responses as placeholders and does not fabricate production rows.

The current admin access screen accepts an existing backend bearer token. Because dedicated admin auth claims/session hardening are still pending, development role rendering is explicitly controlled by `VITE_ENABLE_ADMIN_DEV_AUTH` and `VITE_ADMIN_DEV_ROLE`; backend permission checks remain authoritative for every request.
## Phase 10D - CRM Operational Workflows

Implemented admin workflow endpoints remain internal, authenticated, RBAC-protected, and redacted by role. They do not move money, do not integrate real card or Prontipagos providers, and do not expose PAN/CVV/tokens/secrets/raw provider payloads.

### Support Tickets

- `GET /admin/support/tickets` - list tickets.
- `GET /admin/support/tickets/{ticket_id}` - view a ticket.
- `POST /admin/support/tickets` - create a ticket with optional `user_id`, `payment_id`, `receipt_id`, `manual_review_case_id`, and `correlation_id`.
- `PATCH /admin/support/tickets/{ticket_id}` - update status, priority, assignment, links, or resolution note.
- `POST /admin/support/tickets/{ticket_id}/notes` - add a safe internal note.

Ticket status values: `open`, `pending`, `waiting_user`, `waiting_internal`, `resolved`, `closed`.

Rule: `resolved` and `closed` require `resolution_note`; the backend rejects closure without it.

### Manual Review

- `GET /admin/manual-review` - list manual review cases.
- `GET /admin/manual-review/{case_id}` - view a manual review case.
- `POST /admin/manual-review` - create a case with `case_type`, `summary`, severity, optional references, and optional support ticket link.
- `PATCH /admin/manual-review/{case_id}` - update status, severity, assignment, resolution, or note.

Manual review status values: `open`, `assigned`, `investigating`, `waiting_provider`, `waiting_user`, `resolved`, `escalated`, `closed`.

Rule: `resolved` and `closed` require `resolution`; the backend rejects closure without it. This does not mutate payments, receipts, ledger, or provider state.

### Search / Investigation

- `GET /admin/search?q={value}&type={optional}` - searches operational references.

Supported `type` values: `user`, `payment`, `receipt`, `ticket`, `manual_review`, `correlation`, `provider_reference`.

Search responses are redacted by role. Provider references are limited for SUPPORT and never include raw provider payloads.

### Reconciliation Placeholders

- `GET /admin/reconciliation/card`
- `GET /admin/reconciliation/prontipagos`

Both return a separated placeholder structure:

```json
{
  "provider_type": "card_processor",
  "status": "not_implemented",
  "summary": {
    "total_count": 0,
    "matched_count": 0,
    "mismatch_count": 0,
    "pending_count": 0,
    "manual_review_count": 0
  },
  "items": [],
  "message": "Reconciliation is planned for a later phase.",
  "production_ready": false
}
```

These endpoints are not real reconciliation and must not be presented as production operations.

## Future WhatsApp Receipt Channel APIs

Status: future/proposed only. No WhatsApp runtime endpoints are implemented in Phase 10D.1.

| Endpoint | Purpose | Auth | Status | Notes |
|---|---|---|---|---|
| `GET /notification-preferences` | Read current user's notification preferences | required | future/proposed | Must return granular channel/type preferences. |
| `PATCH /notification-preferences` | Update consent/preferences | required | future/proposed | No pre-enabled WhatsApp toggles; emits consent/audit events. |
| `POST /notifications/whatsapp/receipts/{receipt_id}/send` | Request future WhatsApp receipt send | required | future/proposed | Requires explicit consent, receipt ownership, idempotency, and safe payload. |
| `GET /notifications/deliveries` | List safe delivery attempts | required | future/proposed | Must not expose full phone numbers or raw provider errors. |
| `POST /notifications/whatsapp/webhooks/{provider}` | Receive provider delivery webhook | provider signed | future/proposed | Requires signature/replay verification before runtime. |

Future MVP is limited to template `fondix_pago_exitoso`. WhatsApp failure must return a safe delivery status and must not change payment, receipt, ledger, or proof state.

## Public Landing Page

Status: implemented as static public front door under `landing/`.

The public landing page does not expose or consume backend API endpoints. It must not call:

- `/payments`,
- `/receipts`,
- `/notifications`,
- `/admin/*`,
- provider endpoints,
- ledger/audit endpoints,
- user account endpoints.

Future public waitlist or contact capture would require a separate approved API contract, privacy review, rate limiting, spam controls, and no sensitive financial data.
## Future Coverage-Aware Service Catalog APIs

Status: partially implemented in Phase 10F.

### Public / Mobile APIs

| Endpoint | Purpose | Status | Notes |
|---|---|---|---|
| `GET /service-catalog` | Return mobile-safe service catalog items. | implemented | Returns only payable mobile services by default. Current conservative seed returns empty list. |
| `GET /service-catalog/{id}` | Return mobile-safe service detail. | implemented | Non-payable services return 404 to mobile/public clients. |
| `GET /service-catalog/{id}/payable` | Validate payment eligibility. | implemented | Diagnostic endpoint returns reasons; does not execute payment. |
| `GET /service-categories` | Return categories for service discovery. | implemented | Used by mobile and future landing catalog filters. |
| `GET /coverage-map` | Return public coverage map data. | implemented | Commercial/reference data only, not payment authority. |
| `GET /coverage-map/states/{state_code}` | Return public state coverage summary. | implemented | Includes `reference_services`, `payable_services`, and disclaimer metadata. |

### Admin APIs

| Endpoint | Purpose | Status | Notes |
|---|---|---|---|
| `GET /admin/service-catalog` | Admin view of all services and statuses. | implemented | Requires `admin.catalog.view`. |
| `GET /admin/service-catalog/{id}` | Admin service detail. | implemented | Includes coverage and provider capability status. |
| `PATCH /admin/service-catalog/{id}` | Update safe visibility/status metadata. | implemented | Requires `admin.catalog.manage`; blocks payable=true without confirmed capability. |
| `POST /admin/service-catalog/seed` | Seed conservative reference catalog. | implemented | Idempotent enough for dev/test; no provider confirmation. |
| `POST /admin/service-catalog/sync` | Start future provider catalog sync. | future | Placeholder until Prontipagos integration is contractual. |
| `GET /admin/service-catalog/syncs` | View sync history. | future | Requires future sync model. |

Rules:

- No unconfirmed service can be returned as payable.
- Public APIs must not expose provider credentials, raw payloads, or admin notes.
- Admin APIs must require authentication, explicit permissions, redaction, and audit logging.

### Example `/service-catalog` Response

Current conservative seed returns no payable services:

```json
{
  "services": [],
  "count": 0,
  "reference_only": false,
  "payment_availability_not_guaranteed": false,
  "disclaimer": null
}
```

### Example `/coverage-map/states/GTO` Response

```json
{
  "state_code": "GTO",
  "state_name": "Guanajuato",
  "reference_services": [],
  "payable_services": [],
  "reference_only": true,
  "payment_availability_not_guaranteed": true,
  "disclaimer": "Cobertura referencial sujeta a disponibilidad del proveedor..."
}
```
## Phase 10G WhatsApp Receipt Endpoints

User endpoints:

- `GET /notification-preferences`: returns the current WhatsApp payment receipt preference. Default is disabled.
- `PATCH /notification-preferences`: updates explicit consent for `channel=whatsapp` and `notification_type=payment_receipt`.
- `GET /notifications/deliveries`: returns the authenticated user's notification deliveries with masked recipient only.
- `POST /notifications/whatsapp/receipts/{receipt_id}/send`: requests a non-blocking WhatsApp receipt delivery for a confirmed receipt.

Admin endpoints:

- `GET /admin/notifications/deliveries`: lists masked notification deliveries for permitted admin roles.
- `GET /admin/notifications/deliveries/{id}`: returns one masked delivery.

Rules:

- `fondix_pago_exitoso` is the only runtime WhatsApp template in this phase.
- Send requires auth, confirmed payment, confirmed/generated receipt proof, valid recipient, and explicit consent.
- Duplicate sends are blocked by receipt/channel/template/recipient hash idempotency.
- Delivery failure never mutates payment, receipt, proof, ledger, or internal receipt status.

## Phase 11 Fraud And Dispute Admin APIs

Status: implemented as internal CRM/Admin APIs. These endpoints do not expose customer-facing fraud labels and do not mutate payment, receipt, ledger, or provider state.

### Fraud Signals

| Endpoint | Purpose | Permission | Audit |
|---|---|---|---|
| `GET /admin/fraud/signals` | List signals by status, severity, or payment. | `admin.fraud_signals.list` | none on list in Phase 11 |
| `GET /admin/fraud/signals/{signal_id}` | View one signal. | `admin.fraud_signals.view` | none on detail in Phase 11 |
| `POST /admin/fraud/signals` | Create an explainable signal for review. | `admin.fraud_signals.update` | `fraud.signal.created` |
| `PATCH /admin/fraud/signals/{signal_id}/status` | Mark reviewed, dismissed, or escalated. | `admin.fraud_signals.update` | `fraud.signal.reviewed`, `fraud.signal.dismissed`, or `fraud.signal.escalated` |

Resolution text is required for reviewed, dismissed, or escalated status.

### Disputes And Chargebacks

| Endpoint | Purpose | Permission | Audit |
|---|---|---|---|
| `GET /admin/disputes` | List dispute/chargeback cases. | `admin.disputes.list` | none on list in Phase 11 |
| `POST /admin/disputes` | Create an internal case. | `admin.disputes.update` | `dispute.created` or `chargeback.created` |
| `GET /admin/disputes/{case_id}` | View one case with evidence metadata. | `admin.disputes.view` | none on detail in Phase 11 |
| `PATCH /admin/disputes/{case_id}/status` | Update case status/assignment. | `admin.disputes.update` | `dispute.status_changed`, `dispute.closed`, `chargeback.status_changed`, or `chargeback.closed` |
| `POST /admin/disputes/{case_id}/evidence` | Append evidence metadata. | `admin.disputes.update` | `dispute.evidence_added` or `chargeback.evidence_added` |

Evidence stores safe metadata and private references only. No external card-network submission is implemented.

## Phase 10X.1 Public Landing Chatbot APIs

Status: implemented for public landing informational routing and internal CRM response management.

Public:

| Endpoint | Purpose | Auth | Notes |
|---|---|---|---|
| `POST /api/public/chat` | Answer public landing chatbot questions. | no | Uses anonymous session ID, masks stored user message, and never accesses private customer/payment data. |

Internal admin:

| Endpoint | Purpose | Permission |
|---|---|---|
| `GET /admin/chat/faqs` | List FAQ responses. | `admin.chatbot.view` |
| `POST /admin/chat/faqs` | Create FAQ response. | `admin.chatbot.manage` |
| `PATCH /admin/chat/faqs/{id}` | Update FAQ response. | `admin.chatbot.manage` |
| `POST /admin/chat/faqs/{id}/disable` | Disable FAQ response. | `admin.chatbot.manage` |
| `POST /admin/chat/faqs/{id}/enable` | Enable FAQ response. | `admin.chatbot.manage` |
| `GET /admin/chat/intents` | List intents. | `admin.chatbot.view` |
| `POST /admin/chat/intents` | Create intent. | `admin.chatbot.manage` |
| `PATCH /admin/chat/intents/{id}` | Update intent. | `admin.chatbot.manage` |
| `POST /admin/chat/intents/{id}/disable` | Disable intent. | `admin.chatbot.manage` |
| `POST /admin/chat/intents/{id}/enable` | Enable intent. | `admin.chatbot.manage` |
| `GET /admin/chat/knowledge` | List knowledge entries. | `admin.chatbot.view` |
| `POST /admin/chat/knowledge` | Create knowledge entry. | `admin.chatbot.manage` |
| `PATCH /admin/chat/knowledge/{id}` | Update knowledge entry. | `admin.chatbot.manage` |
| `POST /admin/chat/knowledge/{id}/disable` | Disable knowledge entry. | `admin.chatbot.manage` |
| `POST /admin/chat/knowledge/{id}/enable` | Enable knowledge entry. | `admin.chatbot.manage` |
| `GET /admin/chat/conversations` | List conversation history. | `admin.chatbot.conversations.view` |
| `GET /admin/chat/conversations/{id}` | View masked messages in one conversation. | `admin.chatbot.conversations.view` |
| `GET /admin/chat/fallbacks` | Review unanswered/fallback prompts. | `admin.chatbot.fallbacks.review` |
| `GET /admin/chat/settings` | List bot settings. | `admin.chatbot.view` |
| `PATCH /admin/chat/settings/{key}` | Update one setting value. | `admin.chatbot.settings.manage` |

Rules:

- Public chatbot cannot query private payment, receipt, balance, customer, transaction, OTP, card, or account data.
- FAQ/rule-only mode works when no AI provider is configured.
- Admin responses and conversation logs are internal and RBAC-protected.

## Phase 10X.2 Chat Operations APIs

Status: implemented as internal CRM/Admin operational APIs. They are authenticated, RBAC-protected, and do not expose public ticket internals.

| Endpoint | Purpose | Permission |
|---|---|---|
| `GET /admin/chat/operations/metrics` | Chat operations metrics: conversations, escalations, tickets, SLA, fallback, intents. | `admin.chat_ops.view` |
| `GET /admin/chat/operations/conversations` | Search/filter operational conversation queue by status, severity, source, assignment, ticket, escalation, and query. | `admin.chat_ops.view` |
| `GET /admin/chat/operations/conversations/{id}` | View one conversation with masked messages, classification, notes, and events. | `admin.chat_ops.view` |
| `POST /admin/chat/operations/conversations/{id}/ticket` | Create a chat-origin support ticket. | `admin.chat_ops.manage` |
| `POST /admin/chat/operations/conversations/{id}/escalate` | Route a conversation to the human queue. | `admin.chat_ops.manage` |
| `POST /admin/chat/operations/conversations/{id}/assign` | Assign a conversation to the current admin or supplied agent. | `admin.chat_ops.assign` |
| `POST /admin/chat/operations/conversations/{id}/severity` | Manually override conversation severity. | `admin.chat_ops.severity.override` |
| `POST /admin/chat/operations/conversations/{id}/notes` | Add an internal masked note. | `admin.chat_ops.notes.create` |
| `POST /admin/chat/operations/conversations/{id}/review` | Mark a conversation reviewed. | `admin.chat_ops.manage` |
| `POST /admin/chat/operations/tickets/{ticket_id}/first-response` | Mark first human response timestamp. | `admin.chat_ops.first_response` |
| `POST /admin/chat/operations/tickets/{ticket_id}/{resolved|closed|reopened}` | Move chat-origin ticket through terminal/reopen states with required note. | `admin.chat_ops.manage` |

Rules:

- `SEV-1` and `SEV-2` conversations must require ticket/human review and must not be auto-closed by AI.
- Public chatbot responses continue to use safe routing and do not reveal ticket, customer, payment, receipt, balance, or transaction internals.
- Admin operation audit events are emitted with actor, role, permission, entity, result, and safe metadata.

## Sprint 020 Future Coverage And Location APIs

Status: proposed/not implemented unless explicitly marked as existing. Sprint 020 documents contracts only and does not create endpoints.

Current related endpoint: `GET /service-catalog?state_code={code}` exists and accepts short state codes such as `CHH`. Future implementation must decide whether to evolve this endpoint or add canonical `/api/catalog/*` endpoints with `MX-*` state codes.

| Endpoint | Purpose | Status | Notes |
|---|---|---|---|
| `GET /api/catalog/services?state=MX-CHH` | Return services available for selected/detected state plus national services. | proposed/not implemented | Include `NATIONAL`/`MX-ALL` and state-matching services; exclude disabled/unavailable local services. Auth/audit TBD. |
| `GET /api/catalog/states` | Return supported Mexico states, names, canonical codes, and availability status. | proposed/not implemented | Used by manual selector and validation. |
| `PATCH /api/users/me/location-preference` | Persist user's manual selected state if backend profile storage is approved. | proposed/not implemented | Auth required, user-bound, audit required if server-side. Stores state code, not raw coordinates. |
| `POST /api/location/resolve-state` | Resolve coordinates to state code if backend reverse geocoding is approved. | proposed/not implemented | Must not log raw coordinates or send them to Tekae; rate limiting required. |

Rules:

- National services must appear for every valid Mexican state unless disabled.
- Unknown location must not pretend coverage is known.
- Manual selected state must override GPS for browsing until changed.
- Raw coordinates must not be returned, logged, persisted, or shared with Tekae by default.

## Sprint 021 Proposed Catalog Normalization APIs

Sprint 021 documents future catalog normalization only. No endpoint is created or modified.

Proposed/not implemented future API implications:

| API | Purpose | Status |
|---|---|---|
| `GET /api/catalog/services?state=MX-CHH` | Return active normalized services for a selected/detected state plus national services. | Proposed/not implemented |
| `GET /api/catalog/services/{serviceId}` | Return one approved normalized service record. | Proposed/not implemented |
| `POST /api/admin/catalog/imports/tekae` | Admin-only Tekae catalog import after schema validation. | Proposed/not implemented |
| `GET /api/admin/catalog/imports` | Admin-only import history and validation status. | Proposed/not implemented |
| `GET /api/admin/catalog/review-queue` | Admin-only review queue for unknown coverage/category/mapping rows. | Proposed/not implemented |
| `PATCH /api/admin/catalog/items/{serviceId}` | Admin-only correction for category, coverage, logo, or active state. | Proposed/not implemented |

Compatibility note: current runtime still exposes `GET /service-catalog?state_code={code}` and uses short state codes such as `CHH`. Future API work must decide whether to normalize that endpoint, add an `/api/catalog/services` facade, or accept both existing short codes and canonical `MX-*` during migration.
