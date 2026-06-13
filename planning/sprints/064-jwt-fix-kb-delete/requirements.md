# Sprint 064 — Fix JWT + endpoint DELETE Knowledge

## Objetivo
Corregir el token JWT generado incorrectamente (que causaba 401 en todos los endpoints admin) y añadir la funcionalidad de eliminar entradas de la base de conocimiento.

## Contexto
El usuario reportó "en ninguno guarda y no tiene manera de borrar si quiere quitar temas viejos". Se diagnosticaron dos problemas:

1. **JWT mal formateado:** El token había sido generado con `create_access_token({'sub': str(user.id), 'role': user.role})` — pasando un dict como subject. El backend hace `int(payload.get("sub"))` que falla con un dict y retorna 401 en todos los endpoints admin.

2. **Sin endpoint DELETE para KB:** No existía forma de eliminar entradas de la base de conocimiento desde el admin.

## Causa raíz JWT
```python
# INCORRECTO — subject como dict:
create_access_token({'sub': str(user.id), 'role': user.role})

# CORRECTO — subject como string:
create_access_token(str(user.id))
```
`get_current_user` en `security.py` hace `user_pk = int(payload.get("sub"))` — esto falla cuando sub es un dict serializado como string.

## Alcance aprobado

### 1. Documentar la generación correcta del token
- El token debe generarse con `create_access_token(str(user.id))`
- Regenerar token para sesión de desarrollo con el formato correcto

### 2. Endpoint DELETE Knowledge
```python
@admin_router.delete("/knowledge/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_knowledge(item_id: int, ...):
    services.get_or_404(repository.get_knowledge(db, item_id), "Entrada no encontrada")
    repository.delete_knowledge(db, item_id)
    services.audit_admin_chatbot_action(...)
    db.commit()
```

### 3. Función `delete_knowledge` en repository
```python
def delete_knowledge(db: Session, item_id: int) -> bool:
    item = get_knowledge(db, item_id)
    if item is None:
        return False
    db.delete(item)
    db.flush()
    return True
```

### 4. Botón × por fila en tabla KB (frontend)
- Ícono `×` en cada fila de la tabla KB
- `deleteKbEntry(id)` llama `deleteChatbotKnowledge(id)` y filtra la lista local

## Archivos modificados
- `backend/app/modules/chatbot/routes.py`
- `backend/app/modules/chatbot/repository.py`
- `admin/src/crm/CrmVisualApp.tsx`

## Criterios de aceptación
- [ ] Token generado con string subject permite acceso a todos los endpoints admin
- [ ] `DELETE /admin/chat/knowledge/{id}` retorna 204 para entradas existentes
- [ ] `DELETE /admin/chat/knowledge/{id}` retorna 404 para entradas inexistentes
- [ ] Botón × en tabla KB elimina la entrada y la quita de la UI inmediatamente
- [ ] Acción auditada en `AuditEvent`
- [ ] `npm run typecheck` pasa sin errores

## Commit
`acfa5c2 phase-064: fix JWT token gen + add KB delete endpoint and button`
