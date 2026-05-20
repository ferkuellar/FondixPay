# Technical Hardening Audit

Updated: 2026-05-19

Phase: Phase 2 - Technical Architecture Hardening.

Scope: audit and document the existing technical baseline. No product features, real payments, KYC, wallet, admin console, route rewrites, mobile navigation changes, or database model changes were implemented.

## Executive Summary

FondixPay has a coherent initial MVP structure: Expo/React Native mobile app, FastAPI backend, SQLAlchemy persistence, domain modules, Docker Compose, and AXON-AI governance files. The current flow remains mock/dev and should not be used for real financial operations.

The backend imports successfully, `/health` responds, Swagger/OpenAPI loads, and the mobile TypeScript typecheck passes after installing dependencies. The largest blockers for production are security and financial controls: development OTP returned to the client, default JWT secret fallback, no rate limiting, no formal RBAC, no audit logs, no ledger, no payment idempotency/reconciliation, no automated backend tests, and dependency audit findings in the mobile Expo toolchain.

## Phase 1 Alignment Status

Required AXON-AI files were found locally and in the current HEAD inspected during this phase:

- `AGENTS.md`
- `CODEX.md`
- `CLAUDE.md`
- `planning/STATE.md`
- `planning/DECISIONS.md`
- `planning/DOMAIN.md`
- `planning/RISKS.md`
- `planning/QUESTIONS.md`
- `planning/ROADMAP.md`
- `planning/sprints/002-technical-architecture-hardening/requirements.md`
- `planning/sprints/002-technical-architecture-hardening/blueprint.md`
- `planning/sprints/002-technical-architecture-hardening/acceptance.md`

## Backend State

Backend stack:

- FastAPI.
- SQLAlchemy.
- Pydantic settings.
- JWT via `python-jose`.
- PostgreSQL through Docker Compose, with SQLite fallback in settings.
- Alembic scaffold exists.

Backend entry point:

- `backend/app/main.py` creates tables with `Base.metadata.create_all(bind=engine)`.
- Routers are registered for auth, users, service providers, user services, payments, receipts, and notifications.
- CORS uses `settings.cors_origins_list`.
- `/health`, `/docs`, and `/openapi.json` validate through `TestClient`.

Domain structure is reasonable for an MVP: modules contain routes, schemas, models, repositories, and services where needed. The payment flow is intentionally mock through `AggregatorMockClient`.

## Mobile State

Mobile stack:

- Expo 52.
- React Native 0.76.
- TypeScript strict mode.
- React Navigation native stack.
- Zustand stores.
- Expo Secure Store.

Mobile architecture is clear: screens, navigation, API clients, stores, theme, and shared types are separated. `authStore` persists the access token in Secure Store and restores session through `/auth/me`.

TypeScript validation passed with `npm run typecheck` after `npm install`.

## Docker State

`docker-compose.yml` provides:

- PostgreSQL 16 Alpine.
- Backend service built from `./backend`.
- Development database defaults.
- Postgres healthcheck.
- Backend depends on healthy Postgres.

Risk: Docker uses `.env.example` as `env_file`, which is acceptable for local/dev but should be replaced by environment-specific `.env`/secret management before staging or production.

## Configuration State

`.env.example` exists and contains development placeholders:

- `DATABASE_URL`.
- `JWT_SECRET_KEY=change-me-in-local-env`.
- `OTP_DEV_CODE=123456`.
- `APP_ENV=development`.
- `CORS_ORIGINS`.
- Docker Postgres defaults.
- `EXPO_PUBLIC_API_URL`.

Risk: `backend/app/core/config.py` also has fallback defaults for `jwt_secret_key`, `otp_dev_code`, SQLite DB, and CORS. These are acceptable for local development but must be blocked or validated in non-development environments.

## Security State

Current security posture is development-only:

- OTP code is development/mock and is returned in the `/auth/request-otp` response as `otp_dev`.
- JWT tokens have expiration but no refresh, revocation, rotation, or device/session tracking.
- No rate limiting is implemented for OTP or sensitive payment endpoints.
- No audit logs are implemented for auth, service, payment, receipt, or admin actions.
- No formal RBAC is implemented.
- CORS is setting-driven and not wildcard, but environment validation is missing.
- No real secrets were found in `.env.example`; placeholders exist.

## Authentication State

Current auth flow:

1. User requests OTP by phone.
2. Backend stores the dev OTP in an in-memory dict with 5-minute TTL.
3. Backend returns the dev OTP in response.
4. User verifies OTP.
5. Backend creates or fetches user and returns JWT.
6. Mobile stores JWT in Secure Store.

This is acceptable only for mock/dev. It cannot move to production as-is.

## Database State

Current database posture:

- SQLAlchemy `SessionLocal` and `get_db` are conventional.
- SQLite fallback is configured.
- PostgreSQL is configured in `.env.example` and Docker.
- Alembic scaffold exists, but no real migration history was added during this audit.
- `Base.metadata.create_all(bind=engine)` runs on import/startup.

Production risk: automatic table creation at startup bypasses migration discipline and can mask schema drift.

## API State

