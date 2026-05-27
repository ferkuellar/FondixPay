# Phase 10D.1 - WhatsApp Receipt Channel Alignment Requirements

## Goal

Document and align WhatsApp as a future non-blocking post-payment receipt channel for FondixPay.

## Requirements

- WhatsApp is future-only and documentation-only in this phase.
- Future MVP is limited to `fondix_pago_exitoso`.
- Consent must be explicit and granular.
- No toggle may be pre-enabled.
- Delivery logs must be append-only.
- Delivery must be idempotent.
- Full phone numbers must not be logged.
- Payloads must exclude PAN, CVV, tokens, secrets, raw provider payloads, and raw provider errors.
- WhatsApp failure must never block payment or internal receipt/proof generation.
- Internal receipt/proof/audit/ledger remain the source of truth.

## Non-Goals

- No WhatsApp provider integration.
- No real message sends.
- No credentials or secrets.
- No payment flow changes.
- No receipt runtime changes.
- No CRM workflow changes.
- No WhatsApp OTP implementation.
