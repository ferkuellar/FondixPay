# Sprint 059 — Botón "Publicar cambios" en BotLandingView

## Objetivo
Implementar el botón "Publicar cambios" en el panel CRM admin de BotLandingView, que guarda todas las secciones de configuración del bot en paralelo con feedback visual.

## Contexto
Los sprints 054–058 completaron la serie Bot de Landing → Producción. El BotLandingView del CRM tenía botones "Guardar" por sección individual. El usuario pidió un botón "Publicar cambios" que consolide todas las operaciones de guardado en una sola acción, con banner de confirmación.

## Alcance aprobado

### 1. Función `publishAll()` en BotLandingView
- Guarda en paralelo: identidad (nombre, tagline, tooltip, saludo), system prompt, pills, y estado activo de KB
- Usa `Promise.allSettled` para capturar resultados individuales
- Si alguna falla, el banner muestra error; si todas pasan, banner verde

### 2. Banner de publicación animado
- Aparece entre el mini-grid y el bot-grid
- Verde con ícono check: `"Cambios publicados correctamente"`
- Rojo con ícono x: `"Error al publicar — revisa las secciones"`
- Animación `crm-fade-in` al aparecer
- Desaparece automáticamente después de 4 segundos

### 3. Estado `publishState` y `publishedAt`
- `publishState: "idle" | "saving" | "ok" | "error"`
- `publishedAt: Date | null` para mostrar timestamp relativo

## Archivos modificados
- `admin/src/crm/CrmVisualApp.tsx` — función `publishAll()`, estados, banner JSX
- `admin/src/crm/crmVisual.css` — `.crm-publish-banner`, `.crm-publish-banner--ok`, `.crm-publish-banner--error`, `@keyframes crm-fade-in`

## Criterios de aceptación
- [ ] Botón "Publicar cambios" visible en BotLandingView
- [ ] Click guarda identity + system prompt + pills + KB en paralelo
- [ ] Banner verde aparece en éxito con animación
- [ ] Banner rojo aparece en error con mensaje descriptivo
- [ ] Banner desaparece automáticamente después de 4s
- [ ] `npm run typecheck` pasa sin errores

## Commit
`43a020e phase-059: implement Publicar cambios button in BotLandingView`
