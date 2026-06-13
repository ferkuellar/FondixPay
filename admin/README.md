# FondixPay CRM Admin

Internal web console for FondixPay support, finance, audit, and operations. Built over the `/admin/*` backend API introduced in phases 10A–10X.2.

This panel is for internal operators only. It does not make FondixPay production-ready and must not be exposed publicly.

---

## Setup

```powershell
cd admin
npm install
cp .env.example .env   # then edit .env with your local values
npm run dev
```

---

## Environment Variables

| Variable | Required | Dev default | Production |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:8000` | `https://api.fondixpay.com` |
| `VITE_ENABLE_ADMIN_DEV_AUTH` | No | `true` | **`false`** |
| `VITE_ADMIN_DEV_ROLE` | No | `SUPER_ADMIN` | _do not set_ |

### `VITE_ENABLE_ADMIN_DEV_AUTH`

Development-only shortcut that pre-sets an admin role in the browser so you can navigate the CRM without completing the OTP login flow. The backend still authorizes every request with the bearer token and per-permission RBAC — this flag only affects the frontend session display.

**Must be `false` or absent in production and staging.** The "DEV AUTH habilitado" warning banner in the CRM topbar appears whenever this flag is `true`.

---

## Login

The admin panel uses a two-step OTP login:

1. Enter the admin phone number.
2. Receive a 6-digit OTP (SMS in production; `123456` in dev via `POST /admin/auth/request-otp` response body).
3. Enter the OTP to get a session token + role from the backend.

The session is stored in `sessionStorage` (tab-scoped, cleared on close). A 401 response from any admin API call automatically invalidates the session and redirects to login with `?expired=1`.

A collapsible "Acceso manual (emergencia)" section on the login page accepts a raw bearer token as a fallback for recovery scenarios.

---

## Roles

| Role | Access |
|---|---|
| `SUPER_ADMIN` | All modules and writes |
| `ADMIN` | Most modules, limited destructive actions |
| `SUPPORT` | Tickets, manual review, user lookup |
| `FINANCE` | Payments, receipts, reconciliation |
| `AUDITOR` | Read-only audit logs, payments, receipts |

The backend is the authorization source of truth. Frontend role checks only affect navigation visibility — never rely on them for access control.

---

## Current Modules

| Module | Route | Description |
|---|---|---|
| Dashboard | `#/` | KPI grid, operational alerts, payment trend chart, category volume, hourly traffic |
| Usuarios | `#/users` | User list with search, status filter, and detail |
| Pagos | `#/payments` | Payment list with status filter and detail |
| Comprobantes | `#/receipts` | Receipt list with user/payment filter and detail |
| Tickets de soporte | `#/tickets` | Support ticket kanban: open, in-progress, waiting, resolved |
| Revisión manual | `#/manual-review` | Manual review case list, assignment, and resolution |
| Señales de fraude | `#/fraud` | Fraud signal list, severity, review, and escalation |
| Disputas | `#/disputes` | Dispute/chargeback list, evidence upload, status |
| Conciliación tarjeta | `#/reconciliation-card` | Card reconciliation placeholder |
| Logs de auditoría | `#/audit` | Audit event log with type/actor/entity filter |
| Notificaciones | `#/notifications` | Notification delivery log with status/template filter |
| Búsqueda | `#/search` | Cross-entity search (users, payments, receipts, tickets, correlation IDs) |
| Chat Operations | `#/chat-operations` | Escalated chat conversation queue, transcript, severity, ticket linking |
| Bot de Landing | `#/bot` | Chatbot FAQ/intent/knowledge management, settings, fallback review |

No page may render PAN, CVV, card tokens, secrets, raw provider payloads, or `CHATBOT_AI_API_KEY`.

---

## Commands

```powershell
npm run dev        # start dev server at http://localhost:5173
npm run typecheck  # tsc --noEmit (must be 0 errors)
npm run build      # production build output to dist/
npm run lint       # ESLint
```

---

## Security Notes

- The admin panel must only be served over HTTPS in production.
- `VITE_ENABLE_ADMIN_DEV_AUTH` must be `false` in all non-local environments.
- Sessions are tab-scoped (`sessionStorage`) and expire on tab close.
- All writes to backend admin endpoints are audited server-side.
- The panel does not store or display raw card data, provider secrets, or `CHATBOT_AI_API_KEY` at any point.
