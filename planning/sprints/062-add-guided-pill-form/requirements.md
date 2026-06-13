# Sprint 062 — Formulario "Agregar pregunta guiada"

## Objetivo
Hacer funcional el botón "Agregar pregunta guiada" en la sección Respuestas guiadas de BotLandingView, que abría un formulario pero no hacía nada.

## Contexto
El sprint 057 implementó la carga y guardado de pills desde/hacia la DB. Sin embargo, el botón "+" de la sección de Respuestas guiadas mostraba un formulario inline vacío que no podía agregar nada. El usuario reportó: "en el área de respuestas guiadas, viene agregar pregunta guiada pero no se puede agregar nada".

## Alcance aprobado

### 1. Estados para el formulario de nueva pill
```typescript
const [newPillOpen, setNewPillOpen] = useState(false);
const [newPillLabel, setNewPillLabel] = useState("");
const [newPillQ, setNewPillQ] = useState("");
```

### 2. Función `saveNewPill()`
```typescript
async function saveNewPill() {
  const existing = pills; // lista actual de pills
  const updated = [...existing, { id: `p${Date.now()}`, label: newPillLabel.trim(), question: newPillQ.trim() }];
  // Guarda via updateChatbotSetting("bot.pills", JSON.stringify(updated))
  // En éxito: actualiza estado local de pills, cierra formulario, limpia campos
}
```

### 3. Formulario inline en sección "Respuestas guiadas"
- Botón "+" abre formulario
- Campo label (etiqueta visible en el chat)
- Campo question (pregunta que se envía al bot)
- Botones "Agregar" y "Cancelar"
- "Agregar" deshabilitado si algún campo está vacío
- Estado visual durante guardado (saving/saved)

## Archivos modificados
- `admin/src/crm/CrmVisualApp.tsx`

## Criterios de aceptación
- [ ] Botón "+" abre formulario con campos Label y Pregunta
- [ ] "Agregar" está deshabilitado con campos vacíos
- [ ] Al guardar, la nueva pill aparece inmediatamente en la lista
- [ ] El cambio se persiste en DB (recargando la página sigue estando)
- [ ] "Cancelar" cierra el formulario y limpia los campos
- [ ] `npm run typecheck` pasa sin errores

## Commit
`85daf3e phase-062: implement add guided pill form in Respuestas guiadas`
