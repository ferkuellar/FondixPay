# Data Model

This document captures the conceptual model. No migrations are added in Phase 1.

## Current Concepts

| Entity | Purpose | Current Notes |
| --- | --- | --- |
| User | End-user account identified by phone/session | Needs production auth hardening |
| ServiceProvider | Provider catalog such as CFE, Telmex, Telcel | Existing domain module |
| UserService | Service account/reference saved by a user | Must be user-scoped |
| Payment | Mock payment record/flow | Not real money movement |
| Receipt | Mock receipt generated after payment flow | Needs traceability before production |
| Notification | User-facing message | Delivery channels pending |

## Future Concepts

| Entity | Purpose |
| --- | --- |
| Role | Defines user permission group |
| Permission | Defines allowed action/resource |
| AuditLog | Immutable record of sensitive actions |
| LedgerAccount | Accounting account for future money movement |
| LedgerEntry | Double-entry movement record |
| PaymentProvider | Selected integration provider metadata |
| PaymentAttempt | Provider-specific attempt lifecycle |
| WebhookEvent | Received provider webhook payload and processing state |
| SupportTicket | Support case around user/payment/service |
| AdminAction | Explicit administrative operation record |

## Production Rule

Real payments require ledger, provider attempt tracking, webhook event persistence, reconciliation, and audit logs before launch.

## Ledger and Audit Proposed Model

This model is proposed for Phase 5B implementation. No migrations are applied in Phase 5A.

### `payment_intents`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `user_id` | Owner user. |
| `user_service_id` | Service being paid. |
| `amount_minor` | Service amount in minor units, e.g. centavos. |
| `fee_minor` | FondixPay fee in minor units. |
| `total_minor` | `amount_minor + fee_minor`. |
| `currency` | Explicit currency, default `MXN`. |
| `status` | Internal PaymentIntent state. |
| `idempotency_key` | Duplicate prevention key for critical operations. |
| `correlation_id` | Flow-level trace ID. |
| `created_at` | UTC creation timestamp. |
| `updated_at` | UTC update timestamp. |
| `expires_at` | Expiration time for unconfirmed intent. |

### `payment_attempts`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `payment_intent_id` | Parent payment intent. |
| `provider_name` | Provider or aggregator name, e.g. `prontipagos`. |
| `provider_operation` | Validation, amount lookup, payment, status check, or reconciliation. |
| `status` | Attempt state. |
| `request_payload_hash` | Hash of redacted outbound payload. |
| `response_payload_hash` | Hash of redacted inbound response. |
| `provider_reference` | Provider-side transaction/reference ID when available. |
| `error_code` | Safe provider/internal error code. |
| `error_message_safe` | User/support-safe message. |
| `created_at` | UTC creation timestamp. |
| `updated_at` | UTC update timestamp. |

### `ledger_accounts`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `owner_type` | `USER`, `FONDIX`, `PROVIDER`, `SYSTEM`, or future entity. |
| `owner_id` | Nullable owner identifier. |
| `account_type` | `USER_PENDING`, `FONDIX_FEE_REVENUE`, `PROVIDER_CLEARING`, `PAYMENT_SUSPENSE`, etc. |
| `currency` | Explicit currency. |
| `status` | Active, suspended, closed. |
| `created_at` | UTC creation timestamp. |

### `ledger_entries`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `ledger_account_id` | Account affected. |
| `payment_intent_id` | Related payment intent. |
| `direction` | `debit` or `credit`. |
| `amount_minor` | Integer minor units. |
| `currency` | Explicit currency. |
| `entry_type` | Payment, fee, provider clearing, reversal, adjustment. |
| `description` | Safe operational description. |
| `correlation_id` | Flow-level trace ID. |
| `created_at` | UTC append timestamp. |
| `created_by` | Actor/system identifier. |

### `audit_events`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key or event ID. |
| `event_type` | Stable event name. |
| `actor_type` | `USER`, `ADMIN`, `SYSTEM`, `PROVIDER`. |
| `actor_id` | Nullable actor identifier. |
| `entity_type` | Entity affected. |
| `entity_id` | Entity identifier. |
| `result` | Success, failure, blocked, pending. |
| `before_json` | Redacted before state. |
| `after_json` | Redacted after state. |
| `metadata_json` | Safe metadata only. |
| `request_id` | Request-level ID. |
| `correlation_id` | Flow-level trace ID. |
| `ip_address` | Nullable IP address. |
| `user_agent` | Nullable user agent. |
| `created_at` | UTC append timestamp. |

### `provider_transactions`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `payment_attempt_id` | Related provider attempt. |
| `provider_name` | Provider/aggregator. |
| `provider_reference` | Provider transaction or folio reference. |
| `provider_status` | Provider status mapped into internal taxonomy. |
| `amount_minor` | Provider amount in minor units. |
| `currency` | Explicit currency. |
| `raw_response_hash` | Hash of redacted raw response. |
| `created_at` | UTC creation timestamp. |
| `confirmed_at` | UTC provider confirmation timestamp. |