Observed routes:

- `/auth/request-otp`
- `/auth/verify-otp`
- `/auth/me`
- `/auth/logout`
- `/users/me`
- `/service-providers`
- `/service-providers/category/{category}`
- `/service-providers/{provider_id}`
- `/user-services`
- `/user-services/{service_id}`
- `/payments`
- `/receipts`
- `/notifications`
- `/health`

Protected user-specific domains:

- `user-services`: protected and queried by current user.
- `payments`: protected and listed by current user.
- `receipts`: protected and listed by current user.
- `notifications`: protected and listed by current user.

Public catalog:

- `service-providers` is public read-only in current code. That can be acceptable for a service catalog, but mutations must remain admin-only if added later.

## Testing State

Executed:

- `python -m compileall app` from `backend`: passed.
- FastAPI import and route listing: passed.
- `TestClient` checks for `/health`, `/docs`, and `/openapi.json`: all returned 200.
- `npm install` from `mobile`: completed; reported 8 vulnerabilities.
- `npm run typecheck` from `mobile`: passed.
- `npm audit --audit-level=moderate` from `mobile`: failed as expected due to 8 reported vulnerabilities.

Not executed:

- Persistent `uvicorn app.main:app --reload`: not left running; validated through import and `TestClient` instead.
- `npx expo start`: not left running; typecheck and dependency install were used for non-interactive validation.
- Backend unit/API tests: no test suite exists yet.

## Documentation State

AXON-AI governance docs exist. This audit adds the technical hardening report and updates Sprint 002 scope/acceptance evidence.

## Findings by Severity

### SEV-1 Critical

None found in this documentation-only phase that proves immediate data exposure or live money movement. Real payments are not connected.

### SEV-2 High

- Development OTP is returned to the client in `/auth/request-otp`; production must never return OTP values.
- JWT secret has insecure default fallback in config; non-development startup should fail without a strong secret.
- No rate limiting exists for OTP or payment-sensitive endpoints.
- No audit logs exist for login, OTP, service changes, payments, receipts, or future admin actions.
- No ledger/idempotency/reconciliation foundation exists for future real payments.
- `Base.metadata.create_all(bind=engine)` runs at startup and should be replaced by migration discipline before production.
- Mobile dependency audit reports high vulnerabilities in transitive Expo tooling dependencies.

### SEV-3 Medium

- No automated backend test suite.
- No CI/CD validation.
- No formal RBAC implementation.
- No structured logging, metrics, or error tracking.
- Error handling relies mostly on default FastAPI behavior and local exceptions.
- Docker uses `.env.example` directly for backend local config.
- Access token lifecycle lacks refresh/revocation/session inventory.

### SEV-4 Low

- Service provider catalog is public read-only; acceptable now, but document admin-only write rule before mutations.
- API response envelope is not standardized yet.
- Mobile loading/error states exist in parts of the app but need systematic UI/UX audit in Phase 3.
- `npm install` initially exceeded a short timeout but completed on retry.

### SEV-5 Improvement

- Add backend test scaffolding.
- Add Makefile/task scripts for common validation.
- Add dependency audit cadence.
- Add OpenAPI documentation review.
- Add architecture diagrams once implementation stabilizes.

## Ordered Recommendations

1. Keep Phase 2 documentation as baseline and do not start real payment work yet.
2. Add backend tests for auth, protected endpoints, service ownership, payment mock, receipts, and `/health`.
3. Replace startup table creation with Alembic migration workflow for non-local environments.
4. Add environment validation that blocks insecure defaults outside development.
5. Add rate limiting and abuse controls around OTP.
6. Remove `otp_dev` from production responses behind explicit environment gating.
7. Define audit event model and implement audit logs before any real provider integration.
8. Define RBAC route matrix and ownership tests.
9. Review Expo dependency upgrade path rather than applying `npm audit fix --force` blindly.
10. Add CI checks for backend import/tests and mobile typecheck.

## Prioritized Technical Backlog

### P0 - Production Blockers

- Block insecure config defaults in staging/production.
- Remove returned OTP values outside development.
- Add OTP rate limiting.
- Add audit log foundation.
- Replace `create_all` startup behavior with migration policy.
- Add ownership/security tests for protected routes.

### P1 - Hardening

- Add backend test suite.
- Add CI for backend and mobile validation.
- Add RBAC model and permission matrix enforcement.
- Add structured logging and request correlation.
- Add API error response standard.
- Add token/session revocation strategy.

### P2 - Quality

- Add mobile API error taxonomy.
- Add systematic loading/empty/error state coverage.
- Add dependency audit process.
- Add Docker environment split for local/dev/staging.
- Add deployment checklist.

## Before Production

FondixPay must have:

- Production authentication and OTP delivery.
- Strong secret management.
- RBAC and backend authorization enforcement.
- Audit logs.
- Ledger and reconciliation design before real money.
- Payment provider sandbox integration only after provider decision.
- Automated tests.
- CI/CD.
- Observability.
- Incident and rollback plan.
- Compliance/legal review if wallet, stored value, SPEI, KYC, or regulated financial operations are introduced.
