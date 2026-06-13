# Sprint 057 — Persistencia de configuración del bot en admin

## Objetivo
Conectar BotLandingView del CRM admin con el backend: cargar configuración actual desde DB al abrir la vista, y persistir cambios (identidad, prompt, pills) al hacer click en "Guardar".

## Contexto
Actualmente BotLandingView tiene toda la configuración hardcodeada en React state:
- `BOT_DEFAULT_PROMPT` — constante en el archivo
- `botPillsInitial` — array hardcodeado
- Identidad (name, tagline, greeting, tooltip) — useState con valores fijos

Los botones "Guardar" existen en el UI pero no llaman a ningún endpoint. Los cambios se pierden al recargar.

El backend ya tiene:
- `GET /admin/chat/settings` → lista de ChatbotSetting
- `PATCH /admin/chat/settings/{key}` → actualiza o crea un setting por key

## Alcance aprobado

### Admin — `admin/src/crm/CrmVisualApp.tsx` — función `BotLandingView`

**Al montar la vista:**
- Llamar `api.chatbotSettings()` → `ChatbotSetting[]`
- Mapear keys conocidas a state:

| Key backend              | State local          |
|--------------------------|----------------------|
| `system_prompt`          | `prompt`             |
| `bot.identity.name`      | `identity.name`      |
| `bot.identity.tagline`   | `identity.tagline`   |
| `bot.identity.tooltip`   | `identity.tooltip`   |
| `bot.identity.greeting`  | `identity.greeting`  |
| `bot.pills`              | `pills`              |
| `bot.model_display`      | (display only)       |

- Si una key no existe en DB: mantener el valor default actual del useState
- Mostrar spinner de carga mientras se obtienen los settings
- No bloquear el UI si falla (usar defaults silenciosamente)

**Botón "Guardar" en sección de Identidad:**
```
onClick → api.updateChatbotSetting("bot.identity.name", { value: identity.name })
        → api.updateChatbotSetting("bot.identity.tagline", { value: identity.tagline })
        → api.updateChatbotSetting("bot.identity.tooltip", { value: identity.tooltip })
        → api.updateChatbotSetting("bot.identity.greeting", { value: identity.greeting })
```
- Ejecutar en paralelo (Promise.all)
- Mostrar "Guardando..." en el botón mientras espera
- Mostrar "✓ Guardado" por 2 segundos al completar
- Mostrar error en rojo si falla

**Botón "Guardar prompt" en sección de System Prompt:**
```
onClick → api.updateChatbotSetting("system_prompt", { value: prompt })
```
- Mismo patrón de loading/success/error

**Botón "Guardar pills" en sección de Pills:**
```
onClick → api.updateChatbotSetting("bot.pills", { value: pills })
```
- Pills se guardan como array JSON en el campo value del setting

**Indicador "Último guardado":**
- Mostrar timestamp relativo debajo del botón después de guardar: "Guardado hace 2 min"
- Usar `useState<Date | null>(null)` por sección

### Estado de carga — nuevo `SaveState` type
```typescript
type SaveState = "idle" | "saving" | "saved" | "error";
```
Un `SaveState` por sección (identidad, prompt, pills).

### Archivos a modificar
- `admin/src/crm/CrmVisualApp.tsx` — función `BotLandingView` únicamente

### No se modifica
- `adminClient.ts` — `updateChatbotSetting` ya existe y tiene la firma correcta
- Backend
- Otros módulos del CRM

## Criterios de aceptación
- [ ] Al abrir Bot de Landing, los campos muestran los valores guardados en DB (no los hardcodeados)
- [ ] Editar nombre del bot y guardar → recargar la vista → el nombre nuevo persiste
- [ ] Editar system prompt y guardar → el endpoint público usa el nuevo prompt en la siguiente llamada
- [ ] Guardar pills → `GET /chat/config` retorna las pills actualizadas
- [ ] Botón "Guardar" muestra estado visual (idle / saving / saved / error)
- [ ] Error de red muestra mensaje en rojo, no pantalla rota
- [ ] `npm run typecheck` pasa limpio

## Dependencias
- Sprint 055 completado (keys de settings definidas)
- Sprint 054 completado (el sistema prompt guardado se usa en Claude)
- `api.updateChatbotSetting` ya implementado en adminClient.ts ✓
- `api.chatbotSettings()` ya implementado en adminClient.ts ✓
