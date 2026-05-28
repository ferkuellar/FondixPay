# Phase 10X.2 Blueprint

## Architecture

- Backend extends the existing `chatbot` module rather than creating a new service.
- Chat Operations endpoints live under `/admin/chat/operations/*`.
- Backend RBAC remains authoritative through `admin.chat_ops.*` permissions.
- CRM uses an internal route `#/chat-operations`; it is linked from `Bot de Landing` but not added as `Chat console` in the sidebar.

## Data Model

- Extend `chatbot_conversations` with severity, classifier, assignment, escalation, review, and ticket linkage fields.
- Add `chatbot_conversation_events` for local audit timeline.
- Add `chatbot_internal_notes` for internal support notes.
- Extend `support_tickets` for chat-origin severity, source, SLA, first response, resolution, reopen, excerpt, and conversation linkage.

## Classification

Rule-based first pass:

- `fraud_concern` -> `SEV-1`
- `payment_concern` and `receipt_issue` -> `SEV-2`
- `registration_issue` and `coverage_question` -> `SEV-3`
- `commission_question`, `app_download_question`, `general_faq` -> `SEV-4`
- `feature_request` -> `SEV-5`

## Human Rules

- `SEV-1` and `SEV-2` require ticket/human review.
- AI cannot auto-close `SEV-1` or `SEV-2`.
- SUPPORT cannot downgrade `SEV-1`; manager/admin permission is required.

## UI

- Use existing CRM layout and CSS conventions.
- Topbar adds theme toggle, bell, environment selector, environment pill, role pill, and logout.
- Banner shows non-production DEV AUTH warning and can be hidden.
- Chat Operations uses three panels: queue, transcript, context/actions.
