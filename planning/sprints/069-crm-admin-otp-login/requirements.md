# Sprint 069 — CRM Admin OTP Login + 401 Session Recovery

## Problem

The CRM admin login screen requires users to manually paste a JWT bearer token into a textarea. This has several critical issues:

1. No one can log in without manual token generation via docker/CLI — unusable in production.
2. `isAuthenticated` requires both `token && role`, but role is never returned by the backend — in non-dev mode, the CRM is completely inaccessible even with a valid token.
3. No 401 handling — when the 60-min JWT expires, all API calls fail silently with no recovery path.
4. The paste-token flow is a security anti-pattern (clipboard exposure, no audit trail).

## Goal

Replace the paste-token form with a real two-step OTP login flow. Add backend admin auth endpoints that gate on admin role. Handle 401s globally so expired sessions are caught and redirected to login.

## Scope

### Backend — new file `backend/app/modules/admin/auth_routes.py`

- `POST /admin/auth/request-otp` — validates phone exists in DB AND has an admin role before sending OTP. Returns `{message, expires_in_seconds, otp_dev?}`. Does NOT create new users.
- `POST /admin/auth/verify-otp` — verifies OTP, re-validates admin role, returns `{access_token, role, expires_in}`.

Register under `prefix="/admin/auth"` in `main.py`. No migration needed (reuses existing `users` table and OTP mechanics).

### Frontend

- `adminClient.ts`: add `adminRequestOtp(phone)` and `adminLogin(phone, otp)` methods. Accept optional `on401?: () => void` callback in `createAdminClient` — called when any protected request returns 401.
- `useAdminApi.ts`: pass `auth.logout` as the `on401` callback.
- `LoginPage.tsx`: two-step form — Step 1: phone input → `adminRequestOtp` → Step 2: OTP input → `adminLogin` → `signIn(token, role)`. Keep legacy paste-token as a collapsible fallback for emergency ops.

## Out of scope

- Password-based admin login
- Admin-specific OTP delivery channel (reuses existing OTP mechanism)
- Session refresh / token rotation
- Token expiry warning banner
- New database tables or migrations
- Rate limiting on admin auth (covered by existing OTP rate limiting)

## Acceptance criteria

- [ ] `POST /admin/auth/request-otp` returns 400 for non-existent or non-admin phone
- [ ] `POST /admin/auth/request-otp` returns OTP response for a SUPER_ADMIN phone
- [ ] `POST /admin/auth/verify-otp` returns `{access_token, role}` after correct OTP
- [ ] `POST /admin/auth/verify-otp` returns 400 for wrong OTP
- [ ] `POST /admin/auth/verify-otp` returns 403 if user is not admin role
- [ ] CRM login page shows phone input → OTP input two-step flow
- [ ] After successful OTP login, `isAuthenticated = true` and CRM is accessible
- [ ] Any admin API 401 triggers logout and shows "Sesión expirada" on login page
- [ ] Legacy paste-token fallback remains available as a collapsed section
- [ ] `npm run typecheck` in `admin/` passes with 0 errors
- [ ] Backend tests cover admin-role gate, OTP flow, and 403 for regular users
