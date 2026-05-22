# Phase 10C Blueprint

## Frontend Shape

- Separate `admin/` SPA with React, Vite, TypeScript, CSS, and hash-based internal navigation.
- `fetch` API client configured by `VITE_API_BASE_URL`.
- Session starts from an existing bearer token; frontend dev role is explicitly env-controlled until dedicated admin auth exists.

## Operational Surface

- App shell with role/environment topbar and permission-filtered sidebar.
- Read-mostly data pages with tables, filters, detail views, safe status badges, and standardized loading/error/empty states.
- Controlled ticket and manual-review updates with confirmation prompts.
- Placeholder reconciliation pages that preserve card processor and Prontipagos separation.
