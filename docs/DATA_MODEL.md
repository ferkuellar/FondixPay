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
| TekaeSession | Future safe reference to a backend-generated Tekae SSO launch session |

## Production Rule

Real payments require ledger, provider attempt tracking, webhook event persistence, reconciliation, and audit logs before launch.

Sprint 010 narrows the payment-provider model: Tekae is the approved provider, and FONDIXPAY must not implement a card vault, wallet, ledger balance, tokenization, acquiring, SPEI processor, or banking core.

## Sprint 010 Tekae Proposed Model

Status: proposed only. No migration or runtime model is added in Sprint 010.

### `tekae_sessions`

| Field | Purpose |
| --- | --- |
| `id` | Internal session identifier. |
| `user_id` | FONDIXPAY authenticated user. |
| `intent` | User intent such as pay service, airtime, or entertainment. |
| `menu` | Tekae menu value: `null`, `"1"`, `"2"`, or `"3"`. |
| `categoria` | Optional Tekae category value when confirmed. |
| `carrier` | Optional Tekae carrier value when confirmed. |
| `blockview` | Provider launch mode flag. |
| `status` | Internal Tekae session status. |
| `launch_url_hash` | Hash of the launch URL; full URL must not be logged. |
| `expires_at` | Token/session expiration timestamp. |
| `created_at` | Creation timestamp. |
| `updated_at` | Last update timestamp. |

### `tekae_session_events`

| Field | Purpose |
| --- | --- |
| `id` | Event identifier. |
| `tekae_session_id` | Related session. |
| `event_type` | Session requested, token ready, launched, expired, failed, outcome unknown. |
| `result` | Success, failure, pending, blocked. |
| `metadata_json` | Redacted metadata only. |
| `request_id` | Request-level trace ID. |
| `correlation_id` | Flow-level trace ID if linked to payment/support. |
| `created_at` | Append timestamp. |

### Model Rules

- Do not store Tekae `uid`, `password`, raw token, full launch URL, or provider secrets.
- Do not store PAN, CVV, raw card data, card tokens, or raw payment credentials.
- Do not expose a wallet or ledger balance.
- Tekae session state is not payment success.
- Provider evidence, once confirmed by Tekae specs, must be modeled separately from launch state.

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
## Phase 7 History And Receipt Projection

The Phase 7 mobile projection treats visible history as a joinable view over payment facts, receipt facts, movement facts, and future ledger/audit references.

| Concept | Current mock/dev source | Future trace link |
|---|---|---|
| Payment history item | Local mobile payment store plus persisted backend success records | `payment_id`, `correlation_id`, payment intent |
| Receipt status | Mobile mock receipt status plus generated backend receipts | `receipt_id`, generation event |
| Demo movement | Phase 6B `movements` table | `movement_id`, `payment_id`, `receipt_id`, ledger entry |

Receipt status values are explicit: `generated`, `pending`, `unavailable`, and future `voided`. A failed or pending payment attempt must not project a confirmed receipt merely because a history row exists.

## Card-Focused Payment Method Model

`PaymentMethod` is card-focused in the current roadmap.

| Field | Notes |
|---|---|
| `id` | Internal payment method id. |
| `user_id` | Card owner scope. |
| `type` | `card` only for real roadmap payment methods. |
| `card_brand` | Safe processor/card brand label. |
| `last4` | Safe card display field. |
| `exp_month` | Expiry month when processor-approved to retain. |
| `exp_year` | Expiry year when processor-approved to retain. |
| `provider_token_reference` | Token/vault reference, never PAN. |
| `provider_name` | Future approved card processor. |
| `status` | Active, pending validation, expired, unavailable, removed. |
| `is_default` | Current selected/default card reference. |
| `is_mock` | True for card demo. |
| `deleted_at` | Soft delete/detach lifecycle. |

No active user-facing payment-method types are planned for SPEI, CoDi, OXXO/store payment, cash-in, bank transfer, wallet balance, stored balance, or cash.

## Card Processor Sandbox Proposed Model

Status: future/proposed for Phase 8A design. No migration or runtime model is added in this phase.

### `CardPaymentMethod`

- `id`
- `user_id`
- `provider_name`
- `provider_customer_id` nullable
- `provider_payment_method_token`
- `brand`
- `last4`
- `exp_month`
- `exp_year`
- `status`
- `is_default`
- `is_mock`
- `created_at`
- `tokenized_at`
- `deleted_at`

