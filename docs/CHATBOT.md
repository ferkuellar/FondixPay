# Public Landing Chatbot And Admin Console

Status: implemented for Phase 10X.1 as a public landing assistant plus internal CRM response console.

## Scope

The public chatbot lives only on the static landing page. It is informational and routing-oriented. It must not authenticate users, execute payments, expose private customer data, expose payment/receipt/balance status, validate OTPs, or access account-level operations.

The approved floating FAB, robot SVG, tooltip, panel, message bubbles, suggested pills, input styling, and animations are preserved in `landing/index.html`. The prototype `window.claude.complete` call was replaced with `POST /api/public/chat`.

## Public Endpoint

`POST /api/public/chat`

Request:

```json
{
  "message": "string",
  "sessionId": "anonymous-session-id",
  "source": "landing",
  "pageUrl": "https://example.com/optional"
}
```

Response:

```json
{
  "reply": "string",
  "conversationId": "uuid",
  "confidence": "rule|faq|intent|ai|fallback"
}
```

Resolution order:

1. Private/payment/account-status guardrail rule.
2. Exact active FAQ match.
3. Active intent match by example phrases.
4. Active knowledge-base search.
5. Optional AI provider only when configured.
6. Safe fallback.

Safe fallback:

`No quiero inventarte una respuesta. Puedo dejar registrado tu caso para que soporte lo revise.`

Private operation routing:

`Por seguridad, ese tipo de consulta debe revisarse dentro de la app o por el canal oficial de soporte autenticado.`

## Admin Console

The CRM/Admin exposes `Bot de Landing` with:

- FAQ management.
- Intent management.
- Knowledge-base entries.
- Bot settings.
- Conversation history.
- Fallback review.

Backend routes use the existing internal convention:

- `GET/POST/PATCH /admin/chat/faqs`
- `POST /admin/chat/faqs/{id}/disable`
- `POST /admin/chat/faqs/{id}/enable`
- `GET/POST/PATCH /admin/chat/intents`
- `POST /admin/chat/intents/{id}/disable`
- `POST /admin/chat/intents/{id}/enable`
- `GET/POST/PATCH /admin/chat/knowledge`
- `POST /admin/chat/knowledge/{id}/disable`
- `POST /admin/chat/knowledge/{id}/enable`
- `GET /admin/chat/conversations`
- `GET /admin/chat/conversations/{id}`
- `GET /admin/chat/fallbacks`
- `GET /admin/chat/settings`
- `PATCH /admin/chat/settings/{key}`

## RBAC

- `ADMIN` and `SUPER_ADMIN`: manage FAQs, intents, knowledge, settings, conversations, and fallbacks.
- `SUPPORT`: view conversations and review fallbacks, no settings write.
- `FINANCE`: view conversations and review fallbacks, no response-setting write.
- `AUDITOR`: read-only chatbot visibility and conversation view.
- `USER`: no admin chatbot access.

Backend authorization is authoritative. Frontend permission rendering is convenience only.

## Sensitive Data Handling

Before storing user messages, the backend masks likely:

- Card-like numbers.
- OTP-like numeric codes.
- Emails.
- Phone numbers.
- Password/token/API-key style assignments.

Stored conversation messages use `message_text_masked`; `raw_message_stored=false` by default. Public responses must not reveal whether a customer, phone, payment, receipt, transaction, or balance exists.

## Audit Events

Implemented chatbot events:

- `chatbot.faq.created`
- `chatbot.faq.updated`
- `chatbot.faq.disabled`
- `chatbot.faq.enabled`
- `chatbot.intent.created`
- `chatbot.intent.updated`
- `chatbot.intent.disabled`
- `chatbot.intent.enabled`
- `chatbot.knowledge.created`
- `chatbot.knowledge.updated`
- `chatbot.knowledge.disabled`
- `chatbot.knowledge.enabled`
- `chatbot.settings.updated`
- `chatbot.conversation.created`
- `chatbot.message.received`
- `chatbot.fallback.created`

Metadata must remain safe and redacted.

## Environment

AI provider values are optional. Empty values keep the system in FAQ/rule-only mode.

- `CHATBOT_AI_PROVIDER`
- `CHATBOT_AI_API_KEY`
- `CHATBOT_AI_MODEL`
- `CHATBOT_MAX_MESSAGE_LENGTH`

No provider key may be committed.

## Validation

Automated validation added:

- Public chat rejects empty and oversized messages.
- Public chat returns exact FAQ matches.
- Unknown questions create safe fallback records.
- Private payment/account questions route to authenticated support/app flow.
- Sensitive values are masked before storage.
- Normal users cannot access chatbot admin routes.
- Admins can manage FAQs, intents, and knowledge entries.
- Admins can view conversations and fallbacks.

Manual landing validation still requires opening the landing page against a running backend and confirming FAB, tooltip, panel open/close, suggested pills, typing state, and response bubble behavior.
