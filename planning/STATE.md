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
