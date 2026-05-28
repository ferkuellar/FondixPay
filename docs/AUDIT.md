# Audit

## Current State

Audit logs are not implemented unless a later technical review proves otherwise. They are required before real financial operations.

## Actions That Must Be Auditable

- Login.
- OTP request.
- OTP verify.
- Service added.
- Service changed or removed.
- Payment created.
- Payment state changed.
- Receipt generated.
- Receipt viewed/downloaded if required by policy.
- Admin action.
- Support action on user/payment/service data.
- Future payment provider error.
- Future webhook received.
- Future webhook processing result.

## Conceptual Audit Event

```json
{
  "id": "audit_event_id",
  "occurred_at": "2026-05-19T00:00:00Z",
  "actor_type": "USER|ADMIN|SYSTEM|PROVIDER",
  "actor_id": "id-or-null",
  "action": "payment.created",
  "resource_type": "Payment",
  "resource_id": "payment_id",
  "request_id": "correlation_id",
  "ip_address": "optional",
  "metadata": {
    "safe": "non-sensitive context only"
  }
}
```

## Rules

- Audit events must not store raw secrets, tokens, OTP codes, card data, or unnecessary personal data.
- Financial audit events should be append-only.
- Administrative actions must include actor identity.
- Provider webhooks must preserve correlation and processing state.

## Phase 4A Auth Audit Contract

The following auth/session events must be emitted when audit logging is implemented:

- `auth.otp_requested`
- `auth.otp_verified`
- `auth.otp_failed`
- `auth.login_success`
- `auth.login_failed`
- `auth.logout`
- `auth.session_restored`
- `auth.token_invalid`

Minimum event fields:

- `event_type`
- `actor_user_id` when known
- `phone_hash` for OTP events instead of raw phone where possible
- `request_id`
- `ip_address`
- `user_agent`
- `device_id` when available
- `result`
- `reason`
- `created_at`

Phase 4A does not implement the audit log table. Real payments remain blocked until auth and financial audit events are implemented.

## Phase 4C Payment UX Audit Events

The following payment UX events must be emitted when audit logging is implemented:

- `payment.fee_disclosed`
- `payment.method_selected`
- `payment.method_added`
- `payment.confirmation_viewed`
- `payment.confirmed`
- `payment.failed`
- `payment.retry_requested`
- `payment.support_requested`
- `receipt.viewed`
- `receipt.shared`
- `receipt.downloaded`

These events must not store raw card data, OTP codes, access tokens, or unnecessary personal data. They should include safe correlation IDs, actor identity when known, payment/receipt identifiers when available, and result status.

## Phase 5A Ledger and Audit Strategy

### Audit Principles

- Audit events are append-only.
- Every financial state change emits an audit event.
- Every provider request/response emits an audit event with redacted metadata.
- Every admin/finance/auditor action emits an audit event.
- Audit events must link to `request_id` and `correlation_id`.
- Audit events must not store raw secrets, full card numbers, OTP codes, access tokens, or unredacted provider payloads.

### Event Catalog

Auth:

- `auth.otp_requested`
- `auth.otp_verified`
- `auth.login_success`
- `auth.login_failed`
- `auth.logout`
- `auth.token_invalid`

User Service:

- `user_service.created`
- `user_service.validated`
- `user_service.validation_failed`
- `user_service.deleted`

Payment:

- `payment.intent_created`
- `payment.fee_disclosed`
- `payment.confirmation_viewed`
- `payment.confirmed_by_user`
- `payment.submitted_to_provider`
- `payment.provider_accepted`
- `payment.provider_rejected`
- `payment.provider_timeout`
- `payment.succeeded`
- `payment.failed`
- `payment.cancelled`
- `payment.retry_requested`
- `payment.duplicate_blocked`

Receipt:

- `receipt.generated`
- `receipt.viewed`
- `receipt.shared`
- `receipt.downloaded`
- `receipt.unavailable`

Provider:

- `provider.request_sent`
- `provider.response_received`
- `provider.webhook_received`
- `provider.reconciliation_started`
- `provider.reconciliation_completed`
- `provider.reconciliation_mismatch`

Admin/Future:

- `admin.payment_reviewed`
- `admin.refund_reviewed`
- `admin.user_locked`
- `admin.config_changed`