### `reconciliation_records`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `provider_name` | Provider being reconciled. |
| `reconciliation_date` | Business date. |
| `status` | Started, completed, mismatch, failed. |
| `matched_count` | Number of matched transactions. |
| `mismatch_count` | Number of mismatches. |
| `metadata_json` | Safe summary metadata. |
| `created_at` | UTC creation timestamp. |

### Design Rules

- Do not store financial amounts as floats.
- Do not store raw card data, access tokens, OTP values, or full provider secrets.
- Provider references are not internal primary keys.
- Ledger and audit records are append-only.
- Receipt provider confirmation is separate from internal receipt generation.

## Ledger and Audit Implementation Status

Phase 5B implemented the first backend schema slice for ledger/audit support.

Implemented tables/models:

- `audit_events`
- `payment_intents`
- `payment_attempts`
- `ledger_accounts`
- `ledger_entries`
- `provider_transactions`
- `reconciliation_records`

Migration:

- `backend/alembic/versions/20260520_0001_ledger_audit_foundation.py`

Current constraints:

- Financial amounts use integer minor units for new ledger/payment intent models.
- Currency is explicit and defaults to `MXN`.
- Audit and ledger models are append-only by design, but DB-level update/delete guards are not yet implemented.
- `Base.metadata.create_all` still exists for local/dev/test startup support and remains a production-hardening item.

Pending:

- Full production ledger posting rules.
- Real provider transaction mapping.
- Reconciliation job and review queue.
- Admin/auditor access model.

## Payment And Receipt Fee Transparency Status

Phase 5C adds fee transparency without altering the legacy `payments` table schema.

Current implemented response fields:

- `amount_minor`
- `fee_minor`
- `total_minor`
- `currency`
- `fee_label`
- `fee_description`
- `is_mock`

Current persistence:

- `payment_intents` stores `amount_minor`, `fee_minor`, and `total_minor`.
- Legacy `payments.amount` remains for compatibility.
- Receipt breakdown is derived from the related payment response/model.

Pending before production:

- Decide whether legacy `payments` should persist fee fields directly or rely on `payment_intents`.
- Approve the commercial fee model.
- Add migration if payment/receipt tables need durable production fee fields.

## Payment Method Proposed Model

Status: proposed, not implemented.

### `payment_methods`

| Field | Purpose |
| --- | --- |
| `id` | Internal primary key. |
| `user_id` | Owner user. |
| `type` | `mock`, `card_token`, `spei`, `codi`, `store_cash`, or future type. |
| `provider_name` | Provider/vault name when applicable. |
| `provider_token_reference` | Provider token reference, never raw PAN/CVV. |
| `display_label` | Safe label shown to user/support. |
| `last4` | Nullable last four digits for tokenized cards only. |
| `brand` | Nullable card/network/rail label. |
| `status` | `active`, `pending_validation`, `failed`, `unavailable`, `deleted`. |
| `is_default` | User default flag. |
| `is_mock` | True for dev/internal mock methods. |
| `created_at` | Created timestamp. |
| `updated_at` | Updated timestamp. |
| `deleted_at` | Soft delete timestamp. |

### `payment_method_events`

- `id`
- `payment_method_id`
- `user_id`
- `event_type`
- `result`
- `metadata_json`
- `request_id`
- `correlation_id`
- `created_at`

### `user_payment_preferences`

- `id`
- `user_id`
- `default_payment_method_id`
- `created_at`
- `updated_at`

Rules:

- Do not store PAN.
- Do not store CVV.
- Token references must be provider-generated.
- Mock payment methods must not be used for real money.

## Account and Balance Proposed Model

Status: proposed/design only for Phase 6A.

### `accounts`
- `id`
- `user_id`
- `account_type`
- `status`
- `currency`
- `is_demo`
- `created_at`
- `updated_at`
- `closed_at` nullable

### `balance_snapshots`
- `id`
- `account_id`
- `available_minor`
- `pending_minor`
- `held_minor`
- `simulated_minor`
- `currency`
- `source`
- `is_real_money`
- `is_demo`
- `as_of`
- `created_at`

### `movements`
- `id`
- `account_id`
- `ledger_entry_id` nullable
- `payment_intent_id` nullable
- `receipt_id` nullable
- `movement_type`
- `direction`
- `amount_minor`
- `currency`
- `status`
- `description`
- `created_at`

### `account_events`
- `id`
- `account_id`
- `event_type`
- `actor_id` nullable
- `metadata_json` nullable
- `request_id` nullable
- `correlation_id` nullable
- `created_at`

### Rules
- Balance snapshot is derived/cacheable, not the financial source of truth.
- Ledger entries remain source of financial truth.
- Demo balance must not mix with real provider settlement.
- Amounts use integer minor units and explicit currency.

## Phase 6B Account and Balance Implementation Status
- Implemented in SQLAlchemy and Alembic for demo use: `accounts`, `balance_snapshots`, and `movements`.
- `accounts.user_id` is unique so one demo account is created per authenticated user in this phase.
- `balance_snapshots` stores a demo seed snapshot with integer MXN minor units and explicit `is_demo` / `is_real_money` flags.
- `movements` stores a demo seed credit linked to the demo account; production ledger projection remains pending.
- `account_events` remains proposed; central audit events cover the current account/balance/movement baseline.
