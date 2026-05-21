# Roadmap

Updated: 2026-05-20

## Current Route Summary

FondixPay is currently a governed MVP mock/dev mobile app. It has AXON-AI operating documentation, a technical hardening audit, a mobile UI/UX production system aligned to per-screen references under `references/`, auth/session P0 hardening, backend safety tests, a UX/Product risk register, and ledger/audit foundation design.

Current practical position:

- Phase 0: completed.
- Phase 1: completed.
- Phase 2: completed as audit/documentation baseline, not full hardening implementation.
- Phase 3: completed with caveats documented in `planning/sprints/003-ui-ux-production-system/COMPLETION_REPORT.md`.
- Phase 4A: completed.
- Phase 4B: completed.
- Phase 4C: completed as UX/Product governance and backlog registration.
- Phase 5A: completed as ledger/audit design.
- Phase 5B: completed as ledger/audit implementation baseline.
- Phase 5C: completed as fee transparency baseline.
- Phase 5D: completed as card payment method strategy.
- Phase 5E: completed as card payment UX mock implementation.
- Current phase: Phase 8A - Card Processor Sandbox Design.
- Recommended next phase: Phase 8B - Prontipagos Sandbox Integration Design.

Before any real payment provider implementation, the project must preserve ledger/audit, idempotency, fee transparency, card payment method strategy, payment recovery paths, card processor sandbox design, Prontipagos sandbox design, support/receipt proof, and provider-selection gates. Real payments remain blocked.

## Immediate Recommended Path

1. Phase 5B - Ledger & Audit Implementation.
2. Phase 5C - Payment Trust & Fee Transparency.
3. Phase 5D - Card Payment Method Strategy.
4. Phase 5E - Card Payment UX Mock Implementation.
5. Phase 5F - Payment Recovery Paths.
6. Phase 8A - Card Processor Sandbox Design.
7. Phase 8B - Prontipagos Sandbox Integration Design.
8. Phase 8C - Sandbox Integration Implementation.
9. Phase 5 - User Services Domain Hardening.

Real payment integration must not start before card processor selection, Phase 8A/8B design gates, sandbox implementation acceptance, PCI/security review, and the existing auth/ledger/audit/recovery gates are accepted.

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

Status: completed.
Objective: remove production blockers from auth/session without changing product scope.
Deliverables: environment-gated dev OTP response, strong secret validation outside development, OTP rate limiting plan or implementation, session expiration/revocation strategy, auth tests.
Acceptance: dev OTP cannot leak outside development; insecure JWT defaults fail outside development; auth endpoints have tests; mobile session behavior remains compatible.
Out of scope: KYC and wallet.

## Phase 4B - Backend Safety & Test Foundation

Status: completed.
Objective: turn Phase 2 P0 technical risks into a safer backend baseline.
Deliverables: pytest setup, `/health` test, auth tests, protected route ownership tests, mock payment tests, Alembic migration policy, startup behavior decision for `Base.metadata.create_all`.
Acceptance: backend tests run locally and in documented commands; user-owned service/payment/receipt/notification access is covered by tests; migration policy is documented or implemented.
Out of scope: real payments, new product features, admin console, and provider integration.

## Phase 4C - UX/Product Risk Register

Status: completed.
Objective: formalize preliminary UX/Product fintech audit findings and convert them into AXON-AI decisions, risks, roadmap, validation criteria, audit events, and backlog.
Deliverables: `docs/UX_PRODUCT_AUDIT.md`, `planning/UX_PRODUCT_BACKLOG.md`, Sprint 004C handoff, ADR-024 through ADR-029, UX/Product validation and security notes.
Acceptance: commercial production is explicitly blocked by UX/Product criticals; internal validation without real money remains allowed.
Out of scope: implementing screens, payment logic, provider integrations, backend changes, or auth changes.

## Phase 5A - Ledger & Audit Foundation Design

Status: completed.
Objective: design ledger, audit logs, idempotency, and traceability before real money.
Deliverables: `docs/LEDGER_AND_AUDIT_DESIGN.md`, `docs/PAYMENT_STATE_MACHINE.md`, proposed data model, future API contracts, audit catalog, validation/security/operations strategy, `planning/LEDGER_AUDIT_BACKLOG.md`.
Acceptance: every future financial action has a traceability design before provider integration starts.
Out of scope: real payment provider integration and production money movement.

## Phase 5B - Ledger & Audit Implementation

Status: completed.
Objective: implement ledger/audit models, migrations, audit event writer, correlation IDs, idempotency keys, state transition validator, and tests.
Deliverables: Alembic migrations, SQLAlchemy models, services, middleware, tests, and documentation updates.
Acceptance: append-only ledger/audit records, idempotency, and payment state transitions are enforced and tested.
Out of scope: real provider integration and mobile redesign.

## Phase 5C - Payment Trust & Fee Transparency

Status: completed.
Objective: show FondixPay fee, service amount, total, and trust microcopy before payment confirmation.
Deliverables: fee disclosure requirements, confirmation copy, receipt fee fields, trust signals, and validation checklist.
Acceptance: users can identify commission and final total before confirming payment.
Out of scope: payment provider integration.