### Required Fields

- `event_id`
- `event_type`
- `actor_id`
- `actor_type`
- `entity_type`
- `entity_id`
- `before`
- `after`
- `metadata`
- `request_id`
- `correlation_id`
- `ip_address`
- `user_agent`
- `timestamp`

## Phase 6B Audit Status
- Implemented for the demo baseline: `account.created`, `balance.snapshot_created`, `movement.created`, and `balance.viewed`.
- Pending for later account/balance phases: account status changes, restrictions, holds, demo debit adjustments, statements, and real balance investigation events.
- Current Phase 6B events use the central audit writer with request context when invoked from the API.
- `result`

### Actor Model

- `USER`: authenticated end user.
- `ADMIN`: future administrator.
- `SUPPORT`: future support role with limited access.
- `FINANCE`: future finance/operations role.
- `AUDITOR`: read-only audit role.
- `SYSTEM`: automated internal process.
- `PROVIDER`: external provider/webhook actor.

### Correlation ID Strategy

`correlation_id` must be created at payment-intent start and reused across payment attempts, provider calls, ledger entries, receipts, notifications, support records, and reconciliation. `request_id` is unique per HTTP request or background job execution.

### Financial Audit Requirements

- Store amount fields only as integer minor units in metadata.
- Include currency.
- Record state transitions with before/after.
- Record idempotency duplicate blocking.
- Record provider status mapping decisions.
- Record reversal and dispute decisions.

### Admin Audit Requirements

- Admin audit endpoints require explicit role authorization.
- Admin reads of audit records should themselves be auditable if policy requires.
- Configuration changes require `admin.config_changed`.

### Provider Audit Requirements

- Store provider payload hashes and safe metadata, not raw sensitive payloads by default.
- Preserve provider reference separately from internal IDs.
- Webhook/polling events must include correlation and processing result.

### Example JSON

```json
{
  "event_id": "evt_123",
  "event_type": "payment.submitted_to_provider",
  "actor_type": "USER",
  "actor_id": "42",
  "entity_type": "PaymentIntent",
  "entity_id": "pi_123",
  "before": {"status": "confirmed_by_user"},
  "after": {"status": "processing"},
  "metadata": {
    "amount_minor": 120000,
    "fee_minor": 1200,
    "total_minor": 121200,
    "currency": "MXN",
    "provider_name": "prontipagos"
  },
  "request_id": "req_123",
  "correlation_id": "corr_123",
  "ip_address": null,
  "user_agent": null,
  "timestamp": "2026-05-20T00:00:00Z",
  "result": "success"
}
```

## Phase 5B Audit Implementation

Implemented audit persistence:

- Table/model: `audit_events`.
- Writer: `backend/app/modules/audit/services.py`.
- Redaction: sensitive metadata keys such as `otp`, `otp_dev`, `token`, `access_token`, `password`, `secret`, `jwt`, `pan`, `cvv`, and `card_number` are stored as `[REDACTED]`.

Implemented event types:

- `auth.otp_requested`
- `auth.otp_verified`
- `auth.login_success`
- `auth.login_failed`
- `user_service.created`
- `user_service.validation_failed`
- `payment.intent_created`
- `payment.confirmed_by_user`
- `payment.mock_submitted`
- `payment.succeeded`
- `payment.duplicate_blocked`
- `receipt.generated`

Known audit gaps:

- No provider webhooks exist yet.
- No admin/support actions exist yet.
- Logout/session restore audit coverage remains incomplete.
- DB-level immutability enforcement for audit events is pending.
- Audit read endpoints for `AUDITOR`/`ADMIN` roles are pending.

## Phase 5C Fee Transparency Audit Events

Implemented:

- `payment.fee_disclosed`: emitted when the mock payment flow records the visible amount/fee/total.
- `payment.confirmed_with_total`: emitted when the mock payment is confirmed with the total breakdown.

Contract documented but not implemented as a separate backend event:

- `payment.confirmation_viewed`: future event for a backend-backed quote/confirmation view. Current mobile confirmation is local mock state and has no backend quote endpoint.

Required metadata:

- `amount_minor`
- `fee_minor`
- `total_minor`
- `currency`
- `mock`