### `CardPaymentAttempt`

- `id`
- `payment_intent_id`
- `card_payment_method_id`
- `amount_minor`
- `currency`
- `status`
- `idempotency_key`
- `provider_transaction_id` nullable
- `error_code` nullable
- `error_message_safe` nullable
- `created_at`
- `updated_at`

### Additional Future Entities

- `CardProcessorTransaction`
- `CardProcessorEvent`
- `CardChargeReconciliationRecord`

Rules:

- No PAN.
- No CVV.
- Processor tokens and safe display metadata only.
- Card processor reconciliation is separate from future Prontipagos service-payment reconciliation.

## Superseded Prontipagos Sandbox Proposed Model

Status: historical/superseded by Sprint 010 Tekae discovery. No new implementation should target Prontipagos.

### `ServicePaymentAttempt`

- `id`
- `payment_intent_id`
- `user_service_id`
- `service_provider_id`
- `provider_name`
- `provider_operation`
- `service_reference`
- `amount_minor`
- `currency`
- `status`
- `idempotency_key`
- `provider_reference` nullable
- `provider_status` nullable
- `error_code` nullable
- `error_message_safe` nullable
- `request_payload_hash` nullable
- `response_payload_hash` nullable
- `correlation_id`
- `created_at`
- `updated_at`

### Additional Future Entities

- `ProviderTransaction`: safe Prontipagos reference, mapped status, amount/currency, response hash, confirmation time.
- `ProviderStatusCheck`: status-query evidence for ambiguous/pending attempts.
- `ServiceCatalogSync`: catalog sync lifecycle and safe counts/errors.
- `ReconciliationRecord`: internal/provider mismatch, evidence, and manual-review state.

Rules:

- Do not store provider secrets.
- Store full provider payloads only if later approved with redaction and retention controls; default to safe hashes.

## Phase 8C Sandbox Data Status

- Implemented/partial: existing `PaymentIntent`, `PaymentAttempt`, and `ProviderTransaction` models store card mock charge and Prontipagos mock service-payment attempts.
- Implemented/partial: receipt is generated only when the Prontipagos mock response is confirmed.
- Implemented/partial: provider response evidence uses hash fields already present on provider transactions.
- Pending: dedicated `CardPaymentAttempt`, `ServicePaymentAttempt`, status-check, webhook-event, and reconciliation execution models.
- Pending: admin/manual-review records beyond sandbox `payment.manual_review_required` audit events.

## Phase 9 Receipt Proof Projection

`ReceiptProof` is a response projection, not a fiscal record. It joins safe fields from payment, optional receipt, payment intent, user service/provider, service-payment provider transaction, and correlation metadata.

| Field Group | Fields |
|---|---|
| Breakdown | `amount_minor`, `fee_minor`, `total_minor`, `currency` |
| State | `payment_status`, `provider_status`, `receipt_status`, `proof_status`, `unavailable_reason` |
| Safe support references | `payment_id`, nullable `receipt_id`, `internal_reference`, nullable `provider_reference`, nullable `correlation_id` |
| User display | service/provider name, masked service reference, safe card label, issued/confirmed timestamps, mock/sandbox disclaimer |

Receipt statuses remain `generated`, `pending`, `unavailable`, and future `voided`. Proof statuses are `confirmed`, `pending`, `review`, and `unavailable`.

Notification storage now includes `type`, `title`, nullable related `entity_type`/`entity_id`, read flag, and creation time. It is still an in-app baseline; push/email delivery records remain future.

## CRM/Admin Proposed Model

Status: proposed for Phase 10B+; Phase 10A adds no schema migration.

Proposed entities:

- `AdminUserRole` or explicit `UserRole` extension
- `Permission`
- `RolePermission`
- `SupportTicket`
- `SupportTicketNote`
- `ManualReviewCase`
- `ManualReviewEvent`
- `ReconciliationCase`
- `AdminActionAudit`

### `SupportTicket`

- `id`
- `user_id` nullable
- `payment_id` nullable
- `receipt_id` nullable
- `status`
- `priority`
- `category`
- `assigned_to` nullable
- `created_by`
- `created_at`
- `updated_at`

### `ManualReviewCase`

- `id`
- `case_type`
- `status`
- `severity`
- `user_id` nullable
- `payment_id` nullable
- `receipt_id` nullable
- `card_reference` nullable and safe only
- `provider_reference` nullable and safe only
- `correlation_id` nullable
- `assigned_to` nullable
- `resolution` nullable
- `created_at`
- `updated_at`

