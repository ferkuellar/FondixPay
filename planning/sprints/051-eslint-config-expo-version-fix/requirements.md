# Sprint 051 — eslint-config-expo Version Fix: Requirements

## Goal

Resolve the Expo SDK 52 version mismatch warning for `eslint-config-expo` by downgrading to the version Expo expects (`~8.0.1`) and switching from ESLint v9 flat config to ESLint v8 legacy config format.

## Context

Sprint 047 installed `eslint-config-expo@56.0.4` (latest) because it has native ESLint v9 flat config support. However, Expo 52 expects `~8.0.1`, causing a warning on every Metro startup:
```
eslint-config-expo@56.0.4 - expected version: ~8.0.1
Your project may not work correctly until you install the expected versions of the packages.
```

`eslint-config-expo@8.0.1` uses legacy `.eslintrc.*` format (ESLint v8 style). Downgrading both ESLint and the config package removes the warning with no change in lint rule behavior.

## Scope

- `npm install --save-dev eslint@^8.57.0 eslint-config-expo@~8.0.1`
- Delete `mobile/eslint.config.js` (ESLint v9 flat config).
- Create `mobile/.eslintrc.js` with `extends: 'expo'` and ignore patterns.
- `lint` and `lint:fix` scripts unchanged.

## Out of Scope

- No lint rule changes — same rules, same behavior.
- No mobile code, store, backend, or payment changes.

## Acceptance Criteria

- `npm run lint` exits 0 with 0 errors and 0 warnings.
- `npm run typecheck` exits 0.
- Metro no longer shows the eslint-config-expo version warning.
- `eslint.config.js` does not exist; `.eslintrc.js` is present.
