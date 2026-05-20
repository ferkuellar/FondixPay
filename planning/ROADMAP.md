# Roadmap

Updated: 2026-05-20

## Current Route Summary

FondixPay is currently a governed MVP mock/dev mobile app. It has AXON-AI operating documentation, a technical hardening audit, and a mobile UI/UX production system aligned to per-screen references under `references/`.

Current practical position:

- Phase 0: completed.
- Phase 1: completed.
- Phase 2: completed as audit/documentation baseline, not full hardening implementation.
- Phase 3: completed with caveats documented in `planning/sprints/003-ui-ux-production-system/COMPLETION_REPORT.md`.
- Recommended next phase: Phase 4A - Auth & Session Security P0.

Before any real payment provider work, the project must complete auth/session hardening, backend tests, audit-log foundation, and mock-payment hardening. Real payments remain blocked.

## Immediate Recommended Path

1. Phase 4A - Auth & Session Security P0.
2. Phase 4B - Backend Safety & Test Foundation.
3. Phase 5 - User Services Domain Hardening.
4. Phase 6 - Payments Mock Hardening.
5. Phase 7 - Ledger & Audit Foundation.
6. Phase 8 - Admin/Support Scope Definition.
7. Phase 9 - Payment Provider Selection.

Phase 10 real payment integration must not start before Phases 4A, 4B, 6, 7, and 9 are accepted.

## Phase 0 - Product Definition

Status: completed.
Objective: define FondixPay as a mobile-first service payment app.
Deliverables: product direction, initial mock flow, base repo.
Acceptance: README and initial implementation describe service-payment MVP.
Out of scope: real payment provider, wallet, KYC.

## Phase 1 - AXON-AI Alignment & Project Operating Pack

Status: completed.
Objective: align the existing repo with AXON-AI governance.
Deliverables: `AGENTS.md`, planning docs, architecture docs, sprint handoffs.
Acceptance: Builders can continue from file-based scope without relying on chat context.
Out of scope: feature implementation, real payments, production hardening.

## Phase 2 - Technical Architecture Hardening

Status: completed as audit baseline; hardening implementation remains pending.
Objective: review existing mobile/backend architecture, configuration, environments, dependencies, and technical debt.
Delivered: `docs/TECHNICAL_HARDENING_AUDIT.md`, validation evidence, risk classification, prioritized P0/P1/P2 backlog.
Still pending: config hardening, backend tests, migration discipline, OTP/rate-limit hardening, audit logs, CI/CD.
Acceptance: repo has clear technical baseline and safe next actions.
Out of scope: new product features, real payment providers, and broad refactors.

## Phase 3 - UI/UX Production System

Status: completed with caveats.
Objective: convert current design into a consistent mobile-first production visual system aligned with per-screen PNG references.
Delivered: theme tokens, reusable components, primary screen polish, `AccountCreated`, custom bottom tab UI, loading/empty/error/success/disabled/pending states, completion report.
Still pending: production splash illustration asset, real OTP resend behavior, optional native tab navigator, Home loading state backed by API, visual QA on device.
Acceptance: primary mock/dev flows are visually consistent and TypeScript typecheck passes.
Out of scope: changing backend behavior and payment semantics.

## Phase 4A - Auth & Session Security P0

Status: next recommended.
Objective: remove production blockers from auth/session without changing product scope.
Deliverables: environment-gated dev OTP response, strong secret validation outside development, OTP rate limiting plan or implementation, session expiration/revocation strategy, auth tests.
Acceptance: dev OTP cannot leak outside development; insecure JWT defaults fail outside development; auth endpoints have tests; mobile session behavior remains compatible.
Out of scope: KYC and wallet.

## Phase 4B - Backend Safety & Test Foundation

Status: planned.
Objective: turn Phase 2 P0 technical risks into a safer backend baseline.
Deliverables: pytest setup, `/health` test, auth tests, protected route ownership tests, mock payment tests, Alembic migration policy, startup behavior decision for `Base.metadata.create_all`.
Acceptance: backend tests run locally and in documented commands; user-owned service/payment/receipt/notification access is covered by tests; migration policy is documented or implemented.
Out of scope: real payments, new product features, admin console, and provider integration.

## Phase 5 - User Services Domain

