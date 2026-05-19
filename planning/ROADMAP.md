# Roadmap

## Phase 0 - Product Definition

Status: completed.
Objective: define FondixPay as a mobile-first service payment app.
Deliverables: product direction, initial mock flow, base repo.
Acceptance: README and initial implementation describe service-payment MVP.
Out of scope: real payment provider, wallet, KYC.

## Phase 1 - AXON-AI Alignment & Project Operating Pack

Status: current/completed.
Objective: align the existing repo with AXON-AI governance.
Deliverables: `AGENTS.md`, planning docs, architecture docs, sprint handoffs.
Acceptance: Builders can continue from file-based scope without relying on chat context.
Out of scope: feature implementation, real payments, production hardening.

## Phase 2 - Technical Architecture Hardening

Status: planned.
Objective: review and harden existing mobile/backend architecture, configuration, environments, dependencies, and technical debt.
Deliverables: backend/mobile audit, config fixes, initial tests, error-handling plan, migration plan.
Acceptance: repo has clear technical baseline and safe next actions.
Out of scope: new product features and real payment providers.

## Phase 3 - UI/UX Production System

Status: planned.
Objective: convert current design into a consistent mobile-first production visual system aligned with `fondix.png`.
Deliverables: theme, typography, spacing, reusable components, screen consistency, states.
Acceptance: primary flows are visually consistent and accessible.
Out of scope: changing backend behavior.

## Phase 4 - Auth & Session Security

Status: planned.
Objective: harden login, OTP, sessions, secure storage, expiration, and errors.
Deliverables: secure OTP strategy, session handling, protected routes, tests.
Acceptance: dev OTP is removed from production paths.
Out of scope: KYC and wallet.

## Phase 5 - User Services Domain

Status: planned.
Objective: stabilize providers, user services, validations, and states.
Deliverables: state model, validations, ownership checks, tests.
Acceptance: users can only access their own services.
Out of scope: real provider integration.

## Phase 6 - Payments Mock Hardening

Status: planned.
Objective: improve mock payments with clear states, errors, conceptual idempotency, and consistent receipts.
Deliverables: state machine, error paths, receipt consistency, tests.
Acceptance: mock flow cannot be confused with real money movement.
Out of scope: real payments.

## Phase 7 - Ledger & Audit Foundation

Status: planned.
Objective: design financial ledger and audit logs before real money.
Deliverables: ledger model, audit event model, retention strategy, traceability rules.
Acceptance: every future financial action has traceability design.
Out of scope: provider integration.

## Phase 8 - Admin & Support Console

Status: planned.
Objective: create administrative foundation for users, payments, receipts, support, and audit.
Deliverables: admin scope, roles, screens/API plan, permission model.
Acceptance: support/admin actions are role-defined and auditable.
Out of scope: unrestricted admin access.

## Phase 9 - Payment Provider Selection

Status: planned.
Objective: select a real provider and design integration without implementing it all at once.
Deliverables: provider comparison, risk assessment, sandbox plan, webhook design.
Acceptance: provider decision is recorded in `planning/DECISIONS.md`.
Out of scope: production money movement.

## Phase 10 - Real Payment Integration

Status: planned.
Objective: integrate selected provider in sandbox.
Deliverables: sandbox integration, webhook handling, provider errors, tests.
Acceptance: sandbox payments are traceable and reversible in non-production.
Out of scope: production launch.

## Phase 11 - Notifications & Receipts

Status: planned.
Objective: implement push/email notifications and downloadable/verifiable receipts.
Deliverables: notification channels, receipt verification, templates.
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
Deliverables: test suites, smoke tests, QA checklist.
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
