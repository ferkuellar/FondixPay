# Project State

Updated: 2026-05-26

Current phase: Phase 10X - Public Landing Page Integration & Commercial Front Door.

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
- Phase 8A - Card Processor Sandbox Design: completed.
- Phase 8B - Prontipagos Sandbox Integration Design: completed.
- Phase 8C - Sandbox Integration Implementation: completed for contractual mock backend orchestration.
- Phase 9 - Notifications, Receipts & Proof of Payment: implemented for mock/sandbox receipt proof and in-app notifications.
- Phase 10A - CRM Admin Panel Architecture & RBAC Design: current documentation/design phase.
- Next recommended phase: Phase 10B - CRM Admin Panel Backend APIs.

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

# Phase 8C - Sandbox Integration Implementation

- Current phase: Phase 8C - Sandbox Integration Implementation.
- This phase implements sandbox/mock contractual adapters for the card processor leg and Prontipagos leg.
- Prontipagos execution is gated by sandbox card success in backend tests.
- Real money remains blocked.
- Commercial production remains blocked.
- Next recommended phase: Phase 9 - Notifications, Receipts & Proof of Payment.

# Phase 9 - Notifications, Receipts & Proof of Payment

- Current phase: Phase 9 - Notifications, Receipts & Proof of Payment.
- This phase hardens in-app notifications, receipt detail, and proof-of-payment semantics for mock/sandbox states.
- Receipt-flow bugfix note: demo-card mobile success keeps its local mock proof path and now keeps the `Ver comprobante` access visible from a scrollable success surface with explicit mock/dev status copy.
- Real payments remain blocked.
- Commercial production remains blocked.
- Next recommended phase: Phase 10A - CRM Admin Panel Architecture & RBAC Design.

# Phase 10A - CRM Admin Panel Architecture & RBAC Design

- Current phase: Phase 10A - CRM Admin Panel Architecture & RBAC Design.
- This phase designs the CRM Admin Panel, RBAC matrix, data redaction, support, reconciliation, audit, and manual-review architecture.
- Commercial production remains blocked.
- Next recommended phase: Phase 10B - CRM Admin Panel Backend APIs.

# Phase 10B - CRM Admin Panel Backend APIs

- Current phase: Phase 10B - CRM Admin Panel Backend APIs.
- This phase implements the initial backend CRM/Admin APIs with server-side RBAC, redacted responses, support tickets, manual review, audited reads, and reconciliation placeholders.
- Frontend CRM remains pending.
- Commercial production remains blocked.
- Next recommended phase: Phase 10C - CRM Admin Panel Frontend Implementation.

# Phase 10C - CRM Admin Panel Frontend Implementation

- Current phase: Phase 10C - CRM Admin Panel Frontend Implementation.
- This phase implements the initial separate web CRM Admin frontend over the Phase 10B backend admin APIs and placeholders.
- Backend admin APIs are an explicit dependency and backend authorization remains the source of truth.
- Commercial production remains blocked.
- Next recommended phase: Phase 10D - Support, Reconciliation & Manual Review Workflows.

# Phase 10D - Support, Reconciliation & Manual Review Workflows

- Current phase: Phase 10D - Support, Reconciliation & Manual Review Workflows.
- This phase hardens CRM operational workflows for support tickets, manual review, safe investigation search, and separated card/Prontipagos reconciliation placeholders.
- Backend/admin frontend workflows remain sandbox/mock operational tooling only; no real providers, no money movement, no destructive ledger edits, and no production reconciliation were implemented.
- Commercial production remains blocked.
- Next recommended phase: Phase 11 - Audit, Fraud & Chargeback Readiness.

## WhatsApp Receipt Channel Alignment

WhatsApp receipt delivery has been approved as a future non-blocking notification channel. Current status is documentation and architecture alignment only. No runtime behavior has been implemented.

# Phase 10D.1 - WhatsApp Receipt Channel Alignment

- Current phase: Phase 10D.1 - WhatsApp Receipt Channel Alignment.
- WhatsApp is approved only as future architecture/documentation for post-payment receipt delivery.
- No runtime behavior was implemented.
- No WhatsApp provider was integrated.
- No real WhatsApp messages are sent.
- No payment flow, receipt generation, CRM workflow, provider integration, or money movement was changed.
- Commercial production remains blocked.
- Next recommended phase: Phase 11 - Audit, Fraud & Chargeback Readiness, or Phase 10G - WhatsApp Payment Receipt MVP Implementation only after infrastructure, secrets, audit logs, provider selection, and deployment discipline are ready.

# Phase 10X - Public Landing Page Integration & Commercial Front Door

- Current phase: Phase 10X - Public Landing Page Integration & Commercial Front Door.
- Status: implemented as a separate static public landing under `landing/`.
- The landing is a commercial front door only; it does not process payments, handle cards, access backend financial APIs, access CRM/Admin, or store sensitive data.
- Vercel is approved only for the public landing page.
- `mobile/`, `backend/`, and `admin/` runtime modules remain unchanged by this phase.
- Commercial production remains blocked.
- Next recommended phase: Phase 10E - Coverage-Aware Service Catalog Design, or Phase AWS-1 - Terraform Foundation if infrastructure is prioritized.

## Current Phase - Phase 10E - Coverage-Aware Service Catalog Design

FondixPay is currently in Phase 10E: Coverage-Aware Service Catalog Design.

This phase designs how services, categories, state coverage, visibility, provider capability, mobile payment eligibility, landing coverage, and CRM/Admin visibility should work before real provider-backed payments.

Current findings:

- The requested repo path `assets/coverage-map.html` is not present in this workspace.
- The matching coverage map asset was found in the external design-system folder and analyzed as a commercial/reference artifact.
- The approved Excel workbook `FONDIXPAY_Cobertura_Por_Estado.xlsx` was analyzed as coverage reference data.
- Existing backend service providers are mock/manual and not coverage-aware.
- Existing mobile saved services include hardcoded demo services and do not yet enforce state-aware coverage.
- No runtime implementation was added in Phase 10E.

Operating status:

- Public landing coverage is reference/commercial only.
- Mobile payable catalog must be stricter than landing coverage.
- No unconfirmed service should be marked payable.
- No Prontipagos real integration was added.
- No payment flow was changed.
- Production commercial launch remains blocked.

Next recommended phase:

Phase 10F - Coverage-Aware Service Catalog Implementation.