## Payment Method Audit Events

Future required events:

- `payment_method.add_started`
- `payment_method.add_completed`
- `payment_method.add_failed`
- `payment_method.selected`
- `payment_method.changed`
- `payment_method.removed`
- `payment_method.validation_failed`
- `payment_method.mock_selected`

Payment method audit metadata must exclude PAN, CVV, raw provider payloads, and secrets.
# Payment Method Events

The following events are required for future backend-backed payment methods:

- `payment_method.add_started`
- `payment_method.add_completed`
- `payment_method.add_failed`
- `payment_method.selected`
- `payment_method.changed`
- `payment_method.removed`
- `payment_method.mock_selected`

Phase 5E uses local mobile mock state only, so these events are documented as future/pending and do not count as durable audit logs yet.

## Phase 5F Payment Recovery Audit Events

Future recovery implementation must emit:

- `payment.created`
- `payment.validation_failed`
- `payment.processing_started`
- `payment.pending_confirmation`
- `payment.provider_timeout`
- `payment.paid`
- `payment.failed`
- `payment.duplicate_detected`
- `payment.recovery_required`
- `payment.support_required`
- `payment.retry_requested`
- `payment.retry_blocked`
- `payment.cancelled`
- `payment.reversal_requested`
- `receipt.generation_failed`
- `receipt.regeneration_requested`
- `recovery.case_created`
- `recovery.case_assigned`
- `recovery.case_resolved`

Required fields:

- actor
- entity
- before
- after
- severity
- requires_review
- request_id
- correlation_id
- safe metadata only

Recovery audit events must never store raw provider payloads, full card data, CVV, OTP codes, access tokens, or secrets.

Phase 5F mobile mock implementation status:

- `payment.failed`: future durable backend event.
- `payment.pending`: future durable backend event.
- `payment.timeout`: future durable backend event.
- `payment.retry_requested`: future durable backend event.
- `payment.duplicate_blocked`: future durable backend event.
- `payment.support_requested`: future durable backend event.
- `receipt.unavailable`: future durable backend event.

The current mobile scenario selector and support placeholder do not count as persistent audit events.

## Phase 6A Account and Balance Events

Future events:
- `account.created`
- `account.status_changed`
- `account.restricted`
- `account.suspended`
- `account.closed`
- `balance.viewed`
- `balance.snapshot_created`
- `movement.created`
- `demo_balance.credit_added`
- `demo_balance.debit_added`
- `hold.created`
- `hold.released`
- `hold.expired`
- `adjustment.created`

Required fields when applicable:
- `account_id`
- `user_id`
- `amount_minor`
- `currency`
- `before` and `after` for status changes
- `request_id`
- `correlation_id`
- `actor_id`
- `timestamp`
## Phase 7 History And Receipt Events

The following events are required for the future backend history/receipt projection:

| Event | Current status | Notes |
|---|---|---|
| `receipt.viewed` | future | Receipt list or summary viewed by user. |
| `receipt.detail_viewed` | future | Detail view with safe identifiers only. |
| `history.viewed` | future | History surface opened. |
| `history.filtered` | future | Status filter used. |
| `receipt.unavailable` | future | Receipt absent after an attempt or generation failure. |
| `receipt.generated` | implemented for backend mock success | Existing receipt generation audit path. |
| `receipt.download_requested` | future | Real download proof flow not implemented. |
| `receipt.share_requested` | future | Real share flow not implemented. |

All events must preserve actor, entity, request/correlation identifiers, safe receipt/payment references, and redacted metadata.

## Card Payment Method Audit Events

Current roadmap payment-method audit events are card-focused:

- `payment_method.card_add_started`
- `payment_method.card_tokenized`
- `payment_method.card_add_failed`
- `payment_method.card_selected`
- `payment_method.card_changed`
- `payment_method.card_removed`
- `payment_method.card_declined`
- `payment_method.card_auth_failed`
- `payment_method.card_expired`

Events must use safe card references only. Do not emit PAN or CVV in audit metadata.

## Card Processor Sandbox Audit Events

Status: future/proposed for Phase 8A unless a later implementation report marks an event implemented.

