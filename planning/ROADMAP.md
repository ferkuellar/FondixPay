# Roadmap

Updated: 2026-05-26

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
- Phase 5F: completed as payment recovery paths.
- Phase 6A/6B: completed for account/demo balance scope.
- Phase 7: completed for movements, receipts, and transaction-history hardening.
- Phase 8A/8B: completed as sandbox integration designs.
- Phase 8C: completed for contractual sandbox/mock orchestration.
- Phase 9: completed for notifications, receipts, and proof-of-payment hardening.
- Current phase: Phase 10X - Public Landing Page Integration & Commercial Front Door.
- Recommended next phase: Phase 10E - Coverage-Aware Service Catalog Design, or Phase AWS-1 - Terraform Foundation if infrastructure is prioritized.

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

Status: completed for contractual mock backend slice.
Objective: implement approved sandbox adapters and tests after 8A/8B design and provider decisions.
Deliverables: tokenized card sandbox integration, Prontipagos sandbox implementation if approved, webhook/status handling, tests, and reconciliation hooks.
Acceptance: non-production sandbox flows are auditable, idempotent, redacted, and testable.
Out of scope: commercial production launch.

## Phase 9 - Notifications, Receipts & Proof of Payment

Status: completed for mock/sandbox proof and in-app notification scope.
Objective: harden payment evidence and status clarity before internal operations design.
Deliverables: receipt/proof state model, user-scoped proof endpoints, in-app notifications, safe references, mock/sandbox disclaimers, and Phase 9 validation evidence.
Acceptance: pending, timeout, failed, generated, and unavailable evidence states are not confused with confirmed payment.
Out of scope: fiscal receipts, production providers, real push/email delivery, and commercial launch.

## Phase 10A - CRM Admin Panel Architecture & RBAC Design

Status: current design/documentation phase after Phase 9 and before Phase 11.
Objective: define CRM modules, RBAC, redaction, support, reconciliation, manual review, audit, future APIs, and frontend architecture before implementation.
Deliverables: CRM architecture, CRM RBAC matrix, CRM backlog, sprint handoff, and cross-doc production gates.
Out of scope: admin endpoints, admin frontend, admin auth runtime, real roles in DB, provider integration, and money movement.

## Phase 10B - CRM Admin Panel Backend APIs

Status: planned next phase.
Objective: implement permissioned admin backend contracts with auth, roles, redacted responses, audit events, fixtures, and RBAC tests.
Out of scope: full CRM frontend.

## Phase 10C - CRM Admin Panel Frontend Implementation

Status: planned.
Objective: build the internal web admin over the 10B permissioned API contracts.
Out of scope: weakening backend authorization through frontend-only controls.

## Phase 10D - Support, Reconciliation & Manual Review Workflows

Status: planned.
Objective: complete operational workflows, queues, runbooks, and provider-leg reconciliation views before commercial production.
Out of scope: destructive ledger editing and unsupported provider assumptions.

## Phase 10D.1 - WhatsApp Receipt Channel Alignment

Status: completed as documentation and architecture alignment.
Objective: document WhatsApp as a future non-blocking post-payment receipt channel.
Deliverables: WhatsApp channel architecture, consent model, proposed preferences/delivery logs, safe payload rules, idempotency, audit events, operations runbooks, validation checklist, and backlog.
Acceptance: no runtime provider integration exists; WhatsApp failure is non-blocking; explicit granular consent is mandatory.
Out of scope: WhatsApp provider integration, real messages, credentials, payment-flow changes, receipt-generation changes, CRM runtime changes, and WhatsApp OTP.

## Phase 10X - Public Landing Page Integration & Commercial Front Door

Status: completed as static landing integration.
Objective: integrate the public commercial front door without enabling real payments, backend access, CRM access, or production financial claims.
Deliverables: `landing/`, `docs/PUBLIC_LANDING_PAGE.md`, sprint 10X handoff, Vercel landing-only guidance, and copy/security boundaries.
Out of scope: payment production launch, backend/CRM hosting, real waitlist storage, app store publication, final support URLs, provider integrations, and production claims.

## Phase 10E - Coverage-Aware Service Catalog Design

Status: planned.
Objective: design service coverage rules by geography/provider availability so unavailable services are hidden or explained.
Out of scope: hardcoding service coverage in mobile.

## Phase 10F - Coverage-Aware Service Catalog Implementation

Status: planned.
Objective: implement backend-driven service coverage behavior after design approval.
Out of scope: changing provider/payment execution contracts.

## Phase AWS-1 - Terraform Foundation

Status: planned.
Objective: define infrastructure-as-code foundation.

## Phase AWS-2 - Dev/Staging Deployment

Status: planned.
Objective: deploy controlled non-production environments.

## Phase AWS-3 - CI/CD Pipeline

Status: planned.
Objective: automate validation and deployments with auditable gates.

## Phase 10G - WhatsApp Payment Receipt MVP Implementation

Status: planned after infrastructure, secrets, audit logs, provider selection, and deployment discipline.
Objective: implement the first WhatsApp receipt template, limited to `fondix_pago_exitoso`.
Out of scope: reminders, failed-payment notices, monthly summaries, and OTP.

## Phase 11 - Commercial Readiness Gate Review

Status: planned after CRM/Admin operational design and implementation phases.
Objective: review whether provider selection, security, operations, reconciliation, support, and release gates are ready for a controlled next implementation step.
Deliverables: gate assessment, unresolved blocker list, validated dependency ordering, and launch-risk decision record.
Acceptance: production blockers remain explicit and no commercial launch is inferred from sandbox/mock readiness.
Out of scope: bypassing admin, provider, security, or compliance gates.

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
## Phase 10E - Coverage-Aware Service Catalog Design

Status: current design phase.

Purpose:
Design the coverage-aware service catalog that separates public coverage display from mobile payment eligibility. This phase uses the coverage map and approved Excel as references, but does not implement runtime catalog behavior.

## Phase 10F - Coverage-Aware Service Catalog Implementation

Status: recommended next catalog phase.

Purpose:
Implement service catalog models, coverage-by-state rules, provider capability records, admin visibility, mobile payable filtering, and future landing map data source governance.
