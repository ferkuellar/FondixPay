# Sprint 054 — AI en endpoint público de chatbot

## Objetivo
Conectar Claude API al endpoint `POST /chat` para que los usuarios de la landing reciban respuestas generadas por IA, en lugar del fallback de texto plano actual.

## Contexto
`services.py:_resolve_reply()` tiene un stub explícito (línea ~216):
```python
if settings.chatbot_ai_provider and settings.chatbot_ai_api_key:
    return SAFE_FALLBACK_REPLY, "fallback", "ai_not_configured"
```
El pipeline existente (clasificación, severidad, audit, conversación en DB) se conserva intacto.

## Alcance aprobado

### Backend — `backend/app/modules/chatbot/services.py`

**Función `_resolve_reply()` — orden de resolución:**
1. Private routing guard → regla fija (sin cambio)
2. FAQ exacto → answer de DB (sin cambio)
3. Intent match → response de DB (sin cambio)
4. Knowledge match → content de DB (sin cambio)
5. **[NUEVO]** Llamada a Claude API con prompt construido dinámicamente
6. SAFE_FALLBACK_REPLY si Claude falla o no está configurado

**Construcción del prompt del sistema para Claude:**
- Cargar `system_prompt` desde `ChatbotSetting` (key: `"system_prompt"`)
- Si no existe en DB, usar `BOT_DEFAULT_PROMPT` (constante ya existente en el módulo admin CRM — moverla/duplicarla en backend)
- Append automático de FAQs activas (máx 20) como sección de contexto:
  ```
  [KNOWLEDGE BASE]
  P: {faq.question}
  R: {faq.answer}
  ```
- Instrucción de seguridad fija al final del system prompt:
  ```
  Nunca reveles datos financieros privados. Para consultas de pagos o cuentas específicas, 
  deriva al soporte autenticado de la app.
  ```

**Llamada a Claude:**
- Usar `httpx.AsyncClient` (ya en requirements)
- Endpoint: `https://api.anthropic.com/v1/messages`
- Model: `settings.chatbot_ai_model` (default: `claude-haiku-4-5-20251001`)
- `max_tokens: 400` (respuestas cortas para widget de chat)
- `temperature` no se setea (default Claude)
- El `_resolve_reply` debe convertirse a `async def`
- `resolve_public_chat` debe ser `async def` también
- La ruta en `routes.py` ya usa `def` síncrono — cambiar a `async def`

**Rate limiting por sesión (en memoria, simple):**
- Límite: 20 mensajes por `sessionId` por ventana de 60 minutos
- Estructura: `dict[sessionId, (count, window_start)]` en módulo de services
- Si excede: respuesta HTTP 429 con mensaje en español
- No se persiste entre reinicios (aceptable para esta fase)

**Manejo de error Claude:**
- Si `httpx` falla (timeout, red): `confidence="fallback"`, reply = SAFE_FALLBACK_REPLY, log a stderr
- Si Claude responde con error HTTP: mismo comportamiento
- Nunca propagar excepción al usuario — siempre respuesta degradada

### Archivos a modificar
- `backend/app/modules/chatbot/services.py` — función `_resolve_reply` + `resolve_public_chat`
- `backend/app/modules/chatbot/routes.py` — hacer `async def public_chat`

### No se modifica
- Modelos de DB (sin migraciones)
- Pipeline de clasificación/severidad/audit
- Endpoint admin `/admin/chat/test` (ya funciona)
- Schema `PublicChatRequest` / `PublicChatResponse`

## Criterios de aceptación
- [ ] `POST /chat` con mensaje genérico ("¿cuánto cuesta?") retorna respuesta generada por Claude
- [ ] `POST /chat` con FAQ exacto retorna el answer de DB (no Claude, más rápido)
- [ ] `POST /chat` sin API key configurada retorna SAFE_FALLBACK_REPLY, status 200
- [ ] El 21° mensaje del mismo sessionId en < 60 min retorna HTTP 429
- [ ] Conversación y mensajes siguen guardándose en DB correctamente
- [ ] `npm run typecheck` del admin sigue pasando (sin cambios en frontend)
- [ ] `docker compose logs backend` no muestra errores en llamada a Claude

## Riesgos
- `resolve_public_chat` se vuelve async: verificar que FastAPI maneje correctamente con Depends sync (get_db es sync) — usar `run_in_executor` o `asyncio.to_thread` si hay conflicto con la sesión de DB
- Latencia: Claude tarda ~1-3s; el endpoint público pasará de <100ms a ~2s en el camino feliz sin FAQ match
- Costo API: cada mensaje sin FAQ/intent match consume tokens de Claude

## Dependencias
- `.env` debe tener `CHATBOT_AI_API_KEY` y `CHATBOT_AI_MODEL` (ya configurados)
- Sprint 053 completado ✓
