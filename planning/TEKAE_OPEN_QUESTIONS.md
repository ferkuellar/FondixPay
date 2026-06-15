# Tekae Integration — Open Questions

**Status:** ACTIVE — Most items block implementation. Q-001, Q-014 confirmed from Manual v3.1; Q-003 partially confirmed.
**Last updated:** 2026-06-15 (updated with Sprint 011 readiness matrix findings)

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
**PARTIALLY RESOLVED** — Confirmed from Manual de integración Tekae Business v3.1 (reviewed Sprint 011).

Integration model: Backend-brokered SSO responsivo.
- Mobile never calls Tekae directly.
- Backend calls `POST /tokens/cipherData` then `POST /tokens/generateTokenCiphered`.
- Backend constructs `https://tekae.com.mx/responsive/user/{uid}/token/{accessToken}`.
- Mobile opens the URL in browser, WebView, or embed.
- No native mobile SDK required.

Still pending: base URL (sandbox + production), full token endpoint schema, auth header format, exact error codes.

- Source: Manual de integración Tekae Business v3.1 — confirmed 2026-06-15.

---

### Q-002 — Authentication Method
**How does FONDIXPAY authenticate to Tekae APIs?**

Is it API key, OAuth 2.0 (client credentials), mutual TLS, or another mechanism?

- Affects: credential management, secret rotation policy, backend security design.

---

### Q-003 — Sandbox Environment
**PARTIALLY RESOLVED** — Manual v3.1 confirms Tekae will provide a sandbox/development environment.

Confirmed: Tekae provides a development URL and test Swagger/credentials for authorized staff.
Still pending: actual sandbox base URL, test credentials (to be delivered through approved secure channel), Swagger document.

- Source: Manual de integración Tekae Business v3.1 — partially confirmed 2026-06-15.

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
**Has FONDIXPAY completed a commercial agreement with Tekae?**

Are sandbox credentials available for development? Is a production merchant account set up?

- Affects: ability to begin any technical integration work.

---

### Q-014 — Mobile SDK Availability
**RESOLVED** — Confirmed from Manual de integración Tekae Business v3.1.

Tekae does not require a native mobile SDK. Integration is URL-based (SSO responsivo).
Mobile opens the Tekae responsive URL via browser, WebView, or embed.
No React Native / iOS / Android SDK dependency is needed.

- Source: Manual de integración Tekae Business v3.1 — confirmed 2026-06-15.

---

## Resolved

### Q-014 — Mobile SDK Availability (RESOLVED 2026-06-15)
No native SDK required. Integration is URL-based (SSO responsivo).
Source: Manual de integración Tekae Business v3.1.

---

## Question Ownership

| Question | Owner | Target Date |
|---|---|---|
| Q-001 through Q-014 | TBD — assign to integration lead after Tekae contact is established | TBD |
