# Sprint 072 — Completion Report

**Date:** 2026-06-13  
**Status:** DONE

## What changed

### Code fix
- **`admin/src/api/authClient.ts`** — changed `?? "http://localhost:8000"` to `?? ""`. Matches the pattern in `adminClient.ts`. When `VITE_API_BASE_URL` is unset, fetch now uses relative paths (correct for a production build served from the same origin) instead of silently routing to localhost.

### Config files
- **`admin/.env`** — added `VITE_API_BASE_URL=http://localhost:8000`. Local dev no longer depends on the authClient.ts localhost hardcode.
- **`admin/.env.example`** — rewritten with two documented sections: local development config and production/staging guidance. Security note added: `VITE_ENABLE_ADMIN_DEV_AUTH` must be `false` or absent in production.

### Documentation
- **`admin/README.md`** — full rewrite:
  - Setup section updated (`cp .env.example .env`).
  - Environment variable table added with required/default/production columns.
  - Login section updated to reflect OTP two-step flow (sprint 069), session expiry redirect, and emergency paste-token fallback.
  - Roles table: `SUPER_ADMIN`, `ADMIN`, `SUPPORT`, `FINANCE`, `AUDITOR`.
  - Module list updated from 8 → 14 entries, now including Fraud Signals, Disputes, Audit Logs, Notifications, Search, Chat Operations, Bot de Landing, and Dashboard Analytics.
  - Commands section.
  - Security notes section (HTTPS requirement, dev auth gate, sessionStorage scoping, audit trail, no PAN/secrets exposure).

## Validation
- `npm run typecheck` — 0 errors
- No backend changes, no migrations, no new endpoints

## Acceptance criteria

- [x] `authClient.ts` uses `?? ""` — no localhost hardcode
- [x] `admin/.env` includes `VITE_API_BASE_URL`
- [x] `admin/.env.example` documents dev and production variable sets with security notes
- [x] `admin/README.md` module list is accurate and login section reflects OTP flow
- [x] `npm run typecheck` — 0 errors