## Current Phase - Phase 10F - Coverage-Aware Service Catalog Implementation

FondixPay is currently in Phase 10F: Coverage-Aware Service Catalog Implementation.

This phase implemented the first backend coverage-aware service catalog foundation and connected mobile Add Service discovery to the strict payable catalog endpoint.

Implemented:

- Backend `service_catalog` module.
- Catalog categories, items, coverage-by-state, provider capability, and source metadata models.
- Conservative seed from coverage references.
- Public/mobile `/service-catalog` endpoint.
- Public/reference `/coverage-map` endpoint.
- Admin `/admin/service-catalog` endpoints protected by RBAC.
- Payable validation service.
- Mobile service catalog API/store.
- Mobile Add Service empty state when no payable services exist.
- Tests for catalog, coverage map, payable rules, and admin catalog access.

Operating status:

- Seeded coverage is reference-only.
- No seeded service is payable.
- CFE, Telmex, Telcel, and every map/Excel-derived item remain non-payable until provider capability is confirmed.
- No Prontipagos real integration was added.
- No payment flow was changed to move real money.
- Production commercial launch remains blocked.

Next recommended phase:

Fase AWS-1 - Terraform Foundation, or Fase 11 - Audit, Fraud & Chargeback Readiness depending on active roadmap priority.

## Phase 10G State - WhatsApp Payment Receipt MVP

Implemented:

- WhatsApp receipt preference and delivery models.
- Explicit opt-in/out for `whatsapp/payment_receipt`, disabled by default.
- Mock WhatsApp provider and provider abstraction.
- Runtime template `fondix_pago_exitoso` only.
- Non-blocking receipt send service with idempotency and safe payload.
- User endpoints for preferences, deliveries, and manual receipt send.
- Admin endpoints and frontend list for masked delivery visibility.
- Mobile profile consent control and PaymentSuccess informational copy.
- Backend tests for consent, delivery, idempotency, security, and admin visibility.

Still blocked for production:

- Real WhatsApp Business provider, approved Meta template, webhook validation, monitoring, legal/privacy review, and production credentials.
- Real money movement remains out of scope; card processor and Prontipagos production integrations are still future work.

## Hotfix - Mobile Services, Theme Toggle, and Demo Payments

Status: implemented on 2026-05-27 for mobile mock/dev usability.

This hotfix restores the mobile demo flow after the conservative Phase 10F service catalog made `/service-catalog` return no payable production services. The mobile app now shows a clearly labeled local demo service fallback when the strict catalog is empty or unavailable. This does not mark backend catalog items as production-payable and does not confirm Prontipagos capability.

Also updated:

- Removed the stack Fondix header from Home.
- Removed stack header chrome from Phone Login.
- Added a visible Day/Night toggle under Profile and persisted it with Expo Secure Store.
- Ensured a safe `Tarjeta demo` exists for local mock payment confirmation.

Production status remains blocked. No real payment provider, Prontipagos integration, card processor, or money movement was added.

## Phase AWS-2 - Dev/Staging Deployment

Current phase: Phase AWS-2 - Dev/Staging Deployment.

Status: completed as plan-only validation and documentation; live AWS deployment is blocked by missing AWS credentials.

Validated:

- AWS-1 Terraform foundation reviewed.
- Repository hygiene checked for Terraform runtime artifacts.
- `.gitignore` already excludes `.terraform/`, `*.tfstate`, `*.tfvars`, `tfplan`, and `*.tfplan`.
- `terraform fmt -recursive` passed.
- `terraform init` passed for `infra/terraform/environments/dev` and `infra/terraform/backend`.
- `terraform validate` passed for `infra/terraform/environments/dev` and `infra/terraform/backend`.
- `aws sts get-caller-identity` failed with missing credentials.
- `terraform plan` failed with `No valid credential sources found`.
- `terraform apply` was intentionally skipped.

Operating status:

- Current Terraform implementation supports `dev` only.
- Staging is not implemented yet because `environment` is restricted to `dev`.
- No production resources were deployed.
- No real payments, real Prontipagos connectivity, card processor, production secrets, or application payment logic were changed.

Next recommended phase:

AWS-2B - Dev Apply With Confirmed AWS Account, after configuring credentials for a confirmed non-production AWS account and reviewing a successful plan.

## Phase AWS-3 - CI/CD Pipeline

Current phase: Phase AWS-3 - CI/CD Pipeline.

Status: completed as a safe CI/CD foundation.

Implemented:

- GitHub Actions `CI` workflow for backend, mobile, admin, and landing validation.
- GitHub Actions `Terraform Dev` workflow for Terraform fmt/init/validate and manual dev plan.
- GitHub Actions `Deploy Dev` workflow for manual dev-only Terraform apply.
- CI/CD documentation with GitHub secrets, environment approvals, rollback, failure handling, and branch protection recommendations.
- AWS-3 sprint requirements, blueprint, acceptance, and completion report.

Operating status:

- Pull request validation does not deploy.
- Terraform apply cannot run automatically on push to `main`.
- Dev apply requires `workflow_dispatch`, `confirm_environment=dev`, `apply=true`, OIDC, required secrets, and GitHub Environment `dev`.
- Production deployment is not enabled.
- Staging deployment is not enabled because no Terraform staging environment exists.
- No real payment provider, Prontipagos production connection, production secrets, or application payment logic was changed.

Next recommended phase:

AWS-2B - Dev Apply With Confirmed AWS Account, or AWS-4 - Staging Environment Definition after dev apply is validated.

## Phase 11 - Audit, Fraud & Chargeback Readiness

Current phase: Phase 11 - Audit, Fraud & Chargeback Readiness.

Status: implemented for internal readiness and manual workflows.

Implemented:

- Backend fraud signal model, schemas, repository, services, RBAC permissions, and admin routes.
- Backend dispute/chargeback case and evidence model, schemas, repository, services, RBAC permissions, and admin routes.
- Alembic migration `20260527_0007_phase_11_fraud_chargeback_readiness.py`.
- CRM/Admin pages for fraud signal list/detail and dispute/chargeback list/detail.
- Audit events for fraud signal creation/review/dismissal/escalation and dispute/chargeback creation/status/evidence/closure.
- Backend tests for fraud signal RBAC/audit and chargeback evidence/status/audit.
- Fraud readiness, chargeback readiness, reconciliation, support workflow, API, data model, audit, security, operations, and validation documentation.

