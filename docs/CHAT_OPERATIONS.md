# Chat Operations Console

Fase 10X.2 adds the internal CRM Chat Operations Console for monitoring public chatbot conversations, human escalation, severity review, ticket creation, SLA tracking, notes, and audit timeline review.

## Scope

- Internal CRM only.
- Public chatbot remains informational and routing-oriented.
- No live human chat socket is implemented.
- No payment execution, receipt lookup, balance lookup, customer account lookup, Prontipagos execution, ledger mutation, or settlement action is exposed.
- No Meta, WhatsApp Cloud API, Twilio, WhatsApp Web extension, or third-party chat widget is used.

## CRM Placement

- `Bot de Landing` remains the configuration and metrics area for identity, FAQs, intents, knowledge, settings, conversations, and fallbacks.
- `Chat Operations` is available as an internal route from `#/chat-operations`.
- `Chat console` is not restored to the sidebar navigation.

## Severity Model

| Severity | Meaning | Human Rule |
|---|---|---|
| `SEV-1` | Fraud concern, possible data exposure, money loss claim, legal/regulatory threat, security report, or trust-affecting payment incident. | Requires human review and human queue. AI must not close. |
| `SEV-2` | Payment not confirmed, receipt missing after payment, repeated failure, urgent support request, or angry customer. | Requires human review and human queue. AI must not close. |
| `SEV-3` | Operational question, registration confusion, service availability, or non-urgent payment support. | May create ticket when fallback or manual escalation occurs. |
| `SEV-4` | General FAQ or simple guidance. | May remain conversation-only. |
| `SEV-5` | Feature request or product suggestion. | May remain conversation-only. |

## Deterministic Classifier

The first-pass classifier is rule-based and explainable. It stores:

- detected intent,
- suggested severity,
- classification reason,
- escalation status.

Supported categories:

- `payment_concern`
- `fraud_concern`
- `receipt_issue`
- `registration_issue`
- `coverage_question`
- `commission_question`
- `app_download_question`
- `general_faq`
- `fallback_unknown`
- `feature_request`

AI suggestions, if added later, must remain separate from manual status and cannot silently change business state.

## Human Escalation

Rules:

- `SEV-1` and `SEV-2` conversations are marked `ticket_required` or routed to `human_queue`.
- `SEV-1` and `SEV-2` cannot be auto-closed by AI.
- Authorized admins can create a support ticket from a conversation.
- Authorized users can assign, escalate, update severity, add internal notes, mark reviewed, and mark first response.
- `SUPPORT` can work the queue but cannot downgrade `SEV-1` without manager/admin permission.

## Operational UI

The console shows:

- conversation metrics,
- escalation metrics,
- ticket metrics,
- SLA breach count,
- fallback rate,
- top intents,
- conversation queue,
- transcript,
- severity/classification context,
- linked ticket,
- assigned agent,
- internal notes,
- audit timeline,
- quick actions.

## Security

- All admin routes require bearer auth and explicit backend permissions.
- Public chatbot never sees ticket internals.
- Internal notes and stored messages are masked where possible.
- Do not enter PAN, CVV, passwords, OTPs, provider secrets, raw provider payloads, or raw provider errors in notes.
- Public chatbot must not expose customer-specific payment, receipt, balance, account, or transaction information.

## Validation

Validated in this phase:

- `python -m compileall app`
- `python -m pytest tests/test_chatbot_public.py tests/test_admin_chatbot.py tests/test_chat_operations.py`
- `npm run build` in `admin/`
- `python -m alembic heads`
