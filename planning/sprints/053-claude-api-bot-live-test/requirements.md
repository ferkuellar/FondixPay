# Sprint 053 — Claude API: Bot Live Test

## Goal

Integrate the Anthropic Claude API into the admin dashboard so the "Probar" button in BotLandingView opens a real interactive chat using the configured system prompt.

## Context

The dashboard has a full bot editor UI (system prompt, knowledge base, identity fields, live preview widget) but the "Probar" button was static and non-functional. The user has an Anthropic API key and needs the integration working before a Monday meeting about Tekae integration.

## Scope

### Backend
- `POST /admin/chat/test` — accepts `{system, messages, model}`, proxies to Anthropic Messages API using `CHATBOT_AI_API_KEY` from settings. Returns `{content, model}`. Requires `admin.chatbot.manage` permission.
- `ChatTestRequest`, `ChatTestMessage`, `ChatTestResponse` schemas added to `chatbot/schemas.py`.
- `httpx` (already in requirements) used for the Anthropic call — no new packages needed.
- `docker-compose.yml` updated to load `.env` (optional, gitignored) in addition to `.env.example`, so the API key can be set without committing it.

### Frontend
- `adminClient.ts`: `chatTest()` method added.
- `CrmVisualApp.tsx`: `BotLandingView` wired with live test modal — triggered by "Probar" button, shows real conversation thread using the active system prompt, handles loading and error states.
- `crmVisual.css`: modal overlay and chat bubble styles added.

## API Key Setup (local, not committed)

Create `E:\FondixPay-1\.env` (gitignored) with:
```
CHATBOT_AI_API_KEY=sk-ant-...your key...
CHATBOT_AI_PROVIDER=anthropic
CHATBOT_AI_MODEL=claude-haiku-4-5-20251001
```
Then restart: `docker compose up --build -d`

## Out of Scope

- Streaming responses
- Conversation persistence in the DB
- Token cost tracking (metrics shown are still static)
- Public chatbot AI wiring (separate sprint)

## Acceptance Criteria

- "Probar" button opens chat modal
- Admin types a message → real Claude response appears
- System prompt in the editor is sent as context to Claude
- If `CHATBOT_AI_API_KEY` is not set, modal shows a clear error message
- TypeScript build passes (`npm run typecheck` in `admin/`)
