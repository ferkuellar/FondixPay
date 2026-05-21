# Project State

Updated: 2026-05-20

Current phase: Phase 8A - Card Processor Sandbox Design.

Status: MVP mock/dev mobile app with a shared visual design system, auth/session P0 hardening, backend safety test foundation, UX/Product fintech risk register, ledger/audit foundation design, minimal backend ledger/audit/idempotency implementation, mock/dev fee transparency, explicit mock payment methods, recovery UX, demo balance/movements, and hardened mobile history/receipt detail semantics. Backend payment semantics remain mock/dev. Product is not production-ready and commercial production remains blocked.

## Phase Status

- Phase 0 - Product Definition: completed.
- Phase 1 - AXON-AI Alignment & Project Operating Pack: completed.
- Phase 2 - Technical Architecture Hardening: completed as audit/documentation baseline.
- Phase 3 - UI/UX Production System: completed (see `planning/sprints/003-ui-ux-production-system/COMPLETION_REPORT.md` for caveats).
- Phase 4A - Auth & Session Security P0: completed; closes P0 auth/session risks around OTP dev leakage and weak JWT config outside development.
- Phase 4B - Backend Safety & Test Foundation: completed; adds isolated pytest fixtures and API/security smoke coverage.
- Phase 4C - UX/Product Risk Register: completed; incorporates Senior UX/Product audit findings into decisions, risks, roadmap, validation, audit, and backlog.
- Phase 5A - Ledger & Audit Foundation Design: completed; defines ledger, audit, idempotency, payment state, provider transaction, reconciliation, and recovery design.
- Phase 5B - Ledger & Audit Implementation: completed; implements audit events, ledger models, payment intents/attempts, request IDs, state transitions, mock idempotency, Alembic migration, and backend tests.
- Phase 5C - Payment Trust & Fee Transparency: completed; implements mock/dev fee model, payment breakdown, total CTA, receipt breakdown, trust microcopy, and backend fee tests.
- Phase 5D - Payment Method Strategy: completed; documents method strategy, removes phantom-card copy, and creates payment method backlog.
- Phase 5E - Payment Method UX Mock Implementation: completed for mock/dev mobile UX.
- Phase 5F - Payment Recovery Paths: completed for mock/dev recovery UX plus blueprint.
- Phase 6A/6B - Account and Demo Balance: completed for design/demo scope.
- Phase 7 - Movements, Receipts & Transaction History Hardening: completed for mock/dev mobile projection.
- Phase 8A - Card Processor Sandbox Design: current design/documentation phase.
- Next recommended phase: Phase 8B - Prontipagos Sandbox Integration Design.

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
- Backend pytest suite covers `/health`, `/openapi.json`, auth dev flow, public provider catalog, protected endpoints, and user-scoped list boundaries.
- Backend tests use isolated in-memory SQLite fixtures and do not depend on local manual data.
- UX/Product audit is documented in `docs/UX_PRODUCT_AUDIT.md`.
- UX/Product backlog is documented in `planning/UX_PRODUCT_BACKLOG.md`.
- Ledger/audit design is documented in `docs/LEDGER_AND_AUDIT_DESIGN.md`.
- Payment state machine is documented in `docs/PAYMENT_STATE_MACHINE.md`.
- Ledger/audit backlog is documented in `planning/LEDGER_AUDIT_BACKLOG.md`.
- Backend `audit` module with append-only `AuditEvent` model and audit writer.
- Backend `ledger` module with `PaymentIntent`, `PaymentAttempt`, `LedgerAccount`, `LedgerEntry`, `ProviderTransaction`, and `ReconciliationRecord` models.
- `X-Request-ID` middleware for request traceability.
- Mock payment idempotency with optional `idempotency_key` on `POST /payments`.
- Payment state transition validator under `backend/app/modules/ledger/state_machine.py`.
- Alembic migration `20260520_0001_ledger_audit_foundation.py` for ledger/audit tables.
- Backend tests for audit events, request context, payment state machine, ledger models, payment idempotency, and payment audit integration.
- Mock/dev fee model: fixed `FONDIX_FEE_MINOR=750` centavos.
- Mobile payment detail, confirmation, success, and receipt/history surfaces show service amount, FondixPay fee, and final total.
- Backend payment response exposes `amount_minor`, `fee_minor`, `total_minor`, `currency`, `fee_label`, `fee_description`, and `is_mock`.
- `docs/PAYMENT_METHOD_STRATEGY.md` defines payment method options, recommendation, security rules, model, future APIs, and gates.
- Current mobile method label is explicit mock/dev: no real card is implied.

## What Is Missing

