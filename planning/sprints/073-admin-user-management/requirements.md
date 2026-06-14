# Sprint 073 — Admin User Management + Sesiones Largas

**Goal:** Eliminar dos fricciones operativas del CRM: tokens de 60 min que expiran constantemente, y la necesidad de acceso directo a DB para crear usuarios admin.

## Scope

### Backend — token admin de 8 horas
- `create_access_token` recibe `expires_delta: timedelta | None = None` opcional
- `POST /admin/auth/verify-otp` usa `timedelta(hours=8)` en lugar del default de 60 min
- `expires_in` en la respuesta refleja el nuevo TTL

### Backend — endpoints admin-users
- `GET /admin/admin-users` — lista todos los usuarios con rol admin (requiere `admin.admin_users.list`)
- `POST /admin/admin-users` — crea usuario admin con phone + role + name opcional (requiere `admin.admin_users.manage`)
  - Valida que el rol sea uno de ADMIN_ROLES
  - Falla con 409 si el teléfono ya existe
  - Escribe audit event
- `PATCH /admin/admin-users/{user_id}/status` — activa o desactiva (requiere `admin.admin_users.manage`)
  - No puede desactivar su propio usuario
  - Escribe audit event
- Permisos `admin.admin_users.list` + `admin.admin_users.manage` agregados a SUPER_ADMIN únicamente

### Backend — tests
- `backend/tests/test_admin_user_management.py`
  - Auth guard (401), RBAC guard 403 para no-SUPER_ADMIN
  - Lista devuelve solo roles admin, no usuarios regulares
  - Crear admin exitoso
  - 409 si el teléfono ya existe
  - 422 si el rol no es admin
  - Desactivar + reactivar
  - No puede desactivar su propio usuario (400)

### Frontend — adminClient.ts
- Tipo `AdminOperatorCreate = { phone: string; role: string; name?: string }`
- `adminOperators()` → `GET /admin/admin-users`
- `createAdminOperator(payload)` → `POST /admin/admin-users`
- `updateAdminOperatorStatus(id, is_active)` → `PATCH /admin/admin-users/{id}/status`

### Frontend — CrmVisualApp.tsx
- `ModuleKey` agrega `"admin-users"`
- Nav item "Operadores" en grupo "Administración" visible solo cuando `role === "SUPER_ADMIN"`
- `AdminUsersView`: tabla con phone, nombre, rol, estado; formulario inline para crear; botón activar/desactivar
- `renderView` maneja `"admin-users"`

## Acceptance criteria
- [ ] Tokens admin duran 8 horas (verificado en respuesta `expires_in`)
- [ ] SUPER_ADMIN puede listar, crear, y desactivar operadores desde el CRM
- [ ] Roles no-SUPER_ADMIN reciben 403 en los 3 endpoints
- [ ] No se puede desactivar el propio usuario (400)
- [ ] `npm run typecheck` — 0 errores
- [ ] Todos los tests pasan

## Out of scope
- No cambia tokens de usuarios móviles
- No agrega roles nuevos
- No implementa edición de teléfono ni contraseña
- No agrega paginación