- `card.tokenization_started`
- `card.tokenization_succeeded`
- `card.tokenization_failed`
- `card.payment_method_added`
- `card.payment_method_selected`
- `card.charge_created`
- `card.charge_submitted`
- `card.charge_authorized`
- `card.charge_captured`
- `card.charge_declined`
- `card.charge_failed`
- `card.charge_timeout`
- `card.charge_duplicate_blocked`
- `card.charge_refund_requested_future`
- `card.webhook_received_future`
- `card.processor_error`

These events must carry safe processor references, request/correlation IDs, idempotency context where relevant, and redacted metadata only.

## Prontipagos Sandbox Audit Events

Status: future/proposed for Phase 8B.

- `prontipagos.catalog_sync_started`
- `prontipagos.catalog_sync_completed`
- `prontipagos.reference_validation_requested`
- `prontipagos.reference_validation_succeeded`
- `prontipagos.reference_validation_failed`
- `prontipagos.amount_lookup_requested`
- `prontipagos.amount_lookup_succeeded`
- `prontipagos.amount_lookup_failed`
- `prontipagos.payment_execution_requested`
- `prontipagos.payment_execution_submitted`
- `prontipagos.payment_execution_succeeded`
- `prontipagos.payment_execution_pending`
- `prontipagos.payment_execution_failed`
- `prontipagos.payment_execution_timeout`
- `prontipagos.duplicate_blocked`
- `prontipagos.status_checked`
- `prontipagos.reconciliation_started`
- `prontipagos.reconciliation_completed`
- `prontipagos.reconciliation_mismatch`

Metadata must stay redacted and retain safe provider references, payload hashes, request IDs, correlation IDs, and idempotency context.

## Phase 8C Sandbox Audit Status

Implemented for the contractual mock orchestration:

- `card.charge_submitted`
- `card.charge_authorized`
- `card.charge_declined`
- `card.charge_timeout`
- `card.charge_duplicate_blocked`
- `card.charge_failed`
- `prontipagos.payment_execution_submitted`
- `prontipagos.payment_execution_succeeded`
- `prontipagos.payment_execution_pending`
- `prontipagos.payment_execution_failed`
- `prontipagos.payment_execution_timeout`
- `prontipagos.duplicate_blocked`
- `payment.manual_review_required`
- existing `receipt.generated`

Tokenization, webhook, reconciliation, admin/manual-review UI events, and real-provider event catalogs remain pending.

## Phase 9 Receipt Proof And Notification Audit

Implemented baseline events:

- `receipt.generated`
- `receipt.pending`
- `receipt.unavailable`
- `receipt.viewed`
- `proof.viewed`
- `notification.created`
- `notification.read`

Documented future receipt/notification events:

- `proof.shared_requested`
- receipt artifact download events when a real download path exists
- `notification.delivery_failed_future` for future push/email providers

Metadata must keep status and support-safe identifiers only. Sharing from the current mobile local mock proof does not yet create a durable backend share event.

## CRM/Admin Audit Events

Future admin events:

- `admin.login`
- `admin.logout`
- `admin.user_viewed`
- `admin.payment_viewed`
- `admin.receipt_viewed`
- `admin.ledger_viewed`
- `admin.audit_log_viewed`
- `admin.ticket_created`
- `admin.ticket_updated`
- `admin.manual_review_opened`
- `admin.manual_review_assigned`
- `admin.manual_review_resolved`
- `admin.reconciliation_viewed`
- `admin.config_viewed`
- `admin.config_changed`
- `admin.role_changed`
- `admin.export_requested`

Required fields for future CRM admin events:

- `admin_user_id`
- `role`
- `permission`
- `entity_type`
- `entity_id`
- `action`
- `result`
- `before` and `after` when applicable
- `request_id`
- `correlation_id` when the entity belongs to a payment flow
- `ip_address`
- `user_agent`
- `created_at`

Admin audit metadata must stay redacted. A privileged read is still an action worth auditing when it exposes user, payment, receipt, ledger, reconciliation, audit, config, or export context.
## CRM/Admin Backend Audit Events

Phase 10B uses the existing audit writer for implemented privileged CRM routes.