### `AdminActionAudit`

- `id`
- `admin_user_id`
- `role`
- `permission`
- `action`
- `entity_type`
- `entity_id`
- `result`
- `metadata_json`
- `request_id`
- `ip_address`
- `user_agent`
- `created_at`

Rules:

- Manual review and support notes must be safe/redacted.
- Admin audit and role models must not grant frontend-only authorization.
- Ledger entries remain append-only and are not destructively editable from CRM.
## CRM/Admin Implemented Backend Model

Phase 10B implements a minimal CRM backend model on top of the existing user-auth foundation.

### User role extension

`User.role` persists one runtime role string. Default application users remain `USER`; CRM roles are `SUPPORT`, `FINANCE`, `ADMIN`, `AUDITOR`, and `SUPER_ADMIN`. Runtime permissions are code-defined in the admin module for this phase.

### SupportTicket

Implemented fields: `id`, nullable `user_id`, nullable `payment_id`, nullable `receipt_id`, `status`, `priority`, `category`, `subject`, nullable `description`, nullable `assigned_to`, `created_by`, `created_at`, `updated_at`.

`SupportTicketNote` stores `ticket_id`, `author_id`, safe note text, `is_internal`, and timestamp. Notes must not hold PAN/CVV/secrets/provider raw payloads.

### ManualReviewCase

Implemented fields: `id`, `case_type`, `status`, `severity`, nullable `user_id`, nullable `payment_id`, nullable `receipt_id`, nullable safe card/provider references, nullable `correlation_id`, nullable `assigned_to`, nullable `resolution`, timestamps.

`ManualReviewEvent` stores per-case actor/event metadata for created and updated transitions. This complements the global audit writer.

### Still proposed

Dedicated `Permission`/`RolePermission` tables, reconciliation case persistence, admin session records, export approvals, and full frontend-facing CRM view models remain proposed after Phase 10B.
## Phase 10D - CRM Operational Workflow Model

Implemented/extended internal admin models:

### SupportTicket

- `id`
- `user_id` nullable
- `payment_id` nullable
- `receipt_id` nullable
- `manual_review_case_id` nullable
- `correlation_id` nullable
- `category`
- `priority`
- `status`
- `subject`
- `description` nullable
- `assigned_to` nullable
- `created_by`
- `created_at`
- `updated_at`
- `closed_at` nullable

Supported statuses: `open`, `pending`, `waiting_user`, `waiting_internal`, `resolved`, `closed`.

Supported categories: `payment_failed`, `payment_pending`, `receipt_missing`, `card_issue`, `prontipagos_issue`, `duplicate_charge_claim`, `account_access`, `other`.

### SupportTicketNote

- `id`
- `ticket_id`
- `author_id`
- `note`
- `is_internal`
- `created_at`

Notes must not contain PAN/CVV/tokens/secrets/raw provider payloads.

### ManualReviewCase

- `id`
- `case_type`
- `severity`
- `status`
- `user_id` nullable
- `payment_id` nullable
- `receipt_id` nullable
- `support_ticket_id` nullable
- `card_reference` nullable
- `provider_reference` nullable
- `correlation_id` nullable
- `assigned_to` nullable
- `summary`
- `resolution` nullable
- `created_at`
- `updated_at`
- `closed_at` nullable

Supported case types include `card_success_prontipagos_failed`, `card_success_prontipagos_pending`, `prontipagos_timeout`, `receipt_unavailable`, `duplicate_attempt`, `duplicate_charge_claim`, `amount_mismatch`, `chargeback_suspected`, `user_claims_not_paid`, `provider_status_unknown`, `reconciliation_mismatch`, and `other`.

### ManualReviewEvent

- `id`
- `case_id`
- `actor_id`
- `event_type`
- `before_status` nullable
- `after_status` nullable
- `note` nullable
- `metadata_json` nullable and redacted
- `created_at`

Events track `case_created`, `case_assigned`, `status_changed`, `note_added`, `escalated`, `resolved`, and `closed`.

### ReconciliationSummary

The current model is a safe placeholder, not real reconciliation:

- `provider_type`: `card_processor` or `prontipagos`
- `status`: `not_implemented`, `ready_for_sandbox`, or `partial`
- `summary`: zero/default counts for total/matched/mismatch/pending/manual_review
- `items`: currently empty
- `message`
- `production_ready`: always `false` in this phase