## Phase 5D - Card Payment Method Strategy

Status: completed.
Objective: define the card-only user payment strategy without storing raw card data or assuming unsupported methods.
Deliverables: debit/credit card decision, tokenization rules, UX states, provider constraints, compliance notes, and phantom-card label removal.
Acceptance: no current payment screen implies a real preselected card; future real payment requires selected card.
Out of scope: storing raw card data or adding a provider without approved decision.

## Phase 5E - Card Payment UX Mock Implementation

Status: planned.
Objective: implement mock add/select/change card UX without real provider or card storage.
Deliverables: add-card mock screen, select/change card mock UX, card demo component, empty state, and confirmation integration.
Acceptance: user can add/select/change a clearly labeled card demo before mock payment.
Out of scope: tokenization, real provider, PAN/CVV storage, real money.

## Phase 5G - Prontipagos Sandbox Integration Design

Status: planned.
Objective: design Prontipagos sandbox integration without real money.
Deliverables: catalog sync design, reference validation, amount lookup, payment execution contract, provider status mapping, error mapping, receipt/folio mapping, timeout policy, retry policy, and reconciliation design.
Acceptance: provider transaction mapping is accepted before implementation.
Out of scope: production credentials, real payments, and live provider traffic.

## Phase 5F - Payment Recovery Paths

Status: planned.
Objective: design and implement failed/uncertain payment paths with retry, change method, support, and charged/not-charged clarity.
Deliverables: error states, retry rules, support handoff, pending state copy, and audit event mapping.
Acceptance: users know what happened and what to do after a failed or uncertain payment.
Out of scope: real provider settlement logic.

## Phase 5G - Support & Receipt Proof

Status: planned.
Objective: improve proof of payment, support visibility, receipt download/share, and post-payment status clarity.
Deliverables: receipt proof requirements, download/share behavior, support entry points, status copy, and audit event mapping.
Acceptance: users can preserve proof and contact support from relevant states.
Out of scope: full admin/support console.

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

## Phase 8A - Card Processor Sandbox Design

Status: completed as documentation/design.
Objective: design the card processor sandbox leg for tokenization and card charge/auth without production integration.
Deliverables: sandbox design, evaluation matrix, API/data/audit/security/operations/UX contracts, card backlog, sprint handoff.
Acceptance: card processor and Prontipagos remain separate; no PAN/CVV storage path is approved; production remains blocked.
Out of scope: provider adapter, real charges, real secrets, Prontipagos integration.

## Phase 8B - Prontipagos Sandbox Integration Design

Status: current/completed as documentation/design.
Objective: design the service-payment aggregator leg after approved card charge/auth state.
Deliverables: reference validation, service payment execution, provider status/error mapping, receipts, reconciliation, and recovery design for Prontipagos.
Acceptance: card processor charge state and Prontipagos service state remain separately traceable.
Out of scope: live production traffic.

## Phase 8C - Sandbox Integration Implementation

Status: future.
Objective: implement approved sandbox adapters and tests after 8A/8B design and provider decisions.
Deliverables: tokenized card sandbox integration, Prontipagos sandbox implementation if approved, webhook/status handling, tests, and reconciliation hooks.
Acceptance: non-production sandbox flows are auditable, idempotent, redacted, and testable.
Out of scope: commercial production launch.

## Phase 9 - Card Processor Selection

Status: planned.
Objective: select the real card processor and design integration without implementing it all at once.
Deliverables: card processor comparison for Mexico, tokenization/vault model, risk assessment, chargeback notes, sandbox plan, webhook/status design, compliance questions.
Acceptance: card processor decision is recorded in `planning/DECISIONS.md`.
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
# Phase 5E — Payment Method UX Mock Implementation

## Objective
Implement mobile mock/dev UX for adding, selecting, and changing a demo payment method before payment confirmation.

## Status
Completed for mock/dev mobile UX.

## Out of Scope
- Real providers.
- Real card storage.
- Prontipagos.
- Real money movement.

## Next
Phase 5F — Payment Recovery Paths.

# Phase 6A — Account & Balance Model Design

Status: current/completed as design.
Objective: define account, demo balance, available/pending/held separation, ledger-derived movements, and real-balance gates without implementing wallet or money movement.
Deliverables: `docs/ACCOUNT_AND_BALANCE_MODEL.md`, proposed data/API/audit model, backlog for Phase 6B.
Acceptance: demo vs real balance semantics are explicit and production remains blocked.

# Phase 6B — Simulated Balance Implementation

Status: planned.
Objective: implement demo balance and ledger-derived/mock movements with explicit non-real-money labeling.

# Phase 6C — Movements UI From Ledger

Status: planned.
Objective: expose movement list and statement UX from approved ledger/payment projections.

# Phase 6D — Account Status & Restrictions

Status: planned.
Objective: implement status, restriction, audit, and support behavior for accounts.

Real wallet and real balance remain moved to a future regulated phase after legal/provider/custody decisions.

Wallet/account/simulated balance work in the current roadmap is demo/account-model work only. It is not a user-facing payment method and does not replace debit or credit card.