| Event | Current trigger |
|---|---|
| `admin.dashboard_viewed` | Dashboard summary read |
| `admin.users_list_viewed` | Redacted admin user search/list |
| `admin.user_viewed` | User detail read |
| `admin.payments_list_viewed` | Redacted payment search/list |
| `admin.payment_viewed` | Payment detail read |
| `admin.receipts_list_viewed` | Redacted receipt search/list |
| `admin.receipt_viewed` | Receipt detail read |
| `admin.audit_events_viewed` | Audit-event list read |
| `admin.reconciliation_viewed` | Card or Prontipagos placeholder read |
| `admin.ticket_created`, `admin.ticket_updated`, `admin.ticket_note_added` | Support ticket writes |
| `admin.manual_review_created`, `admin.manual_review_updated` | Manual-review writes |

Admin event metadata keeps `role` and `permission` plus safe route context. Existing redaction removes sensitive token, PAN, CVV, password, secret, and raw-provider key families before metadata persists. Future ledger, catalog, exports, role/configuration updates, and hardened admin sessions still require their dedicated admin events.
## Phase 10D - CRM Operational Audit Events

Implemented admin workflow events:

- `admin.support_ticket_created`
- `admin.support_ticket_updated`
- `admin.support_ticket_closed`
- `admin.support_ticket_note_added`
- `admin.manual_review_created`
- `admin.manual_review_assigned`
- `admin.manual_review_status_changed`
- `admin.manual_review_note_added`
- `admin.manual_review_resolved`
- `admin.manual_review_closed`
- `admin.reconciliation_card_viewed`
- `admin.reconciliation_prontipagos_viewed`
- `admin.search_executed`

Manual review also stores an internal case event log with:

- `case_created`
- `case_assigned`
- `status_changed`
- `note_added`
- `escalated`
- `resolved`
- `closed`

Required audit fields remain:

- `actor_type`
- `actor_id`
- `role`
- `permission`
- `entity_type`
- `entity_id`
- `action/event_type`
- `result`
- `request_id`
- `correlation_id` when available
- `ip_address`
- `user_agent`
- `created_at`

Audit metadata is redacted. Audit logs must not contain PAN, CVV, card tokens, secrets, or raw provider payloads.

## Phase 10D.1 - WhatsApp Receipt Channel Audit Events

Future WhatsApp audit events:

- `notification.preference_viewed`
- `notification.preference_updated`
- `whatsapp.consent_granted`
- `whatsapp.consent_revoked`
- `whatsapp.receipt_send_requested`
- `whatsapp.receipt_send_succeeded`
- `whatsapp.receipt_send_failed`
- `whatsapp.delivery_status_updated`
- `whatsapp.duplicate_blocked`
- `whatsapp.webhook_received_future`

Required safe metadata:

- `user_id`
- `channel`
- `notification_type`
- `template_name`
- `entity_type`
- `entity_id`
- `recipient_hash`
- `idempotency_key`
- `provider_name` when selected
- `provider_message_id` when safe
- `error_code` when safe
- `error_message_safe` only
- `request_id`
- `correlation_id` when related to a payment/receipt flow

Forbidden metadata:

- full phone number
- PAN
- CVV
- card tokens
- provider secrets
- raw provider payloads
- raw provider errors

Phase 10D.1 documents these events only; it does not emit runtime WhatsApp events.
## Coverage-Aware Service Catalog Audit Events

Future events:

| Event | When |
|---|---|
| `service_catalog.viewed` | Catalog is viewed by admin or future catalog API audit scope. |
| `service_catalog.item_enabled` | A service is enabled for visibility or payment. |
| `service_catalog.item_disabled` | A service is disabled or removed from payment eligibility. |
| `service_catalog.coverage_changed` | State/service coverage status changes. |
| `service_catalog.sync_started` | Provider catalog sync starts. |
| `service_catalog.sync_completed` | Provider catalog sync completes. |
| `service_catalog.sync_failed` | Provider catalog sync fails. |
| `service_catalog.provider_mapping_changed` | Provider code/capability mapping changes. |
| `service_catalog.visibility_changed` | Landing/mobile/admin visibility changes. |
| `coverage_map.viewed` | Public coverage map is viewed if analytics/audit scope is later approved. |
| `coverage_map.state_selected` | User selects a state on coverage map if analytics/audit scope is later approved. |

Required fields for admin catalog changes:

