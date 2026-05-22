# FondixPay CRM Admin

Internal web console for FondixPay support, finance, audit, and operations work over the Phase 10B `/admin/*` backend APIs.

This app is separate from the Expo mobile app. It is still mock/dev work and does not make FondixPay production ready.

## Setup

```powershell
cd admin
npm install
```

Copy `.env.example` values into your local environment tooling when needed:

- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_ENABLE_ADMIN_DEV_AUTH=true`
- `VITE_ADMIN_DEV_ROLE=SUPER_ADMIN`

`VITE_ENABLE_ADMIN_DEV_AUTH` is development-only. It controls frontend navigation role simulation while the backend still authorizes every request with the bearer token and `/admin/*` permissions. Do not use that mode as production admin authentication.

## Run

```powershell
npm run dev
npm run typecheck
npm run build
```

## Access Model

The current login surface accepts an existing backend bearer token. Backend admin auth hardening and MFA remain future work.

Roles currently represented in the UI:

- `SUPPORT`
- `FINANCE`
- `ADMIN`
- `AUDITOR`
- `SUPER_ADMIN`

The frontend hides navigation and writes that the configured role does not permit, but the backend remains the authorization source of truth.

## Current Modules

- Dashboard.
- Users list/detail.
- Payments list/detail.
- Receipts list/detail.
- Support tickets list/detail/create/update/note.
- Manual review list/detail/update.
- Card and Prontipagos reconciliation placeholders.
- Audit logs list.

No page may render PAN, CVV, card tokens, secrets, or raw provider payloads.
