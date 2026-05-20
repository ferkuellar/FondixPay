# Sprint 002 - Technical Architecture Hardening Blueprint

## Proposed Work Order

1. Read `AGENTS.md`, `planning/STATE.md`, `planning/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, and this sprint.
2. Inspect backend app structure and router dependencies.
3. Inspect database/session lifecycle and Alembic posture.
4. Inspect auth, JWT, OTP, CORS, and error behavior.
5. Inspect mobile API client, stores, Secure Store usage, and navigation assumptions.
6. Inspect `.env.example`, Docker Compose, and dependency files.
7. Run backend smoke checks/tests if available.
8. Run mobile typecheck if dependencies are installed or document why not.
9. Apply minimal hardening only when it does not create new product scope.
10. Update `planning/DECISIONS.md`, `docs/SECURITY.md`, or `docs/ARCHITECTURE.md` if durable decisions are made.
11. Create `docs/TECHNICAL_HARDENING_AUDIT.md` with findings by severity and prioritized backlog.

## Validation Evidence Captured

- Backend Python compilation with `python -m compileall app`.
- FastAPI app import and route listing.
- `TestClient` validation for `/health`, `/docs`, and `/openapi.json`.
- Mobile dependency installation with `npm install`.
- Mobile TypeScript validation with `npm run typecheck`.
- Mobile dependency audit with `npm audit --audit-level=moderate`.

## Candidate Focus Areas

- Replace dev-only database creation strategy with migration discipline if approved.
- Ensure private endpoints have explicit auth dependencies.
- Normalize error responses.
- Harden OTP environment boundaries.
- Confirm CORS is environment-driven.
- Add first backend tests around health/auth/mock payments.
- Improve mobile API error handling.

## Guardrails

Mock payments remain mock. No real provider, KYC, wallet, or financial ledger implementation in this sprint.
