# Sprint 043 — History Empty State Polish: Requirements

## Goal

Distinguish between two different empty states in HistoryScreen — no payments at all vs. active filter returning zero — and provide a contextual CTA for first-run users.

## Problem

A single `EmptyState` handled both situations with identical copy and no action, giving new users no guidance on what to do next.

## Scope

- Split condition: `payments.length === 0` (truly empty) vs. `payments.length > 0 && filtered.length === 0` (filter mismatch).
- First-run empty: title "Aún no hay movimientos", message guiding user to add a service, `PrimaryButton` → `AddService`.
- Filter mismatch: title "Sin resultados", message "No hay pagos demo que coincidan con este filtro.", no action.
- Use existing `EmptyState` `action` prop — no new component needed.

## Out of Scope

- No store change, no new component, no backend call.
- No payment logic or infrastructure changes.

## Acceptance Criteria

- New user with zero payments sees "Aún no hay movimientos" with AddService CTA.
- User with payments but active filter returns zero sees "Sin resultados".
- `npm run typecheck` passes with 0 errors.
