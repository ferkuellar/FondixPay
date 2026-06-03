# Support Runbook

**Status:** Pre-integration version. Tekae-specific steps are placeholders pending `docs/integrations/TEKAE_SUPPORT.md`.
**Last updated:** 2026-06-02

---

## Scope

This runbook covers the mobile-user-facing support path — what support agents do when a FONDIXPAY user reports a payment problem. It complements `docs/SUPPORT_WORKFLOWS.md`, which covers the CRM/admin panel workflows.

---

## Guiding Principles

1. **Never promise a payment outcome** until the provider (Tekae) confirms it.
2. **Never show internal error codes or provider names** to users.
3. **Never manually mark a payment as succeeded** without provider confirmation.
4. **Always capture a reference ID** from the user before closing a case.
5. **Do not guess payment status** — unknown means unknown.

---

## What Users Will See (Current State — Tekae Disabled)

While `TEKAE_ENABLED=false`, users who attempt to pay will see:

> **"Servicio en preparación. Muy pronto podrás pagar desde FONDIXPAY."**

This is expected behavior. Support agents should communicate:

> "Nuestros servicios de pago están en configuración final. Te avisaremos cuando estén disponibles. Gracias por tu paciencia."

Do not provide timelines or commit to specific dates.

---

## Payment Failure Support Path

### Step 1 — Receive Report

User reports: "Mi pago no funcionó" / "No me dejó pagar" / "Se quedó en proceso"

Ask the user for:
- **Reference interna** (shown on the support screen in-app)
- **Request ID** (if visible)
- **Correlation ID** (if visible)
- **Service name** (Luz, Agua, Internet, etc.)
- **Approximate time** of the attempt

### Step 2 — Classify

| User Report | Classification | Action |
|---|---|---|
| "Decía 'Servicio en preparación'" | Tekae disabled — expected | Communicate service unavailability message |
| "Pago fallido" | Payment failure | Check CRM for recovery context |
| "Se quedó en 'procesando'" | Payment pending | Do not mark resolved; escalate to ops |
| "Me cobró pero no tengo comprobante" | Potential duplicate or lost receipt | URGENT — escalate immediately |
| "No puedo iniciar sesión" | Auth issue | Guide to OTP flow |

### Step 3 — Look Up in CRM

Using the Reference interna or payment ID:
1. Search in CRM admin panel under Payments.
2. Do not interpret provider status codes — use only FONDIXPAY status labels.
3. If payment shows `pending` in FONDIXPAY — do not confirm to user. Escalate to ops.
4. If payment shows `failed` in FONDIXPAY — confirm the payment did not process. Advise user to retry.
5. If payment shows `succeeded` but user has no receipt — check receipt module, generate if missing.

### Step 4 — Escalation Triggers

Escalate to engineering/ops immediately if:
- Payment status is `pending` for more than 30 minutes.
- User reports a charge on their card but FONDIXPAY shows `failed`.
- Multiple users report the same provider failure pattern simultaneously.
- CRM shows `succeeded` but provider (Tekae) cannot confirm.

---

## Pending Payment Guidance

**Never tell a user their payment succeeded until you have confirmed it.**

If a payment is in `pending` state:
1. Tell the user: "Tu pago está siendo procesado. Recibirás una confirmación pronto."
2. Record the reference IDs.
3. Set a follow-up reminder for 30 minutes.
4. If still pending after 30 minutes, escalate to ops who will check with Tekae directly.

---

## What Support Cannot Do (Current State)

| Action | Reason |
|---|---|
| Confirm a payment succeeded | Only Tekae can confirm |
| Initiate a refund | Refund API unknown (Q-008) |
| See Tekae transaction details | Not integrated yet |
| Access card data | FONDIXPAY does not store card data |
| Manually trigger a payment | Not available |

These limitations will be updated once the Tekae integration is live and `docs/integrations/TEKAE_SUPPORT.md` is populated.

---

## Tekae Escalation Path (Placeholder)

> **Not yet available.** Tekae support contacts, merchant portal URL, and escalation SLAs are unknown pending official documentation.
>
> See `docs/integrations/TEKAE_SUPPORT.md` — this file must be populated before Tekae goes live.

---

## Internal Notes Policy

Support notes must not contain:
- Phone numbers (beyond masked format).
- OTP codes.
- Raw card data, PAN, or CVV (FONDIXPAY does not have these, but do not request them).
- Raw Tekae error messages or status codes.
- Provider secrets or API keys.
- Stack traces.

Notes may contain:
- Payment reference IDs (internal).
- Tekae reference IDs (when available).
- User-reported service name and amount.
- Timestamped status updates.
- Escalation destination and time.

---

## Severity Classification

| Severity | Condition | Response Time |
|---|---|---|
| SEV-1 | User charged but no payment record in FONDIXPAY | Immediate — page engineering |
| SEV-1 | Multiple users reporting simultaneous payment failures | Immediate — page engineering |
| SEV-2 | Payment stuck in pending > 30 minutes | Within 15 minutes — ops review |
| SEV-2 | Receipt missing for confirmed payment | Within 15 minutes |
| SEV-3 | Single payment failure, user retry worked | Within 2 hours |
| SEV-3 | "Servicio en preparación" complaint | Within 4 hours — standard comms |
| SEV-4 | General questions about app features | Within 24 hours |

---

## Related Documents

- `docs/SUPPORT_WORKFLOWS.md` — CRM admin panel support workflows
- `docs/OBSERVABILITY.md` — event taxonomy and error categories
- `docs/integrations/TEKAE_SUPPORT.md` — Tekae support contacts (placeholder)
- `docs/integrations/TEKAE_RUNBOOK.md` — Tekae operational runbook (placeholder)
- `mobile/src/screens/support/SupportPlaceholderScreen.tsx` — in-app support screen
