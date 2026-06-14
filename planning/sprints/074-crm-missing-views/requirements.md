# Sprint 074 — CRM Missing Views: Manual Review, Fraud, Disputes, Notifications

## Objective

Wire four backend-backed CRM modules that already have complete API coverage but are unreachable
from the admin panel — no nav entries, no view functions, no routes in the CRM shell.

## Scope

### What exists (backend ready, frontend missing)
- `GET/PATCH /admin/manual-review` — ManualReviewCase list + update
- `GET/PATCH /admin/fraud/signals` — FraudSignal list + status update
- `GET/PATCH /admin/disputes` — DisputeCase list + status update + evidence
- `GET /admin/notifications/deliveries` — AdminNotificationDelivery list (read-only)

All 4 modules have TypeScript types in `admin/src/types/admin.ts` and client methods in
`admin/src/api/adminClient.ts`.

### Frontend changes (CrmVisualApp.tsx only)
1. Expand `ModuleKey` union with `"fraud" | "disputes" | "manual-review" | "notifications"`
2. Add routes for each module
3. Add nav entries:
   - **Operación** group: `manual-review` (Revisión manual) and `notifications` (Notificaciones)
   - New **Riesgo** group: `fraud` (Señales fraude) and `disputes` (Disputas)
4. Add `renderView()` cases for all 4
5. Add 4 view functions: `ManualReviewView`, `FraudView`, `DisputesView`, `NotificationsView`
6. Update imports

### No backend changes
All APIs are implemented and tested. No new permissions, migrations, or routes needed.

## Acceptance criteria
- [ ] `ManualReviewView` loads cases from `/admin/manual-review`
- [ ] `FraudView` loads signals from `/admin/fraud/signals`
- [ ] `DisputesView` loads disputes from `/admin/disputes`
- [ ] `NotificationsView` loads deliveries from `/admin/notifications/deliveries`
- [ ] All 4 modules visible in nav and navigable via hash routes
- [ ] `npm run typecheck` passes with 0 errors