Operating status:

- Fraud detection remains explainable signal + human review only.
- No automatic user blocking, refunds, chargeback submission, account closure, or autonomous remediation was added.
- No production Prontipagos, card processor, or payment behavior was changed.
- Internal evidence workflows are ready for sandbox/admin review only.

Next recommended phase:

Phase 12 - Production Readiness Gap Closure, focused on real provider evidence, reconciliation execution, retention/legal policy, admin session hardening, and controlled launch gates.

## Phase 10X.1 - Public Landing Chatbot & Admin Response Console

Current phase: Phase 10X.1 - Public Landing Chatbot & Admin Response Console.

Status: implemented for public landing informational chatbot and internal response management.

Implemented:

- Approved floating chatbot CSS, HTML, SVG, tooltip, panel, bubbles, input, suggested questions, and animations integrated into `landing/index.html`.
- Prototype `window.claude.complete` usage removed and replaced by `POST /api/public/chat`.
- Anonymous landing session ID persisted in `localStorage`.
- Backend public chatbot endpoint with validation, message length limit, FAQ/rule/intent/knowledge/fallback response resolution, safe private-operation routing, masked conversation logging, and audit events.
- Backend CRM/Admin chatbot APIs for FAQs, intents, knowledge entries, settings, conversations, and fallbacks.
- SQLAlchemy models and Alembic migration for chatbot response configuration, conversations, messages, fallbacks, and settings.
- CRM/Admin `Bot de Landing` console for response management and review.
- Documentation for chatbot architecture, API, data model, permissions, audit, and security controls.
- Backend tests for public chatbot safety, masking, fallback logging, FAQ matching, admin RBAC, and admin management actions.

Operating status:

- Chatbot is public-facing and informational only.
- No Meta, WhatsApp Cloud API, Twilio, third-party chat widget, or WhatsApp Web extension was introduced.
- Public chatbot does not query private customer, payment, receipt, balance, OTP, card, account, provider, ledger, or admin data.
- AI provider integration remains optional; empty environment values keep FAQ/rule-only operation.
- Manual visual validation of the landing chatbot remains recommended in a running browser/backend environment.

Next recommended phase:

Phase 10X.2 - Chatbot Content Governance & Landing Visual Validation, focused on approved FAQ content, production support routing policy, analytics/privacy review, browser screenshot validation, and rate-limiting middleware if selected.

## Phase 10X.2 - CRM Chat Operations Console & Human Escalation

Current phase: Phase 10X.2 - CRM Chat Operations Console & Human Escalation.

Status: implemented for internal CRM/admin operations.

Implemented:

- CRM topbar now includes theme toggle, notification bell, environment selector, `DEV / SANDBOX` pill, role pill, and `Salir`.
- Non-production DEV AUTH warning banner appears below the topbar and can be hidden.
- `Bot de Landing` remains in the existing sidebar position between `Disputas` and `Conciliacion tarjeta`.
- `Chat console` was not restored to the sidebar.
- Internal `#/chat-operations` route provides chat metrics, filters, conversation queue, transcript, severity, ticket link, notes, and audit timeline.
- Backend deterministic classifier stores detected intent, suggested severity, classification reason, and escalation state.
- `SEV-1` and `SEV-2` conversations require human review and are routed to ticket-required/human queue states.
- Chat-origin support ticket fields were added for source, severity, SLA, first response, resolution, reopen, and conversation linkage.
- Backend Chat Operations endpoints are RBAC-protected and audited.
- Tests cover high-severity public classification, admin ticket creation from chat, and blocked SUPPORT severity downgrade.

Operating status:

- Public chatbot remains informational and does not query private customer, payment, receipt, balance, OTP, card, account, provider, ledger, or admin data.
- No Meta, WhatsApp Cloud API, Twilio, third-party chat widget, or WhatsApp Web extension was introduced.
- No core payment, Prontipagos, ledger, transaction state, reconciliation, or settlement logic was changed.
- The console is operational but live browser screenshot validation should still be performed against a running local backend/admin stack.

Next recommended phase:

Phase 10X.3 - Chat Operations QA & Content Governance, focused on seeded chatbot content, browser visual validation against the CRM design reference, SLA policy tuning, and production support-channel approval.

## Phase 8B.1 — Production Readiness & Tekae Pre-Integration Scaffolding

Current phase: Phase 8B.1 — Production Readiness & Tekae Pre-Integration Scaffolding.

Status: documentation and safe scaffolding complete. No runtime code changed. No Tekae behavior implemented.

Implemented:

- `docs/PRODUCTION_READINESS.md` — master production gate checklist (8 gates).
- `docs/ENVIRONMENTS.md` — environment strategy for local, dev, staging, and production.
- `docs/RELEASE_CHECKLIST.md` — release gate checklist with sign-off fields.
- `docs/ROLLBACK.md` — rollback procedures for backend, mobile, Tekae integration, and infra.
- `docs/OBSERVABILITY.md` — event taxonomy (app, payment, integration, support), error categories, user-facing message standards.
- `docs/SUPPORT_RUNBOOK.md` — mobile-user-facing support runbook for Tekae era.
- `planning/STATE.md` — updated with current project state.
- `mobile/src/integrations/tekae/README.md` — shell description and implementation gate.
- `mobile/src/integrations/tekae/constants.ts` — `TEKAE_ENABLED=false`, `TEKAE_MODE='disabled'`.
- `mobile/src/integrations/tekae/types.ts` — TypeScript type stubs (no API calls).
- `mobile/src/integrations/tekae/statusMapper.ts` — placeholder, throws `TekaeIntegrationDisabledError` if called.
- `mobile/src/integrations/tekae/errors.ts` — error class stubs only.
- `.env.example` — Tekae feature flag section added.
- `docs/integrations/TEKAE.md` — feature flag states and UX disabled state specification added.
- `planning/TEKAE_RISKS.md` — RISK-T010 added (no production readiness documentation).

Operating status:

- `TEKAE_ENABLED=false` and `TEKAE_MODE=disabled` in all environments.
- No Tekae API endpoints invented.
- No payment execution code added.
- All integration shell files throw or no-op if called at runtime.
- Prontipagos historical artifacts preserved and untouched.
- TypeScript compiles with 0 errors.
- Real payments remain blocked.
- Commercial production remains blocked.

Next recommended phase:

Phase 008b-tekae-integration-discovery closure — obtain official Tekae documentation, answer all 14 open questions in `planning/TEKAE_OPEN_QUESTIONS.md`, then produce an implementation sprint proposal.

## Phase 8B.2 — Tekae Integration Shell (Formal Record)

Current phase: Phase 8B.2 — Tekae Integration Shell.

Status: COMPLETE. Sprint 8B.2 reviewed and formally recorded the integration shell delivered in Sprint 8B.1. No shell files were modified. No payment runtime was changed.

Sprint record created:

- `planning/sprints/008b2-tekae-integration-shell/requirements.md`
- `planning/sprints/008b2-tekae-integration-shell/acceptance.md`
- `planning/sprints/008b2-tekae-integration-shell/COMPLETION_REPORT.md`

All 12 acceptance criteria passed. TypeScript compiles with 0 errors. `TEKAE_ENABLED=false` confirmed. No API calls, endpoints, or payloads invented.

Operating status:

- Integration shell is inert and safe. No runtime Tekae behavior.
- All 14 open questions in `planning/TEKAE_OPEN_QUESTIONS.md` remain unresolved.
- Real payments remain blocked.
- Commercial production remains blocked.

Next recommended phase:

Sprint `008b-tekae-integration-discovery` — business action required first: establish Tekae Business contact and obtain official API documentation.

## Sprint 8B.4 — Mobile Provider-State Readiness

Current phase: Sprint 8B.4 — Mobile Provider-State Readiness.

Status: COMPLETE. Mobile-only readiness scaffolding added. No Tekae runtime behavior implemented.

Implemented:

- `mobile/src/integrations/providerReadiness.ts` — provider readiness presentation states and dev/internal demo guard.
- `mobile/src/types/index.ts` — `ProviderReadinessState` and `ProviderCallback` route type.
- `mobile/src/screens/payments/ProviderCallbackScreen.tsx` — safe callback placeholder for `fondixpay://provider/callback`.
- `mobile/App.tsx` — React Navigation linking configuration for the callback placeholder.
- `mobile/src/navigation/AppNavigator.tsx` — authenticated callback placeholder route registration.
- `mobile/src/store/paymentMethodStore.ts` — mock payment methods gated to dev/internal mode.
- `mobile/src/store/serviceCatalogStore.ts` — demo catalog fallback gated to dev/internal mode.
- `mobile/src/screens/payments/ConfirmPaymentScreen.tsx` — payment action replaced with provider-preparation messaging when demo payments are disabled.
- `mobile/src/screens/payments/PaymentMethodsScreen.tsx` — demo method management hidden when demo payments are disabled.
- `mobile/src/screens/payments/AddPaymentMethodMockScreen.tsx` — demo method creation blocked when demo payments are disabled.
- `mobile/src/screens/payments/PaymentFailedScreen.tsx` — support remains reachable while demo retry/change actions are hidden when demo payments are disabled.
- `docs/integrations/TEKAE.md` — mobile provider-state readiness documented.
- `planning/TEKAE_HARNESS.md` — harness status clarified.
- `planning/sprints/008b4-mobile-provider-state-readiness/` — sprint record created.

Sprint and harness audit:

- Registered Tekae sprint records existed for `008b-tekae-integration-discovery` and `008b2-tekae-integration-shell`.
- No `008b4-mobile-provider-state-readiness` sprint record existed before this implementation.
- `planning/TEKAE_HARNESS.md` existed as a documentation/boundary harness only.
- No runtime Tekae harness exists.

Operating status:

- `TEKAE_ENABLED=false` remains required.
- No Tekae API endpoints were invented.
- No Tekae payload contracts were invented.
- No Tekae HTTP calls were added.
- `paymentStore.ts` was not modified.
- Real payments remain blocked.
- Commercial production remains blocked.

Next recommended phase:

Tekae discovery closure: obtain official Tekae documentation, sandbox credentials, callback/webhook contract, transaction-state model, security requirements, and product/security approval before implementing any runtime integration.

# Project State

## Current Status

FONDIXPAY has moved from the previous Prontipagos assumption to Tekae as the approved provider.

Tekae documentation has been received and reviewed for discovery. Current documentation describes Tekae Business SSO access through backend-generated token and responsive URL launch.

The immediate phase is Sprint 010 — Tekae Discovery.

## Active Sprint

planning/sprints/010-tekae-discovery/

## Current Focus

- Document Tekae integration model.
- Define secure App → Backend → Tekae flow.
- Define transaction/session states.
- Identify webhook and reconciliation gaps.
- Capture open questions for Tekae.
- Avoid implementation until requirements and acceptance criteria are approved.

## Sprint 010 Execution Scope

Sprint 010 is documentation and architecture only.

Allowed:

- Tekae discovery documentation.
- Architecture, API, data model, security, reconciliation, transaction-state, risk, question, and decision updates.
- Superseding historical Prontipagos/card-processor assumptions in documentation.

Not allowed:

- Production code.
- Runtime payment logic changes.
- Mobile WebView implementation.
- Webhook endpoint implementation.
- Database migrations.
- Tekae credential configuration.
- Real payment execution.

## Blockers

- Tekae sandbox URL not yet provided.
- Tekae Swagger/API docs not yet provided.
- Tekae test credentials not yet provided.
- Tekae webhook specification not yet provided.
- Tekae reconciliation specification not yet provided.
- Tekae transaction query API not yet provided.
- Production VPN/VPC details not yet clarified.
- Sandbox Swagger and credentials still needed.
- Tekae provider transaction/reference fields not yet confirmed.
- Tekae receipt/comprobante retrieval rules not yet confirmed.

## Sprint 010 Documentation Debt

Historical Prontipagos and card-processor references remain in older planning, backlog, and sprint documents. Sprint 010 preserves the durable decision that Prontipagos is permanently removed, but it does not perform a broad historical cleanup unless references are directly touched by Tekae Discovery.

Recommended follow-up: create a future documentation cleanup sprint to archive, label, or remove stale Prontipagos/card-processor assumptions across historical docs.

## Sprint 012 - Dev Readiness & App Cleanup While Tekae Is Blocked

Current phase: Sprint 012 - Dev Readiness & App Cleanup While Tekae Is Blocked.

Status: IN PROGRESS. Documentation/readiness execution started. Sprint 012 does not implement code, migrations, credentials, backend runtime changes, mobile runtime changes, payment endpoints, webhook endpoints, AWS resource creation, or production deployment changes.

