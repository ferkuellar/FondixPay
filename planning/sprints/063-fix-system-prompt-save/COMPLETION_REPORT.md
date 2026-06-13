# Sprint 063 — COMPLETION REPORT

## Estado: COMPLETADO

Commit: `37b4e84 phase-063: fix system prompt save — raise max_length to 20000 and show error detail`

## Causa raíz identificada
`ChatbotSettingUpdate.value` tenía `max_length=4000`. Prompts de sistema reales superaban este límite. Pydantic retornaba 422 antes de llegar al handler FastAPI.

## Implementado

- `ChatbotSettingUpdate.value` → `max_length=20000` en `schemas.py`.
- Estado `promptError: string | null` añadido a `BotLandingView`.
- `savePrompt()` captura el mensaje del `AdminApiError` y lo asigna a `promptError`.
- Mensaje de error renderizado debajo del textarea con estilo de error.
- `promptError` se limpia en cada intento de guardado.

## Archivos cambiados
- `backend/app/modules/chatbot/schemas.py`
- `admin/src/crm/CrmVisualApp.tsx`

## Validación
- `npm run typecheck` pasa limpio.
- Backend sincronizado vía Docker (`docker compose cp` + restart).
- No se cambió mobile, payment logic, provider adapters, Tekae, ni infraestructura.
