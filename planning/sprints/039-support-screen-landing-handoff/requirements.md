# Sprint 039 — Support Screen Landing Handoff: Requirements

## Goal

Update `SupportPlaceholderScreen` to bridge mobile recovery UX to the public landing pages created in Sprints 035 and 036. Create a single-source `links.ts` constants file for all public URL constants.

## Scope

- Create `mobile/src/constants/links.ts` with empty-string URL constants for `SUPPORT_PAGE_URL`, `CONTACT_PAGE_URL`, `PRIVACY_PAGE_URL`, and `TERMS_PAGE_URL`.
- Update `SupportPlaceholderScreen`:
  - Improve title and body copy.
  - Add conditional `Linking.openURL` link to support page (shown only when `SUPPORT_PAGE_URL` is non-empty).
  - Show "Próximamente: página de soporte en línea" when URL is empty.
  - Keep reference IDs, mock/dev notice, and "VOLVER AL INICIO" button.
  - Extract `ReferenceRow` helper component.

## Out of Scope

- No hardcoded unconfirmed URL.
- No new screen, store, or backend endpoint.
- No payment logic or infrastructure changes.
- `Linking` is a React Native built-in — no new dependency.

## Acceptance Criteria

- `links.ts` exists with four empty URL constants and clear pending comments.
- Support screen title is "¿Necesitas ayuda?".
- Conditional link renders only when `SUPPORT_PAGE_URL` is non-empty.
- Reference IDs block unchanged.
- `npm run typecheck` passes with 0 errors.