### AdminSearch

`/admin/search` returns redacted operational references for user, payment, receipt, ticket, manual review, correlation, and provider reference lookups. It is an investigation projection, not a financial source of truth.

## Phase 10D.1 - WhatsApp Notification Proposed Model

Status: proposed only. No migration or runtime model is added in Phase 10D.1.

### NotificationPreference

- `id`
- `user_id`
- `channel`
- `notification_type`
- `enabled`
- `consented_at`
- `revoked_at`
- `source`

Rules:

- `channel=whatsapp` is future-only until provider and consent implementation exist.
- Consent is granular by notification type.
- No toggle may be pre-enabled.
- Phone-login consent does not imply WhatsApp notification consent.

### NotificationDelivery

- `id`
- `user_id`
- `channel`
- `notification_type`
- `template_name`
- `entity_type`
- `entity_id`
- `recipient_hash`
- `status`
- `idempotency_key`
- `provider_name` nullable
- `provider_message_id` nullable
- `error_code` nullable
- `error_message_safe` nullable
- `created_at`
- `updated_at`

Rules:

- Delivery records are append-only from an operational evidence perspective.
- Full phone numbers are not stored in delivery logs.
- Suggested idempotency key: `receipt_id + channel + template_name + recipient_hash`.
- WhatsApp delivery does not replace internal receipt/proof, ledger, or audit records.
## Coverage-Aware Service Catalog Proposed Model

Status: partially implemented in Phase 10F.

### ServiceCategory

- `id`
- `code`
- `name`
- `display_order`
- `created_at`

### ServiceCatalogItem

- `id`
- `category_id`
- `display_name`
- `slug`
- `icon_key`
- `description`
- `is_national`
- `coverage_status`
- `visible_on_landing`
- `visible_on_mobile`
- `payable_in_mobile`
- `visible_on_admin`
- `show_in_coverage_map`
- `is_mock`
- `sort_order`
- `created_at`
- `updated_at`

### ServiceCoverageByState

- `id`
- `service_catalog_item_id`
- `state_code`
- `state_name`
- `coverage_status`
- `source`
- `notes`
- `created_at`
- `updated_at`

### ProviderServiceCapability

- `id`
- `service_catalog_item_id`
- `provider_name`
- `provider_service_code`
- `supports_reference_validation`
- `supports_amount_lookup`
- `supports_payment_execution`
- `supports_receipt`
- `min_amount_minor`
- `max_amount_minor`
- `currency`
- `status`
- `notes`
- `created_at`
- `updated_at`

### CoverageMapSource

- `id`
- `source_name`
- `source_type`
- `file_path`
- `version`
- `imported_at`
- `notes`

### ServiceCatalogSync

- `id`
- `provider_name`
- `status`
- `started_at`
- `completed_at`
- `created_by`
- `summary_json`
- `error_message_safe`

### ServiceAvailabilityEvent

- `id`
- `service_catalog_item_id`
- `event_type`
- `before_status`
- `after_status`
- `actor_id`
- `reason`
- `created_at`

### Model Rules

- `payable_in_mobile=true` requires `coverage_status=available` and confirmed provider capability.
- National coverage does not imply payable status.
- Landing visibility does not imply mobile payment eligibility.
- Provider codes and sync metadata are admin-only.
- Coverage changes require audit events.

### Phase 10F Implementation Notes

Implemented tables:

- `catalog_service_categories`
- `service_catalog_items`
- `service_coverage_by_state`
- `provider_service_capabilities`
- `coverage_map_sources`

Not yet implemented:

- `service_catalog_syncs`
- `service_availability_events`

The implemented seed uses safe defaults:

- `coverage_status=provider_pending`
- `payable_in_mobile=false`
- `visible_on_mobile=false`
- provider capability `status=to_confirm`
- `supports_payment_execution=false`
- `supports_receipt=false`
## Phase 10G Notification Tables

`notification_preferences`:

- Stores explicit user consent by `user_id`, `channel`, and `notification_type`.
- Phase 10G uses `channel=whatsapp` and `notification_type=payment_receipt`.
- Default is `enabled=false`; enabling sets `consented_at`; disabling sets `revoked_at`.

`notification_deliveries`:

- Stores delivery evidence for notification attempts.
- Recipient is stored as `recipient_hash` and `recipient_masked`; full phone is not stored.
- `idempotency_key` is unique and built from receipt id, channel, template name, and recipient hash.
- `metadata_json` may include the safe template payload, never PAN, CVV, card token, secrets, raw provider payload, or full phone.

