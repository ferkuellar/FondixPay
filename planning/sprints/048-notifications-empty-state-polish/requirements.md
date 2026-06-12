# Sprint 048 — Notifications Empty State Polish: Requirements

## Goal

Replace the vague, dev-jargon empty state copy in NotificationsScreen with contextual copy that tells users what notifications are for and when they will appear.

## Context

The current empty state reads "Aqui veras avisos demo, pendientes de prueba y comprobantes de prueba no disponibles." — it has a typo, uses internal dev terminology, and gives users no useful guidance. History (Sprint 043) established the pattern for contextual empty states. Notifications has no filter, so only one empty condition exists.

## Scope

- Update `NotificationsScreen.tsx` `EmptyState`:
  - Add `emoji="🔔"`.
  - Replace `message` with "Cuando realices un pago, aquí verás los avisos y estados de tus operaciones."
  - Keep `title="Sin notificaciones"`.
- No `action` prop — notifications appear as a result of payment activity; no direct user action triggers them.

## Out of Scope

- No condition split (no filter in NotificationsScreen).
- No store, component, backend, or navigation changes.

## Acceptance Criteria

- Empty state shows 🔔 emoji and contextual message.
- No dev-jargon or typos in copy.
- `npm run typecheck` and `npm run lint` pass with 0 errors.
