# Sprint 060 — COMPLETION REPORT

## Estado: COMPLETADO

Commit: `56788cb phase-060: wire BotLandingView sections to real backend data`

## Implementado

- Estados añadidos: `kb`, `kbLoading`, `newKbOpen`, `newKbTitle`, `newKbContent`, `newKbCategory`, `newKbSaving`, `topQuestions`, `modelHealth`.
- `loadKb()` carga `GET /admin/chat/knowledge` al montar. Toggle y delete actualizan lista local.
- Formulario inline para nueva entrada KB: título + contenido + categoría, guarda con `createChatbotKnowledge`.
- `GET /admin/chat/top-questions` — implementado en `repository.get_top_questions()` con SQLAlchemy group-by sobre `detected_intent`.
- `GET /admin/chat/model-health` — implementado en `repository.get_model_health()` con p50/p95 calculados desde `ChatbotAiMetric`.
- `adminClient.ts` recibió: `chatbotTopQuestions`, `chatbotModelHealth`, `deleteChatbotKnowledge`.
- Eliminados: constantes mock `botKnowledgeInitial`, `botTopQuestions`, tipo `BotKnowledge`.

## Archivos cambiados
- `admin/src/crm/CrmVisualApp.tsx`
- `admin/src/api/adminClient.ts`
- `backend/app/modules/chatbot/routes.py`
- `backend/app/modules/chatbot/repository.py`

## Validación
- `npm run typecheck` pasa limpio.
- Backend Docker local corría con los nuevos endpoints.
- No se cambió mobile, payment logic, provider adapters, Tekae, ni infraestructura.
