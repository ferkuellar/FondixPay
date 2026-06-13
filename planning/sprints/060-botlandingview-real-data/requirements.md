# Sprint 060 — BotLandingView: datos reales del backend

## Objetivo
Reemplazar todos los datos hardcodeados/mock en BotLandingView con datos reales del backend: base de conocimiento, top preguntas/intents, y salud del modelo Claude.

## Contexto
El sprint 057 conectó la persistencia de settings (identidad, system prompt, pills). Las secciones de KB, Top preguntas y Salud del modelo seguían usando datos mock locales. El usuario solicitó conectarlas al backend real.

## Alcance aprobado

### 1. Base de conocimiento (KB)
- Carga `GET /admin/chat/knowledge` al montar el componente
- Tabla por fila: título, contenido, categoría, toggle activo/inactivo, botón eliminar
- Toggle llama `updateChatbotKnowledge(id, { is_active })` y actualiza lista local
- Formulario inline "Agregar entrada": campos título, contenido, categoría → `createChatbotKnowledge`
- Eliminar: `DELETE /admin/chat/knowledge/{id}` (nuevo endpoint, ver Sprint 064)

### 2. Top intents · 7 días
- Llama `GET /admin/chat/top-questions?days=7&limit=10`
- Campo `detected_intent` agrupado por conversaciones de los últimos 7 días
- Etiquetado honesto como "Top intents · 7 días" (no "top preguntas" porque el texto real no está disponible sin NLP)
- Si no hay datos, muestra estado vacío

### 3. Salud del modelo
- Llama `GET /admin/chat/model-health`
- Muestra: nombre del modelo, api_configured (bool → "Activa"/"Inactiva"), conversations_today, fallback_rate_pct, latency_p50_ms, latency_p95_ms
- Latencias muestran "—" cuando son null (sin métricas aún)

### 4. Nuevos métodos en adminClient.ts
```typescript
chatbotTopQuestions(days?: number, limit?: number): Promise<{intent, hits, escalated}[]>
chatbotModelHealth(): Promise<{model, api_configured, conversations_today, fallback_rate_pct, latency_p50_ms, latency_p95_ms}>
deleteChatbotKnowledge(id: number): Promise<void>
```

### 5. Nuevos endpoints backend
- `GET /admin/chat/top-questions?days=7&limit=10` — agrega `detected_intent` con hits + escalated
- `GET /admin/chat/model-health` — modelo activo, api_configured, conversations_today, fallback_rate, p50/p95 desde `chatbot_ai_metrics`

## Archivos modificados
- `admin/src/crm/CrmVisualApp.tsx`
- `admin/src/api/adminClient.ts`
- `backend/app/modules/chatbot/routes.py`
- `backend/app/modules/chatbot/repository.py`

## Criterios de aceptación
- [ ] KB carga desde DB al abrir BotLandingView
- [ ] Toggle activo/inactivo se persiste inmediatamente
- [ ] Top intents muestra datos reales (vacío si no hay conversaciones con detected_intent)
- [ ] Salud del modelo muestra configuración real de Claude
- [ ] Latencias muestran "—" cuando no hay métricas aún
- [ ] Eliminados: `botKnowledgeInitial`, `botTopQuestions`, `BotKnowledge` type
- [ ] `npm run typecheck` pasa sin errores

## Commit
`56788cb phase-060: wire BotLandingView sections to real backend data`
