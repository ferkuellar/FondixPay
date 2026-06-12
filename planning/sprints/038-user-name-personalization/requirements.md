# Sprint 038 — User Name Personalization: Requirements

## Goal

Replace hardcoded demo user names with real data from the auth store across HomeScreen and ProfileScreen.

## Scope

- `HomeScreen`: subscribe to `user` from auth store; derive `displayName` from `user?.name?.trim() || 'Usuario'`.
- `ProfileScreen`: replace `'Sofía Ramírez'` fallback with `'Usuario'`; replace fake phone fallback `'+52 61 4123 4567'` with `'Sin teléfono'`.
- No new screens, components, store actions, or backend endpoints.

## Out of Scope

- No user-editable name field (future profile-edit sprint).
- No change to `AuthUser` type or backend user model.
- No payment, provider, or infrastructure changes.

## Acceptance Criteria

- Home header shows real `user.name` when set; falls back to `'Usuario'`.
- Profile card shows real `user.name` when set; falls back to `'Usuario'`.
- Phone fallback shows `'Sin teléfono'` instead of a fake number.
- `npm run typecheck` passes with 0 errors.
