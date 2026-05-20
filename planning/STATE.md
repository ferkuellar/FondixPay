# Project State

Updated: 2026-05-20

Current phase: Phase 4A - Auth & Session Security P0 (completed).

Status: MVP mock/dev mobile app with a shared visual design system and targeted auth/session P0 hardening completed. Backend payment semantics remain mock/dev. Product is not production-ready.

## Phase Status

- Phase 0 - Product Definition: completed.
- Phase 1 - AXON-AI Alignment & Project Operating Pack: completed.
- Phase 2 - Technical Architecture Hardening: completed as audit/documentation baseline.
- Phase 3 - UI/UX Production System: completed (see `planning/sprints/003-ui-ux-production-system/COMPLETION_REPORT.md` for caveats).
- Phase 4A - Auth & Session Security P0: completed; closes P0 auth/session risks around OTP dev leakage and weak JWT config outside development.
- Next phase: Phase 4B - Backend Safety & Test Foundation.

## What Exists

- `mobile/`: Expo, React Native, TypeScript application with design tokens under `mobile/src/theme/`.
- Reusable UI components under `mobile/src/components/` (buttons, inputs, OTP, service cards, states, tab bar).
- Visual alignment to `references/01-14*.png` (per-screen mockups).
- `AccountCreated` screen after first OTP sign-in.
- Multi-step `AddService` UI (list → number → confirm + save tip).
- Custom bottom tab bar on Home, AddService, History, Profile (stack navigation preserved).
- `backend/`: FastAPI application with domain modules (unchanged in Sprint 003).
- Phone login flow.
- Development OTP `123456` (6-digit UI per ADR-012).
- Mock service providers, payments, receipts, history.
- Docker Compose with PostgreSQL and backend.
- Mobile `npm run typecheck` passes.
- Auth config validates production-like environments for strong JWT secret, explicit CORS, and disabled dev OTP responses.
- Backend auth tests cover OTP dev response gating, weak JWT config rejection, invalid token handling, valid `/auth/me`, and wrong OTP failure.

## What Is Missing

- Refresh tokens, server-side session inventory, token revocation, device trust, and auth audit logs.
- Formal financial ledger.
- Audit logs for financial and administrative actions.
- Documented and implemented permissions/RBAC.
- Automated backend and mobile tests.
- CI/CD pipelines.
- Real payment provider decision and integration.
- Production splash illustration asset (placeholder in app per ADR-015).
- Real payment method selection (UI is static demo on ServiceDetail).
- Native tab navigator (custom tab bar only).
- Compliance strategy, observability, store release readiness.

## Phase 3 Caveats

- OTP mockups show 4 digits; app uses 6 per ADR-012.
- Splash central illustration is a labeled placeholder until asset delivery.
- `11-payment.png` visual split: `ServiceDetail` (pay + static card UI) and `ConfirmPayment` (summary confirm).
- Payment failure UI is local to confirm screen; mock `payService` still always succeeds unless service missing.
- Home loading state not wired (services are local Zustand seed data).

## Boundary

The current repo must not be considered production financial software. It is a governed MVP mock/dev base.
