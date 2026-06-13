# Sprint 058 — Hardening de producción del chatbot

## Objetivo
Preparar el sistema de chatbot para tráfico real: CORS correcto para el dominio de producción, rate limiting por IP, degradación elegante, y verificación de que todos los endpoints críticos tienen los headers y comportamientos correctos.

## Contexto
Con Sprint 054-057 completados, el bot funciona en localhost. Antes de apuntar el DNS de la landing al servidor de producción, necesitamos garantizar:
- La landing en `fondixpay.com` puede llamar al backend sin CORS errors
- Usuarios maliciosos no pueden abusar el endpoint de Claude (costo económico)
- Si Claude API está caída, el bot sigue siendo útil (no pantalla rota)
- El admin puede ver si el bot está activo y cuántas conversaciones hay

## Alcance aprobado

### 1. CORS para dominio de producción — `backend/app/core/config.py` + `main.py`

**Configuración:**
- Variable de entorno: `ALLOWED_ORIGINS` (lista separada por comas)
- Agregar al `.env.example`:
  ```
  ALLOWED_ORIGINS=https://fondixpay.com,https://www.fondixpay.com,http://localhost:4173
  ```
- El middleware CORS existente ya está — solo verificar que `ALLOWED_ORIGINS` incluye los dominios de la landing

**Endpoints que necesitan CORS permisivo:**
- `POST /chat` — desde landing (cross-origin)
- `GET /chat/config` — desde landing (cross-origin)

### 2. Rate limiting por IP — middleware en FastAPI

**Implementación:**
- Módulo nuevo: `backend/app/core/rate_limit.py`
- Estructura en memoria: `dict[str, (count, window_start)]`
- Límites para endpoints públicos del chatbot:
  - `POST /chat`: 30 requests / IP / hora
  - `GET /chat/config`: 120 requests / IP / hora (cacheable, más permisivo)
- Respuesta al exceder: `HTTP 429` con body `{"detail": "Demasiadas solicitudes. Intenta en unos minutos."}`
- Header en respuesta: `Retry-After: 3600`
- Identificación de IP: usar `X-Forwarded-For` si está presente (proxy/CDN), sino `request.client.host`
- El rate limiting en memoria se limpia cada hora (o en el próximo request del mismo IP)

**Nota:** Rate limiting en memoria se pierde en restart. Aceptable para esta fase; una iteración futura puede usar Redis.

### 3. Degradación elegante del chatbot

**Escenario: Claude API caída o key inválida:**
- El bot responde con un mensaje pre-escrito (no un error técnico):
  > "En este momento estoy teniendo dificultades para responderte. Por favor escríbenos directamente al soporte o descarga la app para ayudarte mejor."
- La conversación sigue guardándose en DB con `confidence="fallback_ai_down"`
- El admin ve estas conversaciones en Chat Operations

**Escenario: DB caída:**
- FastAPI ya tiene manejo de errores de conexión → HTTP 503
- El widget del landing muestra burbuja de error amigable (ya cubierto en Sprint 056)

**Mensaje de fallback configurable:**
- Agregar key `bot.fallback_message` en ChatbotSetting
- Default: el mensaje de arriba
- Cargado en `_resolve_reply()` al inicio de la app (o al llamar)

### 4. Health check del subsistema chatbot

**Nuevo endpoint:**
```
GET /chat/health
```
- Auth: ninguna
- Response:
```json
{
  "status": "ok",           // "ok" | "degraded" | "down"
  "ai_configured": true,    // CHATBOT_AI_API_KEY presente
  "db_reachable": true,
  "conversations_today": 42
}
```
- `status: "degraded"` si AI no está configurada pero DB sí
- `status: "down"` si DB no responde
- Útil para monitoreo y para que el widget decida si mostrar el botón

**El widget puede usar este endpoint (opcional):**
- Si `status === "down"`: ocultar el botón flotante en la landing
- Si `status === "degraded"`: mostrar el botón pero con indicador visual

### 5. Sesión y limpieza

**Expiración de conversaciones:**
- Las conversaciones con `status="active"` y `last_message_at` > 24h se marcan como `status="closed"` (tarea periódica o al crear nueva conversación del mismo session_id)
- Un nuevo mensaje de un session_id con conversación cerrada: crear nueva conversación

**Sin cron job esta fase** — la limpieza se hace lazy (al recibir el siguiente mensaje del session_id).

### 6. Headers de seguridad en endpoints públicos

Agregar a respuestas de `POST /chat` y `GET /chat/config`:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```
Implementar como middleware en FastAPI o en el router público.

---

## Archivos a crear/modificar
- `backend/app/core/rate_limit.py` — nuevo módulo
- `backend/app/modules/chatbot/routes.py` — aplicar rate limit, agregar health endpoint
- `backend/app/modules/chatbot/services.py` — fallback message desde DB
- `backend/app/core/config.py` — verificar ALLOWED_ORIGINS
- `.env.example` — documentar ALLOWED_ORIGINS

## Criterios de aceptación
- [ ] `GET /chat/health` responde 200 con JSON correcto
- [ ] Desde `fondixpay.com`, `POST /chat` no genera CORS error (verificar con curl -H "Origin: https://fondixpay.com")
- [ ] El mensaje 31 del mismo IP en < 1h retorna HTTP 429
- [ ] Sin CHATBOT_AI_API_KEY: bot responde con mensaje de degradación, no error 500
- [ ] Conversación con `last_message_at` > 24h + nuevo mensaje: se crea nueva conversación
- [ ] Headers de seguridad presentes en respuestas públicas
- [ ] `docker compose logs backend` sin stacktraces en operación normal

## Dependencias
- Sprint 054, 055, 056, 057 completados
- Dominio de producción definido (para configurar ALLOWED_ORIGINS)
