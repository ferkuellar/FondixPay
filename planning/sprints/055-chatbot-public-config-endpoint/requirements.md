# Sprint 055 — Endpoint público GET /chat/config

## Objetivo
Exponer un endpoint sin autenticación que devuelva la configuración del bot (identidad, saludo, pills, modelo) para que el widget de la landing la cargue dinámicamente sin hardcoding.

## Contexto
El widget (Sprint 056) necesita saber:
- Nombre del bot, tagline, tooltip, mensaje de saludo
- Pills de conversación inicial (preguntas sugeridas)
- Nombre del modelo para mostrar en el UI

Sin este endpoint, el widget tendría que hardcodear todo, rompiendo la conexión con lo que el admin configura en BotLandingView.

## Alcance aprobado

### Backend — nuevo endpoint en chatbot/routes.py

```
GET /chat/config
```
- **Auth**: ninguna (endpoint público)
- **Response schema** (`PublicBotConfig`):
```python
class BotPill(BaseModel):
    id: str
    label: str
    question: str

class PublicBotConfig(BaseModel):
    name: str
    tagline: str
    tooltip: str
    greeting: str
    pills: list[BotPill]
    model_display: str
```

**Lógica de resolución** — leer de `ChatbotSetting` por key:

| Key en DB              | Campo response       | Default si no existe             |
|------------------------|----------------------|----------------------------------|
| `bot.identity.name`    | `name`               | `"FONDIX Bot"`                   |
| `bot.identity.tagline` | `tagline`            | `"En línea · responde al toque"` |
| `bot.identity.tooltip` | `tooltip`            | `"¿Tienes dudas? Pregúntame"`    |
| `bot.identity.greeting`| `greeting`           | `"¡Hola! Soy el bot de FONDIX PAY..."` |
| `bot.pills`            | `pills`              | Lista default de 3 pills          |
| `bot.model_display`    | `model_display`      | `"claude-haiku-4-5"`             |

Los valores en DB se guardan como JSON en el campo `value` (tipo JSONB/json) — consistente con `ChatbotSetting` existente.

**Pills default** (si no hay en DB):
```json
[
  {"id": "p1", "label": "¿Cuánto cuesta?", "question": "¿Cuánto cobran de comisión?"},
  {"id": "p2", "label": "¿Qué servicios pagan?", "question": "¿Qué servicios puedo pagar con FondixPay?"},
  {"id": "p3", "label": "¿Cómo me registro?", "question": "¿Cómo me registro en la app?"}
]
```

**Caching**: respuesta con `Cache-Control: public, max-age=60` — el widget puede cachear 1 minuto.

### Schema — agregar a `backend/app/modules/chatbot/schemas.py`
```python
class BotPillConfig(BaseModel):
    id: str
    label: str
    question: str

class PublicBotConfig(BaseModel):
    name: str
    tagline: str
    tooltip: str
    greeting: str
    pills: list[BotPillConfig]
    model_display: str
```

### Routing — registrar en el router público
En `backend/app/main.py` (o donde se montan los routers), `GET /chat/config` va en `public_router`, no en `admin_router`.

### Archivos a modificar
- `backend/app/modules/chatbot/schemas.py` — agregar `BotPillConfig`, `PublicBotConfig`
- `backend/app/modules/chatbot/routes.py` — agregar endpoint en `public_router`
- `backend/app/modules/chatbot/repository.py` — agregar `get_setting_value(db, key, default)`

### No se modifica
- DB schema (sin migraciones — usa la tabla `chatbot_settings` existente)
- Auth middleware

## Criterios de aceptación
- [ ] `GET /chat/config` responde 200 sin token
- [ ] Respuesta incluye todos los campos del schema
- [ ] Si no hay settings en DB, retorna defaults razonables (no error 500)
- [ ] Header `Cache-Control: public, max-age=60` presente
- [ ] Si admin actualiza `bot.identity.name` vía PATCH /admin/chat/settings, el GET /chat/config refleja el nuevo valor
- [ ] `docker compose logs backend` sin errores

## Dependencias
- Sprint 053 completado ✓ (ChatbotSetting model y repository ya existen)
- No requiere Sprint 054