Active sprint:

- `planning/sprints/012-dev-readiness-app-cleanup-while-tekae-blocked/`

Sprint 012 objective:

- Prepare FONDIXPAY for future Tekae runtime integration while Sprint 011 remains externally blocked by missing Tekae contract evidence.
- Document dev readiness, environment strategy, AWS/dev direction, mock/provider boundaries, security hygiene, app copy risk, and cleanup debt.

Sprint 012 operating rules:

- Tekae remains blocked until Sprint 011 contract readiness passes.
- `TEKAE_ENABLED=false` and `TEKAE_MODE=disabled` remain required.
- FONDIXPAY remains a platform/app using Tekae capabilities, not a fintech.
- Tekae remains the approved provider.
- Prontipagos remains permanently removed.
- Historical Prontipagos/card processor references remain documentation debt unless touched by an approved cleanup sprint.

Sprint 012 documentation outputs started:

- `docs/DEV_READINESS.md`
- `docs/ENVIRONMENT.md`
- Updates to architecture, API, deployment, security, risks, questions, and state docs.

Current internal blockers:

- Staging infrastructure is not implemented.
- Current AWS Terraform is dev-only and minimal.
- Current Terraform optional compute is disabled by default.
- Older environment strategy references ECS/RDS targets while current Terraform implements lower-cost dev primitives; this needs future reconciliation before staging.
- App copy/payment success language still needs future review before real provider runtime.

External Tekae blockers remain:

- Sandbox URL.
- Swagger/OpenAPI.
- Test credentials.
- Webhook specification or official no-webhook model.
- Transaction status/query API.
- Reconciliation mechanism.
- Production VPN/VPC or allowlist details.
- Provider transaction/reference fields.
- Receipt/comprobante retrieval rules.
- Support/escalation process.
- Security requirements.

Do not mark Sprint 012 complete until acceptance criteria are reviewed against `planning/sprints/012-dev-readiness-app-cleanup-while-tekae-blocked/acceptance.md`.

## Sprint 013 - Environment Docs Alignment & Mock Payment Copy Cleanup

Current phase: Sprint 013 - Environment Docs Alignment & Mock Payment Copy Cleanup.

Status: COMPLETED. Sprint 013 aligned environment documentation and documented mock payment copy risks. Sprint 013 did not implement code, migrations, credentials, backend runtime changes, mobile runtime changes, payment endpoints, webhook endpoints, Terraform behavior, or production deployment changes.

Active sprint:

- `planning/sprints/013-environment-docs-alignment-mock-payment-copy-cleanup/`

Sprint 013 objective:

- Align `docs/ENVIRONMENT.md` and `docs/ENVIRONMENTS.md` so environment terminology does not imply deployed staging, production, ECS, RDS, or Tekae runtime.
- Preserve AWS as current dev-only infrastructure unless a future approved decision changes it.
- Preserve Vercel as public landing/front-door only.
- Review mock payment copy risks without editing runtime files.

Sprint 013 documentation outputs:

- `docs/MOCK_PAYMENT_COPY_REVIEW.md`
- Updates to environment, risk, question, and state docs.

Sprint 013 completion notes:

- Environment documentation is aligned.
- `docs/ENVIRONMENT.md` is the canonical current environment document.
- `docs/ENVIRONMENTS.md` is retained as a tier matrix/reference, not proof of deployed staging or production.
- Mock payment copy risks were documented in `docs/MOCK_PAYMENT_COPY_REVIEW.md`.
- Tekae remains blocked until Sprint 011 contract readiness passes.

Operating status:

- Tekae remains blocked until Sprint 011 contract readiness passes.
- `TEKAE_ENABLED=false` and `TEKAE_MODE=disabled` remain required.
- FONDIXPAY remains a platform/app using Tekae capabilities, not a fintech.
- Tekae remains the approved provider.
- Prontipagos remains permanently removed.
- Mock/dev payment copy remains a runtime cleanup risk until a future approved UI copy sprint changes mobile/admin surfaces.

Next recommended sprint:

Sprint 014 - Mock Payment UI Copy Cleanup.

## Sprint 014 - Mock Payment UI Copy Cleanup

Current phase: Sprint 014 - Mock Payment UI Copy Cleanup.

Status: COMPLETED. Sprint 014 updated visible mobile mock payment copy so users see demo/prueba/simulacion language instead of wording that could imply real payment execution, bank processing, provider confirmation, WhatsApp delivery, settlement, or production receipt.

Scope completed:

- Mobile visible copy only.
- Success, pending, failed, receipt, history, confirmation, payment method, home, onboarding, notification empty state, profile payment-method, and service-card copy were reviewed and adjusted.
- `docs/MOCK_PAYMENT_COPY_REVIEW.md` was updated with Sprint 014 cleanup status.
- `planning/RISKS.md` records the residual risk that internal technical state names still contain success/paid terminology and must not be reused as visible copy.

Operating status:

- No backend runtime behavior changed.
- No mobile payment logic changed beyond visible copy/string changes.
- No migrations changed.
- No `.env` or secret-bearing files changed.
- No infrastructure, Terraform, workflow, webhook, endpoint, or deployment behavior changed.
- Tekae remains disabled and blocked until Sprint 011 contract readiness passes.
- FONDIXPAY remains a platform/app using Tekae capabilities, not a fintech.
- Prontipagos remains permanently removed and was not reintroduced in mobile copy.

Result:

- Mobile mock/dev payment copy was cleaned so visible UI no longer implies real payment execution, real bank action, real provider confirmation, Tekae processing, WhatsApp delivery, settlement, or production receipt behavior.
- Tekae remains disabled/blocked.
- Prontipagos remains removed.
- FONDIXPAY remains positioned as a service/payment platform, not a fintech.
- No backend, endpoint, webhook, migration, environment, Terraform, workflow, deployment, or payment logic changes were made.
- Validation passed: mobile typecheck and git diff check.

Residual risk:

- Internal technical names such as PaymentSuccess, succeeded, paidAt, and paid remain as controlled technical debt and must not be reused as visible user-facing copy.

Next recommended sprint:

Sprint 015 - Mobile Mock Copy QA And Visual Regression Review, or return to Sprint 011 when Tekae contract readiness evidence is available.

## Sprint 015 - Mobile Mock Copy QA And Visual Regression Review

Current phase: Sprint 015 - Mobile Mock Copy QA And Visual Regression Review.

