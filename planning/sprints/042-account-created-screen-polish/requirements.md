# Sprint 042 — AccountCreated Screen Polish: Requirements

## Goal

Personalize the post-signup welcome screen with the user's real name from the auth store, add a privacy consent footnote, and upgrade text colors to theme-aware values.

## Scope

- Subscribe to `user` from auth store.
- Derive `firstName` from `user?.name?.trim().split(' ')[0]`.
- Title: `"¡Hola, {firstName}!"` when name present, `"¡Listo!"` as fallback.
- Add privacy consent footnote below buttons using `PRIVACY_PAGE_URL` from `constants/links`.
- Upgrade text colors from `colors.*` fixed values to `theme.fg / theme.fg2 / theme.fg3` for dark-mode correctness.
- Remove unused `colors` import.

## Out of Scope

- No user-editable name field.
- No new screen, store action, or backend endpoint.
- No payment logic or infrastructure changes.

## Acceptance Criteria

- Title personalizes when `user.name` is set.
- Title falls back to `"¡Listo!"` when name is null/undefined.
- Consent footnote present below action buttons.
- Privacy link tappable when `PRIVACY_PAGE_URL` non-empty; plain text when empty.
- `npm run typecheck` passes with 0 errors.
