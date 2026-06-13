# Sprint 069 — Completion Report

**Date:** 2026-06-13  
**Status:** DONE

## What changed

### Backend

**New file: `backend/app/modules/admin/auth_routes.py`**
- `POST /admin/auth/request-otp` — validates phone exists in DB and has an admin role (`ADMIN_ROLES`). Sends OTP via existing mechanic. Returns `{message, expires_in_seconds, otp_dev?}`. Never creates new users. Returns 403 for unknown or non-admin phones.
- `POST /admin/auth/verify-otp` — consumes OTP, re-validates admin role, returns `{access_token, role, expires_in}`. Returns 400 for wrong OTP, 403 for non-admin users.
- Both endpoints write audit events (`admin.auth.otp_requested`, `admin.auth.login_failed`, `admin.auth.login_success`).

**`backend/app/main.py`** — registered `admin_auth_router` at `prefix="/admin/auth"`.

### Frontend

**`admin/src/api/adminClient.ts`**
- Added `AdminOtpSentResponse` and `AdminTokenResponse` types.
- `createAdminClient` now accepts optional `on401?: () => void` callback — called when any protected request returns 401.
- Added `publicRequest<T>()` for unauthenticated calls.
- Added `adminRequestOtp(phone)` and `adminLogin(phone, otp)` methods (use `publicRequest`).
- 401 error message changed from "Revisa el token" to "Sesion expirada. Vuelve a iniciar sesion."

**`admin/src/api/useAdminApi.ts`**
- Passes `() => logout(true)` as the `on401` callback — when any API call returns 401, the session is cleared and the URL gets `?expired=1`.

**`admin/src/auth/AdminAuthProvider.tsx`**
- `logout(expired?: boolean)` — when `expired=true`, appends `?expired=1` to the URL so the LoginPage shows "Tu sesion expiro" message.
- `logout` type updated in `AdminSession`.

**`admin/src/pages/LoginPage.tsx`** (rewritten)
- Two-step form: Step 1 phone input → `adminRequestOtp` → Step 2 OTP input → `adminLogin` → `signIn(token, role)`.
- Dev OTP shown inline in a badge when `otp_dev` is returned.
- Role comes from backend response (not from `VITE_ADMIN_DEV_ROLE` unless `devAuthEnabled`).
- "Sesion expirada" alert shown when `?expired=1` in URL.
- Legacy paste-token fallback preserved as a collapsible section for emergency ops.

**`admin/src/crm/CrmVisualApp.tsx`** and **`admin/src/layout/Topbar.tsx`**
- `onClick={logout}` → `onClick={() => logout()}` to avoid passing the MouseEvent as the `expired` param.

## Tests

`backend/tests/test_admin_auth.py` — 9 tests, all passing:
- Unknown phone → 403
- Non-admin user → 403
- SUPER_ADMIN → OTP sent (200)
- SUPPORT role → OTP sent (200)
- Wrong OTP → 400
- No prior request OTP → 400
- Correct OTP → `{access_token, role, expires_in}` (200)
- Token from verify-otp grants access to `/admin/dashboard`
- Non-admin after OTP consumed → 403

## Validation

- `npm run typecheck` in `admin/` — 0 errors
- 9/9 backend tests passing
- No new DB tables or migrations required

## Acceptance criteria

- [x] `POST /admin/auth/request-otp` returns 403 for non-existent or non-admin phone
- [x] `POST /admin/auth/request-otp` returns OTP response for SUPER_ADMIN phone
- [x] `POST /admin/auth/verify-otp` returns `{access_token, role}` after correct OTP
- [x] `POST /admin/auth/verify-otp` returns 400 for wrong OTP
- [x] `POST /admin/auth/verify-otp` returns 403 if user is not admin role
- [x] CRM login page shows phone → OTP two-step flow
- [x] After successful OTP login, `isAuthenticated = true`
- [x] Any admin API 401 triggers logout and shows "Sesión expirada" on login page
- [x] Legacy paste-token fallback remains available
- [x] `npm run typecheck` passes with 0 errors
- [x] Backend tests cover admin-role gate, OTP flow, and 403 for regular users
