# Sprint 073 — Completion Report

**Date:** 2026-06-13  
**Status:** DONE

## What changed

### Backend — token admin de 8 horas
- **`backend/app/core/security.py`** — `create_access_token` acepta `expires_delta: Optional[timedelta] = None`; si se pasa, usa ese delta en lugar del default de 60 min.
- **`backend/app/modules/admin/auth_routes.py`** — `verify-otp` llama `create_access_token(str(user.id), expires_delta=ADMIN_TOKEN_TTL)` donde `ADMIN_TOKEN_TTL = timedelta(hours=8)`. `expires_in` en la respuesta refleja 28800 segundos.

### Backend — endpoints admin-users
- **`backend/app/modules/admin/permissions.py`** — agregadas `admin.admin_users.list` y `admin.admin_users.manage` a SUPER_ADMIN.
- **`backend/app/modules/admin/schemas.py`** — nuevos schemas `AdminOperatorCreate` (phone, role, name?) y `AdminOperatorStatusUpdate` (is_active).
- **`backend/app/modules/admin/routes.py`** — 3 nuevos endpoints:
  - `GET /admin/admin-users` — lista usuarios con rol admin, ordenados por `created_at` desc. Requiere `admin.admin_users.list`.
  - `POST /admin/admin-users` — crea operador. Valida rol en ADMIN_ROLES, devuelve 409 si el teléfono ya existe, 422 si el rol no es admin. Escribe audit event. Requiere `admin.admin_users.manage`.
  - `PATCH /admin/admin-users/{id}/status` — activa/desactiva. Bloquea con 400 si intenta desactivarse a sí mismo. Devuelve 404 si el usuario no es admin. Escribe audit event. Requiere `admin.admin_users.manage`.

### Backend — tests
- **`backend/tests/test_admin_user_management.py`** — 17 tests: auth guard, RBAC para todos los roles no-SUPER_ADMIN, lista excluye usuarios regulares, crear exitoso, 409 duplicado, 422 rol inválido, desactivar/reactivar, no puede desactivar el propio usuario, 404 para usuario regular, verificación `expires_in == 28800`.

### Frontend — adminClient.ts
- Tipo `AdminOperatorCreate`
- Métodos: `adminOperators()`, `createAdminOperator(payload)`, `updateAdminOperatorStatus(id, is_active)`

### Frontend — CrmVisualApp.tsx
- `ModuleKey` agrega `"admin-users"`, `routes` agrega `"/admin-users"`
- `NavItem` agrega campo opcional `requiredRole`
- Nav filtra items: `item.requiredRole === role` — "Operadores" solo visible para SUPER_ADMIN
- `AdminUsersView`:
  - Tabla: teléfono, nombre, rol (pill), estado (badge activo/inactivo), fecha de alta, botón activar/desactivar
  - Formulario inline "Nuevo operador": phone, rol (select sin SUPER_ADMIN), nombre opcional
  - Manejo de errores inline (409 / 422 mostrados en el formulario, error de estado con alert)

## Validation
- `npm run typecheck` — 0 errores
- `pytest tests/test_admin_user_management.py` — 17/17
- `pytest tests/test_admin_auth.py tests/test_admin_analytics.py tests/test_admin_user_management.py` — 39/39

## Acceptance criteria

- [x] Tokens admin duran 8 horas (`expires_in == 28800`)
- [x] SUPER_ADMIN puede listar, crear y desactivar operadores desde el CRM
- [x] Roles no-SUPER_ADMIN reciben 403 en los 3 endpoints
- [x] No se puede desactivar el propio usuario (400)
- [x] `npm run typecheck` — 0 errores
- [x] 17/17 tests pasan
