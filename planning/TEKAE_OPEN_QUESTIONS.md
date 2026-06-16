# Tekae Integration — Open Questions

**Status:** PARTIALLY RESOLVED — Q-001, Q-002, Q-003, Q-013, Q-014 confirmed via live sandbox API test (2026-06-16). Q-004 to Q-012 remain open; they do not block Sprint 086 backend session endpoint but block full payment confirmation, reconciliation, and webhook handling.
**Last updated:** 2026-06-16 (Sprint 011 closure — sandbox API contract confirmed end-to-end)

---

## How to Use This Document

Every item here is a blocker. Implementation cannot proceed until each question has a confirmed answer sourced from official Tekae documentation or direct Tekae communication.

When an answer is confirmed:
1. Move the item to the **Resolved** section.
2. Record the source (document name, section, or contact name + date).
3. Update `planning/TEKAE_DECISIONS.md` if the answer requires a new decision.

---

## Open (Blocking)

### Q-001 — Integration Method
**RESOLVED** — Confirmed via live sandbox API test 2026-06-16.

Integration model: Backend-brokered SSO responsivo.
- Mobile never calls Tekae directly.
- Backend calls `POST /tokens/cipherData` then `POST /tokens/generateTokenCiphered`.
- Backend constructs `{TEKAE_RESPONSIVE_BASE_URL}/user/{TEKAE_PORTAL_UID}/token/{accessToken}`.
- Mobile opens the URL via browser, WebView, or embed.
- No native mobile SDK required.
- Sandbox portal base: `https://responsive-dot-tekae-des-gtec.ue.r.appspot.com/responsive`
- Prod portal base: `https://tekae.com.mx/responsive`

- Source: Live sandbox API test — confirmed 2026-06-16.

---

### Q-002 — Authentication Method
**RESOLVED** — Confirmed via live sandbox API test 2026-06-16.

Authentication uses **two layers**:
1. HTTP header: `Authorization: Bearer {TEKAE_BEARER}` on every request.
2. Request body: `uid` (API identifier) + `password` (KMS-encrypted value provided by Tekae).

`TEKAE_BEARER`, `TEKAE_UID`, and `TEKAE_PASSWORD` are secrets — must be in secret store, never in repo.

- Source: Live sandbox API test — confirmed 2026-06-16.

---

### Q-003 — Sandbox Environment
**RESOLVED** — Sandbox credentials received and verified 2026-06-16.

- Sandbox API base URL: `https://endpointtekaetoken-917994269107.us-central1.run.app`
- Sandbox portal base URL: `https://responsive-dot-tekae-des-gtec.ue.r.appspot.com/responsive`
- Swagger documentation: accessible at `{sandbox_base}/swagger/login` (credentials required)
- Full token flow verified end-to-end in live sandbox test.
- Credentials received through approved secure channel; not committed to repo.

- Source: Tekae sandbox credentials delivered 2026-06-16; live API test confirmed.

---

### Q-004 — Supported Payment Methods
**What payment methods does Tekae support?**

Credit card, debit card, bank transfer, digital wallet, other? Which card networks?

- Affects: FONDIXPAY UX flow, payment method strategy.

---

### Q-005 — Transaction Status Model
**What are Tekae's possible transaction states and status codes?**

What states does a transaction go through (e.g., pending, authorized, captured, settled, failed, reversed)?

- Affects: payment state machine, FONDIXPAY audit log design, UI status display.

---

### Q-006 — Webhook / Callback Support
**Does Tekae support webhooks or push notifications for payment events?**

If yes: What events are supported? What is the payload structure? How are signatures verified?

- Affects: backend callback endpoint, real-time status updates, reconciliation design.

---

### Q-007 — PCI Scope
**Is Tekae PCI DSS certified? What is FONDIXPAY's resulting PCI scope?**

Does Tekae offer client-side tokenization that prevents card data from touching FONDIXPAY systems?

- Affects: compliance posture, architecture decisions, data handling policy.

---

### Q-008 — Refund / Reversal Capability
**Can FONDIXPAY initiate refunds via Tekae API?**

If yes: What is the API method? What constraints apply (time window, partial refund support)?

- Affects: support workflow, CRM admin panel capabilities.

---

### Q-009 — Settlement and Reconciliation
**How does Tekae provide settlement data to FONDIXPAY?**

Is it a report file (CSV, JSON), an API endpoint, or a portal? What is the settlement cycle?

- Affects: reconciliation design, CRM admin panel, finance operations.

---

### Q-010 — Error Handling
**What error codes does Tekae return on failure?**

What is the full error response schema? Which errors are retriable vs. terminal?

- Affects: payment recovery paths, user-facing error messaging, retry logic.

---

### Q-011 — Rate Limits
**Does Tekae enforce API rate limits?**

If yes: What are the limits and what is the response when exceeded?

- Affects: backend request handling, retry strategy.

---

### Q-012 — Idempotency
**Does Tekae support idempotency keys to prevent duplicate payments?**

If yes: What is the key header and scope (per-session, per-merchant)?

- Affects: payment orchestration safety, duplicate payment prevention.

---

### Q-013 — Onboarding and Commercial Agreement
**RESOLVED** — Sandbox credentials received 2026-06-16.

Sandbox credentials are available and verified. A production merchant account and its credentials are separate and not yet received.

- Source: Tekae sandbox credentials delivered 2026-06-16.

---

### Q-014 — Mobile SDK Availability
**RESOLVED** — Confirmed from Manual de integración Tekae Business v3.1.

Tekae does not require a native mobile SDK. Integration is URL-based (SSO responsivo).
Mobile opens the Tekae responsive URL via browser, WebView, or embed.
No React Native / iOS / Android SDK dependency is needed.

- Source: Manual de integración Tekae Business v3.1 — confirmed 2026-06-15.

---

## Resolved

### Q-001 — Integration Method (RESOLVED 2026-06-16)
Backend-brokered SSO responsivo. Two-step token flow: cipherData → generateTokenCiphered. Portal URL launched by mobile.
Source: Live sandbox API test 2026-06-16.

### Q-002 — Authentication Method (RESOLVED 2026-06-16)
Bearer token in Authorization header + uid + KMS-encrypted password in request body.
Source: Live sandbox API test 2026-06-16.

### Q-003 — Sandbox Environment (RESOLVED 2026-06-16)
Sandbox API and portal URLs confirmed. Swagger accessible. Full token flow verified.
Source: Tekae sandbox credentials delivered and tested 2026-06-16.

### Q-013 — Onboarding and Commercial Agreement (RESOLVED 2026-06-16)
Sandbox credentials received through secure channel. Production credentials separate/pending.
Source: Tekae sandbox credentials delivered 2026-06-16.

### Q-014 — Mobile SDK Availability (RESOLVED 2026-06-15)
No native SDK required. Integration is URL-based (SSO responsivo).
Source: Manual de integración Tekae Business v3.1.

---

## Question Ownership

| Question | Owner | Target Date |
|---|---|---|
| Q-001 through Q-014 | TBD — assign to integration lead after Tekae contact is established | TBD |
