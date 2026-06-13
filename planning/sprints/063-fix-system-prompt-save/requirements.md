# Sprint 063 — Fix: guardado del system prompt

## Objetivo
Corregir el error al guardar el system prompt desde BotLandingView y mostrar el mensaje de error real al usuario.

## Contexto
El usuario reportó "Personalidad · system prompt no guarda marca error". El backend retornaba 422 Unprocessable Entity porque `ChatbotSettingUpdate.value` tenía `max_length=4000`, un límite demasiado corto para prompts de sistema reales (que pueden superar los 1000 caracteres fácilmente).

## Causa raíz
```python
# ANTES (demasiado corto):
class ChatbotSettingUpdate(BaseModel):
    value: str | None = Field(default=None, max_length=4000)
```

El system prompt de producción superaba este límite → Pydantic rechazaba el request con 422 antes de llegar al handler.

## Alcance aprobado

### 1. Ampliar max_length en schema
```python
# DESPUÉS:
class ChatbotSettingUpdate(BaseModel):
    value: str | None = Field(default=None, max_length=20000)
```

### 2. Mostrar error real en UI
- Añadir estado `promptError: string | null` en BotLandingView
- En `savePrompt()`, capturar el mensaje de error del `AdminApiError` y guardarlo en `promptError`
- Mostrar `promptError` debajo del textarea del system prompt con estilo de error
- Limpiar `promptError` en cada intento de guardado exitoso

## Archivos modificados
- `backend/app/modules/chatbot/schemas.py`
- `admin/src/crm/CrmVisualApp.tsx`

## Criterios de aceptación
- [ ] System prompts de hasta 20 000 caracteres se guardan sin error 422
- [ ] En caso de error, el mensaje real (no genérico) aparece debajo del textarea
- [ ] El error desaparece al guardar exitosamente
- [ ] `npm run typecheck` pasa sin errores

## Commit
`37b4e84 phase-063: fix system prompt save — raise max_length to 20000 and show error detail`
