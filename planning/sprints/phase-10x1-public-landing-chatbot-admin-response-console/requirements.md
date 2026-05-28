# Phase 10X.1 Requirements - Public Landing Chatbot & Admin Response Console

## Goal

Integrate the approved public landing chatbot, replace prototype AI runtime calls with a secure backend endpoint, and add a CRM/Admin console for chatbot response management and review.

## In Scope

- Public landing chatbot frontend integration with unchanged approved design.
- `POST /api/public/chat` backend endpoint.
- FAQ, intent, knowledge, settings, conversation, message, and fallback persistence.
- Sensitive message masking before storage.
- CRM/Admin `Bot de Landing` console.
- RBAC for internal chatbot administration.
- Audit events for chatbot configuration and conversation/fallback creation.
- Documentation, planning updates, and automated validation.

## Out Of Scope

- Meta, WhatsApp Cloud API, Twilio, WhatsApp Web extensions, or third-party chat widgets.
- Customer authentication from the public landing page.
- Payment execution, payment status, receipt lookup, balance lookup, OTP validation, card checks, or account operations.
- Live human chat.
- Production chargeback, reconciliation, payment, or provider changes.
- Mandatory AI provider integration.