Status: COMPLETED with static QA fallback. Sprint 015 reviewed the mobile mock payment copy after Sprint 014 and made minor copy-only CTA tightening for likely mobile overflow risk.

Scope completed:

- Static QA reviewed confirmation, success, pending, failure, receipt, history, payment method, home, services, onboarding, profile, notifications, and navigation-related mobile copy.
- Risky-copy searches confirmed visible payment copy does not imply real payment execution, real bank action, real provider confirmation, active Tekae processing, WhatsApp delivery, settlement, production receipt behavior, Prontipagos, or fintech positioning.
- `docs/MOBILE_MOCK_COPY_QA_REVIEW.md` records the QA method, findings, fixes, residual risk, and decision boundary.
- `docs/MOCK_PAYMENT_COPY_REVIEW.md` was updated with Sprint 015 QA summary.
- `planning/RISKS.md` records residual risk that static QA can miss device-specific clipping or theme/font-scale issues.

Fixes made:

- Shortened payment failure retry CTA to `REINTENTAR PRUEBA`.
- Shortened success receipt CTA to `VER COMPROBANTE DEMO`.
- Shortened receipt share CTA to `COMPARTIR RECIBO DEMO`.

Operating status:

- No backend runtime behavior changed.
- No payment logic changed.
- No provider adapter changed.
- No Tekae runtime was enabled.
- No payment endpoint or webhook was created.
- No migrations changed.
- No `.env` or secret-bearing files changed.
- No infrastructure, Terraform, workflow, or deployment behavior changed.
- Tekae remains disabled and blocked until Sprint 011 contract readiness passes.
- FONDIXPAY remains a platform/app using Tekae capabilities, not a fintech.
- Prontipagos remains permanently removed.

Validation status:

- Visual device/simulator/browser screenshot QA was not completed in this environment; Sprint 015 used static QA fallback.
- Expo web command/help was available, but no interactive browser evidence was captured.
- Required validation commands were run after the copy changes.

Next recommended sprint:

Sprint 016 - Mobile Device Screenshot QA, or return to Sprint 011 when Tekae contract readiness evidence is available.

## Sprint 016 - Mobile Device Visual QA Evidence Pack

Current phase: Sprint 016B - Complete Mobile Device Visual QA Evidence Pack.

Status: COMPLETED. Sprint 016B resumed Android emulator screenshot QA and completed the missing mock/dev payment visual evidence pack from Sprint 016.

Scope completed:

- Android emulator `emulator-5554` was available through ADB.
- Expo Go package `host.exp.exponent` was present on the emulator.
- The FONDIXPAY mobile app rendered in Expo Go.
- `docs/MOBILE_DEVICE_VISUAL_QA_EVIDENCE.md` records the QA environment, startup notes, captured evidence, findings, and incomplete acceptance.
- Screenshots were captured under `docs/qa/sprint-016-mobile-device-visual-qa/`.
- Sprint 016B captured the missing `PaymentSuccess`, `PaymentFailed`, `ReceiptDetail`, `ServiceDetail`, `AddPaymentMethodMock`, `PaymentPending`, and payment-related alert/scenario evidence.
- The failed payment recovery action `REINTENTAR PRUEBA` was reachable and returned to `ConfirmPayment`.

Evidence captured:

- Home / services demo dashboard.
- Confirm payment / mock payment confirmation.
- Service detail / mock service payment surface.
- Add payment method mock.
- Payment success.
- Payment failed plus recovery action.
- Receipt detail.
- Payment pending.
- Payment-related in-app alert/scenario state.

Operating status:

- No backend runtime behavior changed.
- No mobile runtime behavior changed.
- No payment logic changed.
- No provider adapter changed.
- No Tekae runtime was enabled.
- No payment endpoint or webhook was created.
- No migrations changed.
- No `.env` or secret-bearing files changed.
- No infrastructure, Terraform, workflow, or deployment behavior changed.
- Tekae remains disabled and blocked until Sprint 011 contract readiness passes.
- FONDIXPAY remains a platform/app using Tekae capabilities, not a fintech.
- Prontipagos remains permanently removed.

Result:

- Captured screenshots confirm that reviewed visible payment copy uses demo/prueba/simulado language and does not imply real payment execution, banking action, provider confirmation, Tekae processing, settlement, WhatsApp delivery, or production receipt behavior.
- Sprint 016 can now be closed for mock/dev mobile visual QA evidence.
- Residual copy debt remains on `ReceiptDetail`: visible technical labels `Prueba: Succeeded` and `Estado Demo: Mock Succeeded` should be replaced with Spanish user-facing demo labels in a future copy cleanup, but they are still presented inside a `Comprobante de prueba` context.

Next recommended sprint:

Return to Sprint 011 when Tekae contract readiness evidence is available, or schedule a narrow receipt-detail copy cleanup if product wants to remove internal English demo status labels before user pilot.


## Sprint 017 - Receipt Detail Demo Label Copy Polish

Current phase: Sprint 017 - Receipt Detail Demo Label Copy Polish.

Status: COMPLETED. ReceiptDetail visible demo status labels were polished from internal English values to Spanish user-facing demo copy.

Implementation summary:

- `ReceiptProofCard` now maps receipt proof status values to Spanish display-only labels for the visible `Prueba` and `Estado demo` rows.
- Internal payment, provider, receipt, and proof status values were not renamed.
- No payment logic, state transitions, backend, provider adapter, Tekae runtime, endpoints, webhooks, migrations, environment files, infrastructure, workflows, deployment behavior, or screenshots changed.

Sprint 017 closes the Sprint 016B residual ReceiptDetail copy debt. The app remains mock/dev only and this sprint does not prove production readiness.

## Sprint 018 - Environment Strategy Formalization

Current phase: Sprint 018 - Environment Strategy Formalization: DEV / STAGING / PROD.

Status: COMPLETED as documentation and planning only.

Scope completed:

- `docs/ENVIRONMENTS.md` is now the canonical DEV / STAGING / PROD environment strategy.
- `docs/ENVIRONMENT.md` is now a short pointer to the canonical strategy.
- DEV is documented as mock/demo only with no real users, no real money, no production credentials, and Tekae disabled.
- STAGING is documented as the future preproduction, QA, release rehearsal, and Tekae sandbox/test environment after Sprint 019 readiness approval.
- PROD is documented as the future real-user production environment with strict secrets, monitoring, backup, rollback, support, audit, and provider controls.
- Vercel is reaffirmed as public landing page only.
- Planning decisions, risks, and open questions were updated for environment separation.

