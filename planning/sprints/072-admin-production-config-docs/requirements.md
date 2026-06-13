# Sprint 072 — Admin Panel Production Config & Docs

**Goal:** Close the config and documentation gaps left after sprints 068–071 so the admin panel has an honest, deploy-safe local env setup and accurate documentation.

## Background

After the CRM completion series (068–071), several gaps remain:

- `admin/src/api/authClient.ts` contains a hardcoded `http://localhost:8000` fallback that would silently route to localhost if `VITE_API_BASE_URL` is unset in a production build.
- `admin/.env` is missing `VITE_API_BASE_URL`, so local dev relies on the authClient.ts localhost hardcode rather than an explicit config entry.
- `admin/.env.example` only shows dev config; it lacks production guidance or security notes.
- `admin/README.md` is stale: it describes the old paste-token login (pre-069), omits ~10 CRM modules added across phases 10A–10X.2, and has no production env guidance.

## Scope

### Code fix
- `admin/src/api/authClient.ts` — change `?? "http://localhost:8000"` to `?? ""` (same pattern as `adminClient.ts`). When `VITE_API_BASE_URL` is unset and the value is `""`, fetch uses relative paths, which is correct for a production build served from the same origin.

### Config files
- `admin/.env` — add `VITE_API_BASE_URL=http://localhost:8000` so local dev is explicit
- `admin/.env.example` — expand to two documented sections: dev config and production config guidance

### Documentation
- `admin/README.md` — rewrite to reflect:
  - Current OTP login flow (sprint 069)
  - All current CRM modules (dashboard, users, payments, receipts, support tickets, manual review, reconciliation placeholders, audit logs, fraud signals, disputes, notification deliveries, search, chat operations, bot de landing, analytics)
  - Environment variable table with dev/production values and security notes
  - Production deploy notes (build command, origin, VITE_ENABLE_ADMIN_DEV_AUTH must be false)

## Acceptance criteria
- [ ] `authClient.ts` uses `?? ""` — no localhost hardcode
- [ ] `admin/.env` includes `VITE_API_BASE_URL`
- [ ] `admin/.env.example` documents dev and production variable sets with security notes
- [ ] `admin/README.md` module list is accurate and login section reflects OTP flow
- [ ] `npm run typecheck` — 0 errors

## Out of scope
- No new endpoints
- No backend changes
- No new CRM views
- No migration to a different auth model
