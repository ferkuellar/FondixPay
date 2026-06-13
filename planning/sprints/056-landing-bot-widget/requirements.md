# Sprint 056 — Widget de chatbot para landing

## Objetivo
Incrustar un widget de chat funcional en `landing/index.html` que cargue la config del bot dinámicamente, envíe mensajes al endpoint público y muestre respuestas de Claude en tiempo real.

## Contexto
La landing es HTML estático (sin framework, sin build step). El widget debe ser:
- **Vanilla JS** — sin dependencias externas, funciona sin bundler
- **Auto-contenido** — un `<script>` y un `<link>` en el HTML
- **Responsive** — funciona en móvil y desktop
- **Branded** — usa los colores y fuentes ya definidos en `colors_and_type.css`

La landing actualmente no tiene ningún componente de chat.

## Alcance aprobado

### Archivos nuevos
- `landing/bot-widget.js` — lógica completa del widget
- `landing/bot-widget.css` — estilos del widget

### Modificación
- `landing/index.html` — agregar 2 líneas al final del `<head>` o antes de `</body>`

---

## Especificación del widget

### Comportamiento

**Estado inicial:**
- Botón flotante en esquina inferior derecha (ícono de chat + tooltip del config)
- Al hacer click: panel de chat se expande/anima desde abajo

**Primer mensaje (saludo):**
- Mostrar `greeting` del config como primer mensaje del bot
- Mostrar pills debajo del saludo como botones clickeables
- Al click en pill: enviar `question` como mensaje de usuario

**Flujo de conversación:**
1. Usuario escribe o hace click en pill
2. Widget agrega burbuja de usuario
3. Muestra indicador "escribiendo..." (3 puntos animados)
4. `POST /chat` con `{ message, sessionId, source: "landing", pageUrl: window.location.href }`
5. Recibe `{ reply, conversationId, confidence }` — mostrar `reply` como burbuja del bot
6. Pills desaparecen después del primer mensaje enviado por el usuario

**SessionId:**
- Generado una vez por visita: `crypto.randomUUID()` almacenado en `sessionStorage`
- Key: `fondix_bot_session`

**Cierre:**
- Botón X cierra el panel
- Conversación persiste en `sessionStorage` hasta cerrar el tab

### API calls
```
GET {BASE_URL}/chat/config          — al inicializar, carga name/greeting/pills
POST {BASE_URL}/chat                — por cada mensaje del usuario
  Body: { message, sessionId, source, pageUrl }
  Response: { reply, conversationId, confidence }
```

`BASE_URL` = constante configurable en la primera línea del script:
```js
const FONDIX_BOT_BASE = "https://api.fondixpay.com"; // cambiar a URL prod
```

### UI del widget

**Botón flotante:**
```
┌──────────────┐
│  💬  Ayuda   │  ← pill con texto del tooltip
└──────────────┘
```
Posición: `bottom: 24px; right: 24px; position: fixed; z-index: 9999`

**Panel de chat (320×480px, expandido):**
```
┌─────────────────────────────┐
│ 🤖 FONDIX Bot               ✕│  ← header con name + tagline
├─────────────────────────────┤
│                             │
│  [Mensaje del bot...]       │  ← burbuja bot (izq)
│                             │
│  [Pill 1] [Pill 2] [Pill 3] │  ← pills
│                             │
│      [Mensaje usuario...] → │  ← burbuja usuario (der)
│                             │
│  [···]                      │  ← indicador typing
│                             │
├─────────────────────────────┤
│ [Escribe tu pregunta...] ➤  │  ← input + botón enviar
└─────────────────────────────┘
```
- Fondo: blanco / dark según `data-theme` del `<html>`
- Colores primarios del landing: `#1565E8`, `#3B9BFF`
- Border radius: 20px
- Box shadow pronunciado

**Mobile (< 640px):**
- Panel ocupa ancho completo menos 16px de margen
- Altura: 65vh

### Manejo de errores
- Si `GET /chat/config` falla: usar defaults hardcoded (bot funcional sin config dinámica)
- Si `POST /chat` falla: mostrar burbuja de error en rojo pálido con texto "Ups, no pude responder. Intenta de nuevo."
- Botón de reintento en burbuja de error
- No exponer detalles técnicos al usuario

### Accesibilidad
- `role="dialog"` en el panel
- `aria-label` en todos los botones
- Focus trap cuando el panel está abierto
- ESC cierra el panel
- Input con `placeholder` descriptivo

---

### Inserción en index.html
```html
<!-- Bot widget -->
<link rel="stylesheet" href="bot-widget.css">
<script defer src="bot-widget.js"></script>
```
Agregar antes de `</body>`.

### Inserción en otras páginas (soporte, contacto, etc.)
Las mismas 2 líneas — el widget es page-agnostic.

---

## Criterios de aceptación
- [ ] Botón flotante visible en `landing/index.html` al abrir en browser
- [ ] Click abre el panel con saludo del bot y 3 pills
- [ ] Click en pill envía la pregunta y recibe respuesta de Claude
- [ ] Mensaje escrito manualmente funciona igual
- [ ] "Escribiendo..." aparece mientras espera respuesta
- [ ] Error de red muestra mensaje amigable, no bloquea la UI
- [ ] En móvil (375px): panel se adapta sin scroll horizontal
- [ ] ESC y botón ✕ cierran el panel
- [ ] Recarga de página: sessionId se mantiene (sessionStorage)
- [ ] `BASE_URL` apunta a backend local en dev; variable fácil de cambiar para producción

## Dependencias
- Sprint 054 completado (Claude en endpoint público)
- Sprint 055 completado (GET /chat/config)
- No requiere cambios en backend
