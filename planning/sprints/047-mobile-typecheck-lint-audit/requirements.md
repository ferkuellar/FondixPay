# Sprint 047 — Mobile Typecheck + Lint Audit: Requirements

## Goal

Establish ESLint for the mobile project and resolve all existing lint and type warnings, eliminating accumulated technical debt and enforcing code quality rules on all future changes.

## Context

The mobile project had `tsc --noEmit` passing with strict mode since early sprints but had never configured ESLint. No lint rules were enforced for unused imports, array type style, or React hooks exhaustive deps.

## Scope

- Install `eslint` and `eslint-config-expo` as dev dependencies.
- Create `mobile/eslint.config.js` using `eslint-config-expo/flat` (ESLint v9 flat config format).
- Add `"lint"` and `"lint:fix"` scripts to `mobile/package.json`.
- Run auto-fix to clear fixable issues.
- Manually remove all unused imports surfaced by lint.
- Validate: 0 errors, 0 warnings, `npm run typecheck` 0 errors.

## Out of Scope

- No logic, store, screen, component, backend, or payment changes.
- No lint rule customizations beyond the `eslint-config-expo` defaults.
- No dependency upgrades.

## Acceptance Criteria

- `npm run lint` exits 0 with 0 errors and 0 warnings.
- `npm run typecheck` exits 0.
- ESLint is configured and both scripts are in `package.json`.