- Refresh tokens, server-side session inventory, token revocation, device trust, and auth audit logs.
- Production-grade ledger semantics beyond mock trace entries.
- Complete audit coverage for every auth, financial, provider, and future admin action.
- Provider-grade idempotency around real provider submission.
- Real provider transaction tracking.
- Reconciliation execution and manual review workflow.
- Documented and implemented permissions/RBAC.
- CI/CD pipelines.
- Real payment provider decision and integration.
- Production splash illustration asset (placeholder in app per ADR-015).
- Real payment method add/select/change implementation.
- Payment recovery path for failed/uncertain payments.
- Support/reclamation path for payment issues.
- Receipt download/share proof semantics.
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

Commercial production with real money is blocked by remaining UX/Product criticals, incomplete production-grade ledger/audit semantics, missing real payment method implementation, missing recovery paths, missing real provider confirmation/reconciliation, and payment provider/compliance gaps.

Internal validation without real money remains allowed.

Prontipagos is not integrated. It is the next separate sandbox design leg after the card processor sandbox design. Phase 8A does not integrate it.
# Phase 5E — Payment Method UX Mock Implementation

- Current phase: Phase 5E — Payment Method UX Mock Implementation.
- Status: completed for mock/dev mobile UX.
- This phase implemented local mobile mock payment methods so the app no longer relies on a phantom card or invisible payment method.
- Real payments remain blocked.
- Prontipagos remains not integrated.
- Commercial production remains blocked.
- Next recommended phase: Phase 5F — Payment Recovery Paths.

# Phase 5F — Payment Recovery Paths

- Current phase: Phase 5F — Payment Recovery Paths.
- Mode: mock/dev mobile UX implementation plus recovery blueprint.
- Status: completed for mock/dev recovery UX with failed, pending, timeout, duplicate-blocked, retry, change-method, and support-placeholder paths.
- Dependency note: 5A, 5B, 5C, 5D, and 5E exist in the repo. 5E is currently `005e-payment-method-ux-mock-implementation`, not `005e-user-profile-kyc-onboarding-hardening`.
- Real payments remain blocked.
- Prontipagos remains not integrated.
- Commercial production remains blocked.
- Next recommended phase: Phase 6A — Account & Balance Model Design before any simulated balance implementation.

# Phase 6A — Account & Balance Model Design

- Current phase: Phase 6A — Account & Balance Model Design.
- Status: completed as architecture and documentation design only.
- This phase defines product account, demo balance, available/pending/held separation, ledger-derived movements, and future account APIs.
- No wallet real, saldo real, mobile balance UI, funding rail, withdrawal rail, bank integration, or Prontipagos integration was implemented.
- Commercial production remains blocked.
- Real payments remain blocked.
- Real wallet remains blocked.
- Next recommended phase: Phase 6B — Simulated Balance Implementation.

# Phase 6B — Simulated Balance Implementation

- Current phase: Phase 6B — Simulated Balance Implementation.
- Status: implemented for authenticated demo account, simulated balance snapshot, demo movements, and mobile display surfaces.
- Wallet real remains blocked.
- Real payments remain blocked.
- Prontipagos remains not integrated.
- Commercial production remains blocked.
- Next recommended phase: Phase 7 — Movements, Receipts & Transaction History Hardening.

# Phase 7 — Movements, Receipts & Transaction History Hardening

- Current phase: Phase 7 — Movements, Receipts & Transaction History Hardening.
- Status: implemented for mobile mock/dev history filters, recovery-attempt history projection, and receipt detail certainty copy.
- This phase hardens history, receipts, and demo movement references without connecting real provider confirmation.
- Real payments remain blocked.
- Prontipagos remains not integrated.
- Commercial production remains blocked.
- Next recommended phase: Phase 8A - Card Processor Sandbox Design.

# Phase 8A - Card Processor Sandbox Design

- Current phase: Phase 8A - Card Processor Sandbox Design.
- This phase designs the sandbox integration for the future card processor that tokenizes and charges/authenticates user debit/credit cards.
- No card processor is selected yet.
- Prontipagos remains separate and is not integrated in this phase.
- Real payments remain blocked.
- Commercial production remains blocked.
- Next recommended phase: Phase 8B - Prontipagos Sandbox Integration Design.

# Phase 8B - Prontipagos Sandbox Integration Design

- Current phase: Phase 8B - Prontipagos Sandbox Integration Design.
- This phase designs the sandbox integration for Prontipagos as the future service-payment aggregator.
- The future card processor remains separate and is not implemented here.
- Real payments remain blocked.
- Commercial production remains blocked.
- Next recommended phase: Phase 8C - Sandbox Integration Implementation.
