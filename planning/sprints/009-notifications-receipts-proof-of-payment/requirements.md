# Phase 9 Requirements

## Goal

Harden FondixPay mock/sandbox notifications, receipts, and proof of payment so status evidence stays clear after success, pending, timeout, or failure.

## Included

- Backend receipt proof projection for user-owned receipts and payments.
- Exact receipt/proof status mapping from payment and provider state.
- Safe references, fee breakdown, mock/sandbox labels, and receipt view audit.
- In-app notification structure and read flow.
- Mobile proof card, mock share action, and notification list surface.
- AXON-AI docs, risks, backlog, validation, and completion report.

## Excluded

- Real payment movement.
- Production card processor or Prontipagos.
- FCM, email, WhatsApp, PDF, CFDI, fiscal proof, CRM admin panel, and real reconciliation.
- PAN, CVV, raw provider payloads, and production claims.
