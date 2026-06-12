# Sprint 049 — ErrorState Audit: Requirements

## Goal

Audit all usages of the `ErrorState` component across the mobile app for consistent messaging, presence of retry actions, and absence of developer jargon exposed to users.

## Context

Sprint 048 established a pattern for contextual empty states. Sprint 049 extends that discipline to error states — ensuring that every `ErrorState` gives the user a way to recover when a recovery action is available.

## Scope

- Audit all 4 `ErrorState` usages: NotificationsScreen, HistoryScreen, ConfirmPaymentScreen, AddServiceScreen.
- Add `onRetry={() => void fetchNotifications()}` to NotificationsScreen — the only case with a missing retry where a retry action exists.
- Fix accent typo in `serviceCatalogStore.ts`: `'No pudimos cargar las categorias.'` → `'No pudimos cargar las categorías.'`
- Document HistoryScreen `historyError` as a dead path (no `fetchHistory` action exists in the mock store).

## Out of Scope

- No changes to `ErrorState` component API.
- No new store actions, screens, backend endpoints, or payment logic.
- HistoryScreen: no fix possible — dead path by design in current mock implementation.

## Acceptance Criteria

- NotificationsScreen `ErrorState` has `onRetry` wired to `fetchNotifications`.
- "categorias" typo corrected in `serviceCatalogStore`.
- `npm run typecheck` and `npm run lint` pass with 0 errors.
