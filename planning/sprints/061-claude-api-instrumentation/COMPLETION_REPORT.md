# Sprint 061 — COMPLETION REPORT

## Estado: COMPLETADO

Commit: `85daf3e phase-061: instrument Claude API calls with latency and token metrics`

## Implementado

- `ChatbotAiMetric` añadido a `models.py` con campos `conversation_id`, `model`, `latency_ms`, `input_tokens`, `output_tokens`, `created_at`.
- `_call_claude_async` retorna `tuple[str | None, int, int, int]` (text, latency_ms, input_tokens, output_tokens).
- `_resolve_reply` actualizado para propagar las 3 métricas adicionales; paths no-Claude retornan `0, 0, 0`.
- `resolve_public_chat` guarda `ChatbotAiMetric` cuando `latency_ms > 0`.
- `add_ai_metric(db, metric)` añadido a `repository.py`.
- `get_model_health` calcula p50/p95 desde filas reales de los últimos 7 días.

## Archivos cambiados
- `backend/app/modules/chatbot/models.py`
- `backend/app/modules/chatbot/services.py`
- `backend/app/modules/chatbot/repository.py`

## Validación
- Backend arrancó limpio; tabla `chatbot_ai_metrics` creada automáticamente.
- No se cambió admin frontend, mobile, payment logic, provider adapters, Tekae, ni infraestructura.

## Nota de seguridad
- `CHATBOT_AI_API_KEY` nunca se guarda en la tabla ni se expone en respuestas.
- Los tokens capturados son sólo contadores numéricos de uso, no el contenido.
