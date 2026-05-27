# WhatsApp Receipt Channel

## Executive Summary

WhatsApp is approved as a future non-blocking post-payment notification channel for FondixPay receipts. This document defines the architecture, consent, privacy, audit, operations, and production gates for that future channel.

This phase does not implement runtime delivery, does not select or integrate a provider, does not send real WhatsApp messages, and does not change payment or receipt generation.

## Scope

- Document WhatsApp as a future receipt delivery channel.
- Define explicit and granular consent.
- Define proposed notification preferences and append-only delivery logs.
- Define safe payload rules for receipt messages.
- Define idempotency and failure behavior.
- Define provider abstraction and future operations gates.

## Non-Goals

- No Twilio, Meta WhatsApp Cloud API, Zenvia, Gupshup, or other provider integration.
- No provider credentials, secrets, webhooks, or runtime delivery.
- No automatic notifications.
- No payment flow changes.
- No receipt generation changes.
- No WhatsApp OTP implementation.
- No reminder, failed-payment, or monthly-summary runtime.

## Approved Sequencing

1. Current phase: documentation and architectural alignment only.
2. Future MVP: `fondix_pago_exitoso` only, for successful payment receipt delivery after internal proof exists.
3. Future expansion: `fondix_recordatorio_vencimiento`, `fondix_pago_fallido`, and `fondix_resumen_mensual`.
4. Future separate auth phase: `fondix_otp_login`; it is not part of the receipt channel MVP.

## Approved Use

WhatsApp is approved as a future post-payment channel for receipts. In the future MVP, only `fondix_pago_exitoso` is allowed.

WhatsApp delivery is not the source of truth. The internal ledger, receipt, audit log, proof-of-payment endpoint, and CRM evidence remain authoritative.

## Explicit Consent

The user must explicitly opt in before receiving WhatsApp messages. No toggle may be pre-enabled.

Consent must be granular:

- `payment_receipts_whatsapp`
- `payment_failed_whatsapp` future
- `due_reminders_whatsapp` future
- `monthly_summary_whatsapp` future
- `otp_whatsapp` future, separate from receipt delivery

Consent rules:

- Consent must record source, timestamp, notification type, and channel.
- Revocation must be available and auditable.
- Revocation must stop future sends for that channel/type.
- Consent cannot be inferred from phone login.

## Notification Preferences

Future notification preferences should model channel and notification type separately.

Recommended concepts:

- channel: `whatsapp`
- notification_type: `payment_receipt`, `payment_failed`, `due_reminder`, `monthly_summary`, `otp`
- enabled: boolean
- consented_at / revoked_at
- source: onboarding, settings, CRM-assisted future flow

## Safe Receipt Payload

Allowed fields:

- service name
- total amount
- FondixPay fee
- currency
- payment/receipt date
- payment/proof status
- support-safe reference
- future app deep link or receipt link

Forbidden fields:

- PAN
- CVV
- card tokens
- secrets
- raw provider payloads
- excessive personal data
- raw provider or technical errors
- full phone number in logs

Example future message content must be short and status-accurate. It must not claim fiscal validity, CFDI, legal proof, or production provider confirmation unless those controls exist.

## Idempotency Strategy

Suggested delivery idempotency key:

```text
receipt_id + channel + template_name + recipient_hash
```

Rules:

- Duplicate sends with the same idempotency key must be blocked or return the existing delivery record.
- Retries must preserve the original delivery record and append new status attempts/events when appropriate.
- A delivery retry must never create a second internal receipt or modify payment state.

## Provider Abstraction

The provider is not selected in this phase.

Future interface:

- `send_template_message`
- `check_delivery_status`
- `handle_webhook_future`

Provider adapters must:

- keep secrets outside the repo,
- verify future webhooks,
- sanitize errors,
- map provider delivery statuses into internal statuses,
- avoid raw payload persistence unless a later privacy/security decision approves a redacted retention model.

## Failure Behavior

If WhatsApp delivery fails:

- payment state does not change,
- internal receipt/proof does not change,
- the user is not blocked,
- payment success is not reversed,
- a delivery failure is logged safely,
- a retry may be scheduled under idempotency rules,
- user-facing errors remain generic and safe.

WhatsApp failure must never block payment or receipt generation.

## Audit Events

Future events:

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

Audit metadata must store recipient hash and safe entity references, not full phone numbers or provider payloads.

## Data Privacy

- Store recipient hash, not full phone, in delivery logs.
- Mask phone numbers in CRM/support views.
- Keep provider message IDs as safe references only.
- Do not expose provider raw errors to users.
- Do not include sensitive payment credentials or raw provider payloads in templates, logs, audit events, or CRM notes.

## Operations / Runbooks

Operations must support:

- WhatsApp delivery failed.
- Duplicate delivery suspected.
- User revokes consent.
- Provider outage.
- Template rejected.
- User says receipt was not received.
- CRM support view future.

Support must use the internal receipt/proof as source of truth, then inspect delivery status only as notification evidence.

## Production Gates

Before runtime implementation:

- Provider selected and security-reviewed.
- Secrets stored outside repo.
- Explicit consent UI implemented with no pre-enabled toggles.
- NotificationPreference and NotificationDelivery models implemented.
- Delivery idempotency tested.
- Audit events implemented.
- Phone masking/hash verified.
- Template approval completed.
- Webhook verification designed and tested if webhooks are enabled.
- CRM delivery visibility designed with RBAC.
- WhatsApp failure proven non-blocking.

Commercial production remains blocked until broader payment, audit, fraud, reconciliation, security, operations, and provider gates are complete.
## Phase 10G Runtime Implementation

Phase 10G implements only the WhatsApp post-payment receipt MVP template `fondix_pago_exitoso`.

Runtime scope:

- `NotificationPreference` stores explicit consent for `channel=whatsapp` and `notification_type=payment_receipt`.
- Default consent is disabled.
- `NotificationDelivery` stores append-only delivery evidence with masked recipient and recipient hash.
- The provider abstraction is implemented with `WhatsAppMockProvider` only.
- The template payload mirrors the approved visual reference: verified FONDIX PAY header, `Pago realizado`, `Ya quedó! 🙌`, service, amount, folio, date, final app-storage copy, and CTA `Ver en la app`.
- The payment service can trigger the send after success only when `WHATSAPP_ENABLE_RECEIPT_MVP=true`; failures are non-blocking.

Non-goals preserved:

- No OTP, reminders, failed-payment WhatsApp, monthly summary, campaigns, or production provider integration.
- No PAN, CVV, card token, full phone, raw provider payload, secrets, or technical raw errors in delivery responses.
- WhatsApp failure never changes payment, receipt, proof, ledger, or internal audit truth.

Production status: blocked until a real WhatsApp Business provider, approved Meta template, webhook security, operational monitoring, and legal/privacy review are completed.