Decision boundary:

- No backend runtime behavior changed.
- No mobile runtime behavior changed.
- No payment logic changed.
- No provider adapter changed.
- No Tekae runtime was enabled.
- No endpoint or webhook was created.
- No migration changed.
- No `.env` file or secret-bearing file was created or modified.
- No infrastructure, Terraform, workflow, deployment, domain, DNS, or Vercel behavior changed.

Next recommended sprint:

Sprint 019 - Tekae Integration Readiness Pack, or Sprint 020 - Service Coverage + Geolocation Design after the environment model is accepted.

## Sprint 019 - Tekae Integration Readiness Pack

Current phase: Sprint 019 - Tekae Integration Readiness Pack.

Status: COMPLETED as documentation and planning only.

Scope completed:

- `docs/TEKAE_INTEGRATION_READINESS.md` was created as the canonical Tekae readiness pack.
- The readiness pack documents the responsive URL flow, backend-only token/session generation, Tekae token endpoint sequence, access token lifecycle, environment gates, security rules, proposed session API contract, error states, branding/personalization readiness, operational checklist, and open questions.
- `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/API.md`, and `docs/ENVIRONMENTS.md` now point to the Sprint 019 readiness boundary.
- Planning decisions, risks, and open questions were updated for Tekae readiness.

Decision boundary:

- No backend runtime behavior changed.
- No mobile runtime behavior changed.
- No payment logic changed.
- No provider adapter changed.
- No Tekae runtime was enabled.
- No endpoint or webhook was created.
- No migration changed.
- No `.env` file or secret-bearing file was created or modified.
- No infrastructure, Terraform, workflow, deployment, domain, DNS, or Vercel behavior changed.
- `POST /api/payments/tekae/session` remains proposed/not implemented.
- Tekae remains disabled until a later approved implementation sprint.

Next recommended sprint:

Sprint 020 - Service Coverage + Geolocation Design, or a Tekae implementation sprint only after sandbox credentials, exact URLs, secure network path, rendering strategy, audit fields, support process, and operational ownership are approved.

## Sprint 020 - Service Coverage + Geolocation Design

Current phase: Sprint 020 - Service Coverage + Geolocation Design.

Status: COMPLETED as documentation and planning only.

Scope completed:

- `docs/SERVICE_COVERAGE_GEOLOCATION_DESIGN.md` was created as the canonical coverage/geolocation design.
- State-based MVP filtering, national services, `MX-*` taxonomy, GPS permission flow, manual fallback, unknown/unsupported location behavior, privacy rules, environment behavior, future data model, future API contracts, mobile UX proposal, backend responsibilities, Tekae mapping considerations, validation plan, risks, questions, and future acceptance criteria were documented.
- `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/SECURITY.md`, and `docs/ENVIRONMENTS.md` were updated with Sprint 020 references/rules.
- Planning decisions, risks, and open questions were updated for service coverage and geolocation.

Decision boundary:

- No runtime geolocation was implemented.
- No Expo Location dependency was installed.
- No reverse geocoding was implemented.
- No service filtering runtime was changed.
- No backend endpoint was created or modified.
- No database migration was created.
- No Tekae runtime behavior was activated.
- No payment logic changed.
- No provider adapter changed.
- No `.env` file or secret-bearing file was created or modified.
- No infrastructure, Terraform, workflow, deployment, domain, DNS, or Vercel behavior changed.

Next recommended sprint:

Implement service coverage/geolocation only after the source of truth, state-code normalization strategy, reverse geocoding provider, permission copy, storage decision, STAGING fixtures, and support/operations visibility are approved.

## Sprint 021 - Tekae Catalog Coverage Normalization Design

Current phase: Sprint 021 - Tekae Catalog Coverage Normalization Design.

Status: COMPLETED as documentation and planning only.

Scope completed:

- `docs/TEKAE_CATALOG_NORMALIZATION_DESIGN.md` was created as the canonical Tekae catalog normalization design.
- The design documents read-only catalog workbook metadata, normalized `ServiceCatalogItem` fields, Tekae `menu`/`categoria`/`carrier` provider metadata, coverage modes, `coverageStates`, `MX-ALL` / `NATIONAL` handling, unknown coverage review behavior, internal taxonomy, environment behavior, data privacy/security rules, proposed future parser/import plan, proposed future API implications, validation plan, open questions, and future implementation acceptance criteria.
- `docs/SERVICE_COVERAGE_GEOLOCATION_DESIGN.md`, `docs/TEKAE_INTEGRATION_READINESS.md`, `docs/API.md`, and `docs/ARCHITECTURE.md` were updated with Sprint 021 references and proposed/not implemented boundaries.
- Planning decisions, risks, and open questions were updated for Tekae catalog normalization.

Decision boundary:

- No catalog parser or import implementation was added.
- No normalized catalog output file was generated.
- No runtime service filtering was implemented.
- No geolocation behavior was implemented.
- No Tekae runtime behavior was activated.
- No backend runtime behavior changed.
- No mobile runtime behavior changed.
- No payment logic changed.
- No provider adapter changed.
- No endpoint or webhook was created or modified.
- No database migration was created.
- No `.env` file or secret-bearing file was created or modified.
- No infrastructure, Terraform, workflow, deployment, domain, DNS, or Vercel behavior changed.
- No raw catalog workbook was copied into the repository.

Next recommended sprint:

Implement catalog ingestion only after official catalog ownership, stable Tekae identifiers, state-code compatibility, `MX-ALL` / `NATIONAL` convention, manual review ownership, STAGING validation threshold, and production import approval are decided.

## Sprint 022 - Tekae Catalog Coverage Normalization Implementation

Current phase: Sprint 022 - Tekae Catalog Coverage Normalization Implementation.

Status: IMPLEMENTED for backend/local pure normalization only.

Scope completed:

- Added a pure backend Tekae catalog row normalizer under `backend/app/modules/service_catalog/tekae_normalizer.py`.
- Added synthetic unit tests under `backend/tests/test_tekae_catalog_normalizer.py`.
- The normalizer validates required catalog columns, preserves Tekae `menu`, `categoria`, and `carrier` as provider metadata, normalizes compatible short state codes to canonical `MX-*`, handles `MX-ALL` / `NATIONAL`, marks unknown coverage as `UNKNOWN_REVIEW_REQUIRED`, and keeps disabled/rejected rows non-user-facing.