Status: planned.
Objective: stabilize providers, user services, validations, ownership, and user-facing states.
Deliverables: provider/service state model, validation rules, ownership tests, API/mobile error contracts, empty/loading/error coverage for API-backed services.
Acceptance: users can only access their own services; invalid references and service states are handled predictably.
Out of scope: real provider integration.

## Phase 6 - Payments Mock Hardening

Status: planned.
Objective: improve mock payments with clear states, errors, conceptual idempotency, audit hooks, and consistent receipts.
Deliverables: mock payment state machine, failure paths, duplicate-submit protection, receipt consistency, tests, UI disclaimers where needed.
Acceptance: mock flow cannot be confused with real money movement.
Out of scope: real payments.

## Phase 7 - Ledger & Audit Foundation

Status: planned.
Objective: design financial ledger and audit logs before real money.
Deliverables: audit event model, audit log implementation plan, ledger model, retention strategy, traceability rules, webhook event model for future providers.
Acceptance: every future financial action has traceability design and an implementation path.
Out of scope: provider integration.

## Phase 8 - Admin & Support Console

Status: planned.
Objective: define administrative foundation before building admin UI.
Deliverables: support/admin role scope, permission matrix, support use cases, finance/audit use cases, API plan, screen inventory.
Acceptance: admin/support/finance/auditor actions are role-defined and auditable on paper before implementation.
Out of scope: unrestricted admin access and full admin console implementation.

## Phase 9 - Payment Provider Selection

Status: planned.
Objective: select a real provider and design integration without implementing it all at once.
Deliverables: provider comparison for Mexico, risk assessment, cost/settlement notes, sandbox plan, webhook design, compliance questions.
Acceptance: provider decision is recorded in `planning/DECISIONS.md`.
Out of scope: production money movement.

## Phase 10 - Real Payment Integration

Status: blocked until Phase 9 decision and pre-payment gates are complete.
Objective: integrate selected provider in sandbox.
Deliverables: sandbox integration, webhook handling, provider errors, tests.
Acceptance: sandbox payments are traceable and reversible in non-production.
Out of scope: production launch.

## Phase 11 - Notifications & Receipts

Status: planned.
Objective: implement push/email notifications and downloadable/verifiable receipts.
Deliverables: notification channels, receipt verification, receipt detail/download, templates, delivery-state handling.
Acceptance: users receive consistent payment status and receipt evidence.
Out of scope: marketing messaging.

## Phase 12 - Security, Fraud & Compliance Review

Status: planned.
Objective: review security, privacy, fraud, and regulatory obligations.
Deliverables: threat model, fraud controls, privacy review, compliance checklist.
Acceptance: launch blockers are clearly classified.
Out of scope: legal advice as code.

## Phase 13 - Automated Testing & QA

Status: planned.
Objective: add backend, mobile, integration, permission, payment, and regression testing.
Deliverables: backend tests, mobile typecheck policy, smoke tests, QA checklist, manual device pass, regression matrix.
Acceptance: CI can validate critical flows.
Out of scope: exhaustive device lab coverage.

## Phase 14 - CI/CD & Environments

Status: planned.
Objective: pipelines, dev/staging/prod environments, secrets, and builds.
Deliverables: GitHub Actions, environment strategy, secret management, release procedure.
Acceptance: deploys are repeatable and auditable.
Out of scope: unmanaged manual releases.

## Phase 15 - Mobile Store Readiness

Status: planned.
Objective: prepare Google Play and Apple App Store.
Deliverables: store metadata, build profiles, privacy labels, review checklist.
Acceptance: app can enter store review with known limitations.
Out of scope: production financial launch without Phase 16 gates.

## Phase 16 - Production Release

Status: planned.
Objective: controlled release with rollback and monitoring.
Deliverables: release plan, rollback plan, monitoring dashboards, support runbook.
Acceptance: release is observable, reversible, and approved.
Out of scope: uncontrolled public launch.

## Phase 17 - Operations & Continuous Improvement

Status: planned.
Objective: operations, metrics, support, improvements, and continuous audit.
Deliverables: operational cadence, incident process, metrics review, audit review.
Acceptance: product can be maintained beyond launch.
Out of scope: ad hoc operations without ownership.