- `actor_id`
- `role`
- `permission`
- `entity_type`
- `entity_id`
- `before_status`
- `after_status`
- `before_visibility`
- `after_visibility`
- `reason`
- `request_id`
- `correlation_id`
- `created_at`

### Phase 10F Implementation Status

Implemented/partially emitted:

- `coverage_map.viewed`
- `coverage_map.state_selected`
- `service_catalog.viewed`
- `service_catalog.coverage_changed`
- `service_catalog.visibility_changed`
- `service_catalog.item_disabled`
- `service_catalog.seeded`

Pending broader workflow:

- `service_catalog.item_enabled`
- `service_catalog.provider_mapping_changed`
- `service_catalog.sync_started`
- `service_catalog.sync_completed`
- `service_catalog.sync_failed`
## Phase 10G WhatsApp Receipt Audit Events

Implemented event types:

- `whatsapp.consent_granted`
- `whatsapp.consent_revoked`
- `whatsapp.receipt_send_requested`
- `whatsapp.receipt_send_skipped_no_consent`
- `whatsapp.receipt_send_skipped_invalid_recipient`
- `whatsapp.receipt_send_succeeded`
- `whatsapp.receipt_send_failed`
- `whatsapp.duplicate_blocked`
- `notification.delivery_created`
- `notification.delivery_status_updated`

Audit metadata must use masked recipient values only. Payment, receipt, proof, and ledger events remain the source of truth for financial status.

## Phase 11 Fraud, Dispute, And Chargeback Audit Events

Implemented Phase 11 internal events:

- `fraud.signal.created`
- `fraud.signal.reviewed`
- `fraud.signal.dismissed`
- `fraud.signal.escalated`
- `dispute.created`
- `dispute.status_changed`
- `dispute.evidence_added`
- `dispute.closed`
- `chargeback.created`
- `chargeback.status_changed`
- `chargeback.evidence_added`
- `chargeback.closed`

Documented/future events:

- `manual_review.created`
- `manual_review.assigned`
- `manual_review.status_changed`
- `manual_review.note_added`
- `reconciliation.mismatch_detected`
- `reconciliation.mismatch_reviewed`
- `admin.override_requested`
- `admin.override_approved`
- `admin.override_rejected`

Required fields remain actor, role, permission, entity type, entity ID, result, request ID, timestamp, and safe before/after metadata when applicable. Fraud signal and dispute metadata must not store PAN, CVV, secrets, raw provider payloads, OTPs, or unnecessary PII.

## Phase 10X.1 Chatbot Audit Events

Implemented chatbot events:

- `chatbot.faq.created`
- `chatbot.faq.updated`
- `chatbot.faq.disabled`
- `chatbot.faq.enabled`
- `chatbot.intent.created`
- `chatbot.intent.updated`
- `chatbot.intent.disabled`
- `chatbot.intent.enabled`
- `chatbot.knowledge.created`
- `chatbot.knowledge.updated`
- `chatbot.knowledge.disabled`
- `chatbot.knowledge.enabled`
- `chatbot.settings.updated`
- `chatbot.conversation.created`
- `chatbot.message.received`
- `chatbot.fallback.created`

Admin events include actor id, role, permission, entity type, entity id, result, and safe before/after metadata when applicable. Public chatbot events use `actor_type=SYSTEM` and store only masked/safe metadata. Chatbot audit metadata must not include raw user messages, PAN, CVV, OTPs, emails, full phone numbers, secrets, API keys, access tokens, raw provider payloads, or customer-specific payment evidence.

## Phase 10X.2 Chat Operations Audit Events

Implemented or recorded in the conversation event timeline:

- `conversation.created`
- `conversation.classified`
- `conversation.escalated`
- `ticket.created`
- `ticket.assigned`
- `ticket.reassigned`
- `ticket.severity_changed`
- `ticket.status_changed`
- `ticket.first_response_marked`
- `ticket.resolved`
- `ticket.closed`
- `ticket.reopened`
- `internal_note.created`
- `classifier.suggestion_created`
- `human_override.created`

Global admin audit events are emitted for privileged API actions through the existing audit writer. Conversation-local event records preserve before/after state, actor, note, and timestamp for operational timeline review. Metadata must remain safe and redacted.