## Phase 11 Fraud And Chargeback Readiness Model

Implemented tables:

### `fraud_signals`

- `id`
- `signal_type`
- `severity`
- `status`
- `entity_type`
- `entity_id`
- `user_id` nullable
- `payment_id` nullable
- `transaction_id` nullable
- `reason`
- `metadata_json`
- `created_by`
- `created_at`
- `reviewed_at` nullable
- `reviewed_by` nullable
- `resolution` nullable

Rules:

- Signals are review-only and do not change user, payment, receipt, ledger, or provider state.
- Reviewed, dismissed, and escalated states require resolution text.
- Metadata must stay redacted.

### `dispute_cases`

- `id`
- `case_type`: `dispute` or `chargeback`
- `status`
- `payment_id` nullable
- `transaction_id` nullable
- `user_id` nullable
- `provider_transaction_id` nullable
- `card_processor_reference` nullable
- `amount_minor` nullable
- `currency`
- `reason_code` nullable
- `summary`
- `opened_at`
- `due_at` nullable
- `closed_at` nullable
- `assigned_to` nullable
- `created_by`
- `updated_by`
- `updated_at`

Statuses: `OPEN`, `UNDER_REVIEW`, `EVIDENCE_GATHERING`, `SUBMITTED`, `WON`, `LOST`, `CLOSED`, `CANCELED`.

### `dispute_evidence`

- `id`
- `dispute_case_id`
- `evidence_type`
- `title`
- `description` nullable
- `storage_reference` nullable
- `source_entity_type` nullable
- `source_entity_id` nullable
- `created_at`
- `created_by`

Evidence records are append-style metadata references. They must not expose private files publicly and must not store PAN, CVV, secrets, or raw provider payloads.

## Phase 10X.1 Chatbot Data Model

Implemented tables:

### `chatbot_faqs`

- `id`
- `question`
- `normalized_question`
- `answer`
- `category`
- `priority`
- `is_active`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

### `chatbot_intents`

- `id`
- `name`
- `description`
- `example_phrases`
- `response`
- `severity_hint`
- `is_active`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

### `chatbot_knowledge_entries`

- `id`
- `title`
- `content`
- `category`
- `tags`
- `is_active`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

### `chatbot_conversations`

- `id`
- `session_id`
- `source`
- `page_url`
- `started_at`
- `last_message_at`
- `status`
- `detected_intent`
- `confidence`
- `created_at`
- `updated_at`

### `chatbot_messages`

- `id`
- `conversation_id`
- `sender_type`
- `message_text_masked`
- `raw_message_stored`
- `classification`
- `created_at`

### `chatbot_fallbacks`

- `id`
- `conversation_id`
- `message_id`
- `message_text_masked`
- `reason`
- `reviewed`
- `created_at`

### `chatbot_settings`

- `id`
- `key`
- `value`
- `updated_at`
- `updated_by`

Rules:

- Public messages are stored masked by default.
- Raw private customer/payment/account state is not queried or stored by the public chatbot.
- Admin response configuration is RBAC-protected and audited.
- AI provider configuration keys are not stored in the database; they are read from environment variables if approved.

## Phase 10X.2 Chat Operations Data Model

Migration: `backend/alembic/versions/20260528_0010_phase_10x2_chat_operations.py`.

Extended `chatbot_conversations`:

- `severity`
- `suggested_severity`
- `classification_reason`
- `ai_suggested_severity`
- `linked_ticket_id`
- `assigned_to`
- `escalation_status`
- `reviewed_at`
- `reviewed_by`

New `chatbot_conversation_events`:

- `id`
- `conversation_id`
- `event_type`
- `actor_id`
- `before_json`
- `after_json`
- `note`
- `created_at`

New `chatbot_internal_notes`:

- `id`
- `conversation_id`
- `author_id`
- `body`
- `created_at`

Extended `support_tickets` for chat-origin cases:

- `conversation_id`
- `ticket_number`
- `source`
- `severity`
- `title`
- `summary`
- `customer_message_excerpt`
- `sla_due_at`
- `first_response_at`
- `resolved_at`
- `reopened_at`

Rules:

- `SEV-1` and `SEV-2` represent human-review-required chat cases.
- Chat-origin tickets use `source=chatbot`.
- Notes and excerpts store masked text and must not contain raw sensitive values.