Decision boundary:

- No real Excel workbook was copied, committed, transformed, or used as committed output.
- No raw catalog rows were committed.
- No endpoint was created or modified.
- No database persistence or migration was added.
- No mobile runtime behavior changed.
- No GPS or service filtering runtime changed.
- No Tekae runtime, SSO, token generation, payment session, provider call, payment logic, webhook, `.env`, secret, infrastructure, deployment, workflow, Vercel, or Prontipagos work was added.

## Sprint 023 - Mobile State Selector Mock Implementation

Current phase: Sprint 023 - Mobile State Selector Mock Implementation.

Status: IMPLEMENTED as mobile-only local mock state selection.

Scope completed:

- Added canonical mock Mexico state options for the mobile selector using `MX-*` codes.
- Added a local mobile state preference store that follows the existing Zustand + SecureStore app pattern.
- Added a simple reusable mobile state selector card.
- Displayed the selected state on Home and Profile.
- Allowed users to change the selected state manually.
- User-facing copy states that this prepares future service availability behavior and does not claim real filtering is active.

Decision boundary:

- `MX-ALL` remains an internal national coverage concept and is not a selectable user state.
- The selected state is a local UX preference for future availability behavior, not sensitive financial data.
- No service filtering was implemented.
- No service catalog API behavior changed.
- No backend endpoint was created or modified.
- No database persistence or migration was added.
- No GPS, Expo Location dependency, permission prompt, reverse geocoding, city detection, coordinate storage, or location tracking was added.
- No mobile payment flow, payment logic, provider call, Tekae runtime, SSO, token generation, webhook, `.env`, secret, infrastructure, deployment, workflow, Vercel, Prontipagos, or raw catalog/workbook handling was added.

## Sprint 024 - GPS Permission + Manual Fallback Implementation

Current phase: Sprint 024 - GPS Permission + Manual Fallback Implementation.

Status: IMPLEMENTED as mobile-only optional foreground GPS state suggestion with manual fallback.

Scope completed:

- Added Expo foreground location support through `expo-location`.
- Added a small mobile state resolver that maps reverse-geocoded Mexican state names to approved `MX-*` state codes.
- Extended the local mobile state preference store to persist selected state code, state name, source (`manual`, `gps`, or `unknown`), and timestamp only.
- Updated the mobile state selector card with an explicit `Usar mi ubicación` action.
- Added denied, failed, unresolved, and resolved GPS UI feedback while keeping manual state selection visible.
- Kept Home and Profile using the same reusable selector card from Sprint 023.
- Added user-facing copy that GPS only suggests the state and that the state will be used for future service availability behavior.

Decision boundary:

- Location permission is foreground-only and triggered only by explicit user action.
- No permission request runs silently on app launch.
- No background location, continuous tracking, geofencing, city detection, or exact coverage claim was added.
- Raw latitude/longitude are not persisted in Zustand, SecureStore, AsyncStorage, docs, backend, API payloads, or logs.
- Coordinates are not sent to backend, Tekae, analytics, or provider flows.
- Manual override remains available after GPS detection and changes the source back to `manual`.
- No service filtering or coverage-aware catalog filtering was implemented.
- No backend endpoint, API contract, database persistence, migration, Tekae runtime, SSO, token generation, provider call, payment flow, webhook, `.env`, secret, infrastructure, deployment, workflow, Vercel, Prontipagos, or core transaction behavior changed.

## Sprint 025 - Coverage-Aware Service Filtering

Current phase: Sprint 025 - Coverage-Aware Service Filtering.

Status: IMPLEMENTED as mobile-only demo/local service filtering.

Scope completed:

- Added a pure mobile service coverage filter using the existing selected `MX-*` state preference.
- National demo services appear for every selected state.
- State-specific demo services appear only when their synthetic `coverageStates` includes the selected state.
- Unknown, disabled, inactive, rejected, and not-user-facing services are excluded from the active mobile list.
- The Services demo screen now shows the selected state context and safe demo copy for state-aware service availability.
- Demo service metadata was extended with synthetic `coverageMode` and `coverageStates` only.

Decision boundary:

- Sprint 025 is mobile-only and does not change backend, API endpoints, database schema, migrations, payment logic, provider calls, Tekae runtime, SSO, token generation, webhooks, `.env`, secrets, infrastructure, deployment, workflows, Vercel, Prontipagos, GPS permission behavior, reverse geocoding, coordinate handling, or real catalog production sources.
- The current public mobile catalog API still does not require `coverageMode` or `coverageStates`; mobile mapping only tolerates optional future fields.
- Demo filtering prepares coverage-aware behavior and does not prove real provider availability or production coverage.

## Sprint 026 - Mobile Dependency Audit Review + Tekae NDA Handling Update

Current phase: Sprint 026 - Mobile Dependency Audit Review + Tekae NDA Handling Update.

Status: COMPLETED as analysis/documentation only.

Scope completed:

- Ran the approved mobile dependency audit commands and documented findings in `docs/MOBILE_DEPENDENCY_AUDIT.md`.
- Classified reported mobile vulnerabilities by severity, direct/transitive path, practical runtime/tooling impact, exploitability, recommended action, and remediation risk.
- Confirmed the audit findings are concentrated in Expo CLI/config/build tooling transitive packages and that blind remediation points toward a breaking Expo SDK upgrade.
- Documented that Tekae NDA is in place and that Tekae-provided materials are confidential external references.
- Updated decisions, risks, questions, file inventory, security docs, Tekae readiness docs, and catalog normalization docs with confidentiality controls.
- Added generic `.gitignore` protections for confidential/raw external files and private sample/reference folders.

Decision boundary:

- No `npm audit fix`, `npm audit fix --force`, `npm update`, `npm install`, `npx expo install`, dependency removal, manual version edit, package-lock edit, Expo SDK change, React Native change, mobile runtime change, backend runtime change, payment change, GPS/location change, service filtering change, Tekae runtime, SSO, token generation, `.env`, secret, infrastructure, deployment, workflow, real Tekae catalog source, NDA copy, manual copy, credential copy, token copy, or raw Tekae data copy was added.
- Tekae NDA, manuals, real catalog files, credentials, token material, sensitive URLs, commercial terms, and provider-internal materials remain outside the repository.
