# Sprint 061 — Instrumentación de llamadas Claude API

## Objetivo
Capturar latencia y tokens por cada llamada a Claude para alimentar las métricas reales de "Salud del modelo" en el CRM admin.

## Contexto
El endpoint `GET /admin/chat/model-health` fue creado en Sprint 060 pero las métricas de latencia (p50/p95) y tokens siempre mostraban `null` porque no había instrumentación en las llamadas a Claude. El usuario preguntó "por qué no tiene las estadísticas del modelo".

## Alcance aprobado

### 1. Nuevo modelo `ChatbotAiMetric`
```python
class ChatbotAiMetric(Base):
    __tablename__ = "chatbot_ai_metrics"
    id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int | None] = mapped_column(ForeignKey("chatbot_conversations.id"), nullable=True, index=True)
    model: Mapped[str] = mapped_column(String(80))
    latency_ms: Mapped[int] = mapped_column(Integer)
    input_tokens: Mapped[int] = mapped_column(Integer, default=0)
    output_tokens: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
```
- Auto-crea tabla vía `Base.metadata.create_all` en startup (sin Alembic migration)

### 2. `_call_claude_async` retorna métricas
```python
async def _call_claude_async(message, system_prompt) -> tuple[str | None, int, int, int]:
    # retorna (text, latency_ms, input_tokens, output_tokens)
```
- Mide latencia con `time.perf_counter()`
- Extrae `usage.input_tokens` y `usage.output_tokens` del response JSON de Claude

### 3. `_resolve_reply` propaga métricas
- Cambia firma para retornar `(reply, source, confidence, latency_ms, input_tokens, output_tokens)`
- Rutas no-Claude retornan `..., 0, 0, 0`

### 4. `resolve_public_chat` guarda métrica
```python
if latency_ms > 0:
    db.add(ChatbotAiMetric(
        conversation_id=conversation.id,
        model=settings.chatbot_ai_model,
        latency_ms=latency_ms,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
    ))
```

### 5. `get_model_health` usa datos reales
- Consulta `ChatbotAiMetric` últimos 7 días
- Ordena latencias y calcula p50 = `latencies[len//2]`, p95 = `latencies[int(len*0.95)]`

## Archivos modificados
- `backend/app/modules/chatbot/models.py`
- `backend/app/modules/chatbot/services.py`
- `backend/app/modules/chatbot/repository.py`

## Criterios de aceptación
- [ ] Tabla `chatbot_ai_metrics` se crea automáticamente al reiniciar el backend
- [ ] Cada llamada exitosa a Claude inserta una fila con latencia y tokens reales
- [ ] `GET /admin/chat/model-health` retorna `latency_p50_ms` y `latency_p95_ms` no-null después de al menos 1 conversación con Claude
- [ ] Rutas FAQ/intent/knowledge no generan métricas falsas (latency_ms=0)
- [ ] Backend arranca sin errores de importación

## Commit
`85daf3e phase-061: instrument Claude API calls with latency and token metrics`
