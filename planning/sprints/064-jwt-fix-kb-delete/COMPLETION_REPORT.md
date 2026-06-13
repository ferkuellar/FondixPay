# Sprint 064 — COMPLETION REPORT

## Estado: COMPLETADO

Commit: `acfa5c2 phase-064: fix JWT token gen + add KB delete endpoint and button`

## Causa raíz JWT identificada
Token generado con dict como subject: `create_access_token({'sub': str(user.id), 'role': user.role})`.
Backend deserializa `sub` y llama `int(payload.get("sub"))` que falla con dict → 401 en todos los endpoints.
Corrección: usar `create_access_token(str(user.id))`.

## Implementado

**Backend:**
- `DELETE /admin/chat/knowledge/{item_id}` → HTTP 204, requiere permiso `admin.chatbot.manage`, auditado.
- `delete_knowledge(db, item_id)` en `repository.py` — borra y hace flush.
- Token correcto documentado y generado para sesión de desarrollo.

**Frontend:**
- `deleteKbEntry(id)` llama `api.deleteChatbotKnowledge(id)`, filtra la lista `kb` localmente.
- Botón `×` (ícono `x`) en cada fila de la tabla KB.

## Archivos cambiados
- `backend/app/modules/chatbot/routes.py`
- `backend/app/modules/chatbot/repository.py`
- `admin/src/crm/CrmVisualApp.tsx`

## Validación
- `npm run typecheck` pasa limpio.
- Docker backend sincronizado: `docker compose cp` de los 5 archivos cambiados + `docker compose restart backend`.
- Backend confirma startup: `Application startup complete. Uvicorn running on http://0.0.0.0:8000`.
- Token correcto generado: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzgxMzM5Mzc3fQ.qxtY_VmhpDQsfqfjTOJlJ75rkzJkm7_hLTjG8B-DY8w`.
- No se cambió mobile, payment logic, provider adapters, Tekae, ni infraestructura.

## Nota de seguridad
- El token de desarrollo caduca en 60 minutos. Para regenerar: ejecutar el snippet de generación con `create_access_token(str(user.id))` donde `user.id = 1`.
