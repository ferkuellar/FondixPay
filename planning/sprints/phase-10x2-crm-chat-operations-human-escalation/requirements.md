# Phase 10X.2 Requirements

## Goal

Implement an internal CRM Chat Operations Console and human escalation layer for chatbot-origin conversations.

## In Scope

- CRM topbar and DEV AUTH banner alignment with the approved design reference.
- Internal Chat Operations route.
- Conversation metrics, filters, queue, transcript, notes, classification, severity, ticket link, and audit timeline.
- Deterministic classification for chatbot messages.
- `SEV-1` through `SEV-5` severity model.
- Human escalation rules for `SEV-1` and `SEV-2`.
- Chat-origin support ticket fields and creation workflow.
- RBAC permissions and audit events.
- Documentation, planning updates, and tests.

## Out of Scope

- Public chatbot redesign.
- Meta, WhatsApp Cloud API, Twilio, WhatsApp Web extensions, or third-party chat widgets.
- Live sockets or live human chat.
- Payment execution, receipt lookup, balance lookup, customer private data lookup, Prontipagos execution, ledger mutation, settlement, or reconciliation business-rule changes.
