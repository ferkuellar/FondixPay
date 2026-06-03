# Tekae Security Requirements

**Status:** DRAFT — Requirements defined. Implementation blocked pending Tekae documentation.
**Last updated:** 2026-06-02

---

## Purpose

This document captures security requirements and open security questions for the FONDIXPAY–Tekae integration. It does not invent Tekae's security model — it defines what FONDIXPAY must confirm and enforce before any integration code is written.

---

## Hard Rules (Non-Negotiable)

The following rules apply regardless of what Tekae documentation says:

| Rule | Rationale |
|---|---|
| Do not store card data (PAN, CVV, expiry) in FONDIXPAY systems | PCI DSS scope elimination |
| Do not store Tekae production API keys or secrets in the mobile app binary | Secret exposure risk on reverse engineering |
| Do not log raw payment payloads containing card data | PCI DSS, data minimization |
| Do not transmit card data through FONDIXPAY backend if Tekae offers client-side tokenization | Reduces FONDIXPAY's PCI scope |
| All Tekae credentials must be stored in server-side secret management (e.g., AWS Secrets Manager) | Defense in depth |
| FONDIXPAY must validate Tekae webhook signatures before processing any callback | Prevent spoofed payment confirmations |

---

## Security Questions (Must Be Answered Before Implementation)

All items below are open until Tekae documentation confirms them. See also `planning/TEKAE_OPEN_QUESTIONS.md`.

### Authentication
- [ ] What authentication mechanism does Tekae use (API key, OAuth 2.0, mutual TLS, other)?
- [ ] How are credentials rotated?
- [ ] Is there a credential per environment (sandbox vs. production)?

### Transport
- [ ] Does Tekae enforce TLS 1.2+ on all endpoints?
- [ ] Does Tekae use certificate pinning on their side?
- [ ] Should FONDIXPAY enforce certificate pinning to Tekae's endpoints?

### PCI Scope
- [ ] Does Tekae offer a client-side tokenization SDK (mobile or web) that keeps card data out of FONDIXPAY systems?
- [ ] Is Tekae PCI DSS certified? At what level?
- [ ] What is FONDIXPAY's expected PCI scope in this integration model?

### Webhooks / Callbacks
- [ ] Does Tekae send webhooks for payment status changes?
- [ ] What signature method is used to authenticate webhook payloads (HMAC-SHA256, RSA, other)?
- [ ] What is the replay-attack protection mechanism?

### Data Retention
- [ ] What payment data does Tekae send back to FONDIXPAY, and is any of it card data?
- [ ] What is FONDIXPAY's minimum required data retention for reconciliation without storing sensitive data?

### Fraud and Dispute
- [ ] Does Tekae provide fraud signals or risk scores in the payment response?
- [ ] What is the chargeback / dispute notification mechanism?

---

## Security Controls FONDIXPAY Must Implement

These are FONDIXPAY-side requirements regardless of Tekae's model:

- All Tekae API credentials stored in AWS Secrets Manager (not in `.env` committed files, not in mobile app).
- Backend-only calls to Tekae APIs — mobile app must never call Tekae directly with production credentials.
- Webhook endpoint must verify Tekae signature before any state change.
- Payment references stored in FONDIXPAY must be Tekae transaction IDs only — not card data.
- Audit log entry for every Tekae API call result (success, failure, timeout).

---

## Review Gate

This document must be reviewed and signed off by the lead engineer and security reviewer before any Tekae integration code is merged to main.
