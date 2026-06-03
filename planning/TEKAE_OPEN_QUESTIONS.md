# Tekae Integration — Open Questions

**Status:** ACTIVE — All items below block implementation.
**Last updated:** 2026-06-02

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
**What is the integration architecture?**

Does the mobile app call Tekae directly (SDK, WebView, or redirect), or does it call a FONDIXPAY backend endpoint that proxies to Tekae?

- Affects: PCI scope, mobile code architecture, backend API design, credential storage model.
- Source required: Tekae developer documentation or Tekae integration team confirmation.

---

### Q-002 — Authentication Method
**How does FONDIXPAY authenticate to Tekae APIs?**

Is it API key, OAuth 2.0 (client credentials), mutual TLS, or another mechanism?

- Affects: credential management, secret rotation policy, backend security design.

---

### Q-003 — Sandbox Environment
**Does Tekae provide a sandbox or test environment?**

If yes: Is it always-on, self-service, or requires Tekae setup? What are the test credential policies?

- Affects: development workflow, sprint planning, QA strategy.

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
**Does Tekae provide a native mobile SDK (iOS / Android / React Native / Flutter)?**

If yes: What is the current SDK version and where is it hosted?

- Affects: mobile integration approach, dependency decisions.

---

## Resolved

> *(None yet. Items will move here as answers are confirmed.)*

---

## Question Ownership

| Question | Owner | Target Date |
|---|---|---|
| Q-001 through Q-014 | TBD — assign to integration lead after Tekae contact is established | TBD |
