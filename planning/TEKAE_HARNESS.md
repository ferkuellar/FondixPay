# Tekae Integration Harness

**Status:** DISCOVERY — No implementation. Blocked pending official Tekae documentation.
**Last updated:** 2026-06-02

---

## What is the Tekae Harness?

The Tekae Integration Harness is the set of planning, documentation, and boundary definitions that must exist before any Tekae integration code is written. It is not a code harness — it is an architectural boundary document.

Its purpose is to:
1. Define FONDIXPAY's role in the Tekae integration (what it owns vs. what Tekae owns).
2. Capture all unknowns that block implementation.
3. Establish the discovery sprint scope.
4. Ensure the team does not build beyond its intended scope.

---

## FONDIXPAY's Role (Confirmed)

| Layer | FONDIXPAY Owns |
|---|---|
| Mobile UX | Payment flow screens, confirmation UI, error display |
| Brand | All user-facing messaging, receipt formatting |
| Support | First-line user support, escalation to Tekae |
| CRM / Operations | Transaction visibility, manual review, dispute tracking |
| Traceability | Audit log of Tekae transaction references (IDs only, no card data) |

---

## Tekae's Role (Assumed — Unconfirmed)

| Layer | Tekae Owns |
|---|---|
| Transactional processing | Card authorization, capture, settlement |
| PCI-sensitive data handling | Card data, tokenization |
| Payment result | Success / failure outcome |
| Dispute / chargeback handling | Chargeback processing, fraud flagging |

> All items in the Tekae column are assumptions until official documentation confirms them.

---

## What FONDIXPAY Must NOT Build

- Payment processor logic
- Internal wallet or balance ledger tied to real money
- Card data storage
- Bill payment aggregator
- Complex reconciliation engine

These are out of scope for MVP unless explicitly approved by product leadership.

---

## Integration Boundary (Assumed)

```
+-------------------+          +------------------+
|   FONDIXPAY       |          |   Tekae Business |
|   Mobile App      | -------> |   (Transactional)|
|   (UX / Brand)    |          |   Processing     |
+-------------------+          +------------------+
         |
         | (Tekae transaction reference only)
         v
+-------------------+
|  FONDIXPAY        |
|  Backend / CRM    |
|  (Traceability)   |
+-------------------+
```

> The exact integration boundary (mobile-direct vs. backend-proxied) is unknown. See `planning/TEKAE_OPEN_QUESTIONS.md` Q-001.

---

## Discovery Sprint

Sprint `008b-tekae-integration-discovery` covers the discovery work required to confirm all unknowns before implementation is approved.

See `planning/sprints/008b-tekae-integration-discovery/` for scope, requirements, and acceptance criteria.

---

## Harness Documents

| Document | Purpose | Status |
|---|---|---|
| `docs/integrations/TEKAE.md` | Provider overview | Done |
| `docs/integrations/TEKAE_API_CONTRACT.md` | API contract | Placeholder |
| `docs/integrations/TEKAE_SECURITY.md` | Security requirements | Draft |
| `docs/integrations/TEKAE_RUNBOOK.md` | Operational runbook | Placeholder |
| `docs/integrations/TEKAE_SUPPORT.md` | Support workflows | Placeholder |
| `planning/TEKAE_DECISIONS.md` | Decision log | Active |
| `planning/TEKAE_OPEN_QUESTIONS.md` | Open questions | Active |
| `planning/TEKAE_RISKS.md` | Risk register | Active |
