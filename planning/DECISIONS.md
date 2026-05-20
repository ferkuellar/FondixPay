# Durable Decisions

Updated: 2026-05-19

## ADR-001 - Treat FondixPay as a Production-Intended Mobile Product

Decision: FondixPay will be governed as a production-intended mobile application, even though the current implementation is MVP mock/dev.

Rationale: Financial product behavior requires early discipline around scope, auditability, security, validation, and future operations.

## ADR-002 - Preserve Current Stack

Decision: Keep Expo/React Native/TypeScript for mobile and FastAPI/SQLAlchemy for backend during Phase 1.

Rationale: The repo already has working initial implementation. This phase is governance-only.

## ADR-003 - Current Payment Flow Is Mock/Dev

Decision: The current payment, receipt, and provider flows are mock/dev only.

Rationale: No real provider, ledger, reconciliation, audit log, or compliance controls are implemented.

## ADR-004 - No Real Payments Before Hardening

Decision: Real payments will not be connected until architecture, security, auditability, validation, and provider selection are completed.

Rationale: Real money movement without controls creates unacceptable product, legal, and operational risk.

## ADR-005 - Audit Required for Future Financial Actions

Decision: Every future action that alters balance, payment, receipt, service state, provider response, or administrative state must produce an audit log.

Rationale: Financial actions must be traceable and reviewable.

## ADR-006 - No Real Secrets in Repo

Decision: Real credentials, API keys, tokens, passwords, private URLs, and signing material must not be committed.

Rationale: Secret exposure creates direct security and compliance risk.

## ADR-007 - AXON-AI Architect / Builder Is Official

Decision: AXON-AI Architect / Builder is the official project methodology.

Rationale: The handoff must be durable and file-based, not dependent on chat context.

## ADR-008 - UI/UX Reference

Decision: Future UI/UX work must align with `fondix.png` if that asset is added under the repo or `references/`.

Rationale: Visual direction must be explicit before production polish.

Current asset status: `fondix.png` was not found in this repo during Phase 1 inspection.

## ADR-009 - Phase 2 Is Audit Baseline, Not Feature Hardening

Decision: Phase 2 records the technical hardening baseline and backlog without changing runtime behavior.

Rationale: The product still runs mock/dev flows. The safest next step is to document exact risks and implement hardening in targeted follow-up work.

## ADR-010 - Keep Mock Payment Flow Unchanged During Technical Audit

Decision: Payment, receipt, user service, and mobile navigation behavior remain unchanged in Phase 2.

Rationale: The phase goal is architecture audit and validation. Changing payment semantics before ledger/audit/provider decisions would create hidden risk.

## ADR-011 - Do Not Apply Breaking Dependency Fixes Automatically

Decision: `npm audit fix --force` will not be applied automatically during Phase 2.

Rationale: The audit indicates a breaking Expo upgrade path. Dependency remediation must be planned and validated separately.

## ADR-012 - Development OTP Length (6 Digits)

Decision: The development OTP remains 6 digits (`123456`) as documented in `AGENTS.md` and implemented in the current codebase. The 4-digit OTP shown in mockups `03-otp-input.png` and `04-otp-active.png` is outdated. `OtpVerificationScreen` must render 6 input boxes, not 4.

Rationale: Changing OTP length would alter auth semantics and dev tooling without an approved auth sprint. Visual mockups for OTP are superseded for digit count only.

## ADR-013 - UI Visual Reference Assets

Decision: `fondix.png` is not used. Sprint 003 visual reference is the 14 per-screen PNGs in `references/` (`01-splash.png` through `14-history.png`). `docs/UI_UX_GUIDELINES.md` must note this at sprint close.

Rationale: Per-screen references are present in the repo and map directly to implementation screens. This supersedes the asset status note in ADR-008 for Sprint 003 execution.

## ADR-014 - Mobile Styling Approach (StyleSheet + Theme Tokens)

Decision: Keep React Native `StyleSheet` with centralized design tokens under `mobile/src/theme/`. Do not introduce NativeWind, Tailwind, or other styling frameworks in Sprint 003.

Rationale: Preserve the existing implementation pattern and avoid a large structural migration without justification.

## ADR-015 - Splash Illustration Placeholder

Decision: The central splash illustration (person with phone and floating service icons in `01-splash.png`) is implemented as a marked visual placeholder (`View` with background + emoji) until the real asset is delivered. Code must include a `TODO` comment referencing the pending asset.

Rationale: The illustration is not available as a production asset in the repo; a labeled placeholder avoids blocking the rest of the UI system work.

## ADR-016 - Environment-Gated OTP Behavior

Decision: Development OTP may be returned to the client only in `development` or `test` when `OTP_DEV_RESPONSE_ENABLED=true`. In `staging` and `production`, the backend must not return `otp_dev` to clients.

Rationale: Returning OTP values is useful for local development but is unacceptable in production-like environments.

## ADR-017 - No Insecure JWT Secret Outside Development

Decision: `JWT_SECRET_KEY` is mandatory and must be strong in `staging` and `production`. Known placeholder values such as `change-me`, `dev-secret`, `secret`, and short values are rejected at settings validation time.

Rationale: Weak JWT signing secrets allow token forgery and are a hard blocker for any production-like environment.

## ADR-018 - Auth Hardening Before Real Payments

Decision: No real payment integration may begin until minimum auth, session, audit, and ledger controls are closed and accepted.

Rationale: Real money movement requires trustworthy identity, traceability, and server-side financial controls.

## ADR-019 - Token Lifecycle Remains Access-Token-Only For Now

Decision: Phase 4A keeps the current access-token-only model. Refresh tokens, token revocation, device trust, and server-side session inventory are deferred to a later auth/session phase.

Rationale: Adding a complete token lifecycle requires schema, API, mobile storage, revocation semantics, and migration work outside this P0 hardening scope.

## ADR-020 - Backend Tests Required Before Real Payment Integration

Decision: No real payment integration may start until backend tests cover at minimum auth, payments, receipts, and user-scoped data boundaries.

Rationale: Payment providers must not be connected on top of unverified access control and mock-payment behavior.

## ADR-021 - Test Database Isolation

Decision: Backend tests must use an isolated test database, SQLite in memory, or another controlled test database mechanism. Tests must not depend on manual local data.

Rationale: Repeatable tests require deterministic setup and teardown independent from developer machines.

## ADR-022 - Migration Discipline Before Production

Decision: `Base.metadata.create_all(bind=engine)` may remain for dev/mock while this phase focuses on tests. Before staging or production, schema changes must move to Alembic as the disciplined source of truth.

Rationale: Automatic table creation masks schema drift and is not acceptable for production-like environments.

## ADR-023 - Predictable API Errors

Decision: API errors must remain predictable, avoid sensitive details, and be testable. Broad response-envelope refactors are deferred unless mobile compatibility is planned.

Rationale: The current mobile app expects FastAPI-style errors in several places; safety improvements must not break clients casually.

## ADR-024 - Commercial Production Is Blocked By UX/Product Critical Risks

Decision: FondixPay cannot launch to commercial production with real money until the 5 critical UX/Product risks documented in `docs/UX_PRODUCT_AUDIT.md` are resolved.

Rationale: Fee transparency, payment method ownership, recovery paths, trust signals, and OTP/security alignment are required before users can safely perform real payments.

## ADR-025 - Fees Must Be Visible Before Payment Confirmation

Decision: Every FondixPay fee must be visible before payment confirmation, on the confirmation screen, and on the receipt.

Rationale: Hidden or late fees create user distrust, complaints, chargeback risk, and unacceptable fintech product risk.

## ADR-026 - OTP Must Remain 6 Digits

Decision: OTP design and future mockups must align to the current 6-digit OTP. Mockups that show 4 digits are obsolete for FondixPay.

Rationale: The implementation and documented auth posture use a 6-digit OTP. Design drift around OTP length weakens security expectations and confuses implementation.

## ADR-027 - Payment Method Flow Is Required Before Real Payments

Decision: A real payment screen cannot assume a preselected card or method unless an approved add/select/manage payment method flow exists.

Rationale: Users must explicitly understand and control how they pay before any real provider integration.

## ADR-028 - Payment Recovery Path Is Mandatory

Decision: Any real payment flow must include failure state, retry, change method, support path, and clear charged/not-charged messaging.

Rationale: Payment ambiguity creates double-attempt, support, reconciliation, and trust risks.

## ADR-029 - Trust Signals Are Product Requirements, Not Decoration

Decision: Splash, onboarding, and payment surfaces must communicate real trust requirements: operator identity, data protection, fee transparency, support path, and security model.

Rationale: Trust messaging must reflect actual controls and help non-bancarized or cautious users understand the product before paying.

## ADR-030 - No Real Payments Before Ledger And Audit Foundation

Decision: FondixPay will not integrate real payments until ledger, audit logs, idempotency, and minimum tests are implemented and accepted.

Rationale: Real money movement without traceability, auditability, and duplicate prevention creates unacceptable financial and operational risk.

## ADR-031 - Amounts Stored As Integer Minor Units

Decision: All financial amounts must be stored as integers in minor units, such as centavos, with explicit currency.

Rationale: Floats and ambiguous currency fields create rounding and reconciliation errors.

## ADR-032 - Ledger Entries Are Append-Only

Decision: Ledger entries must not be destructively updated or deleted. Errors and reversals are represented with compensating entries.

Rationale: Financial history must be immutable and reviewable.

## ADR-033 - Audit Events Are Append-Only

Decision: Critical financial, auth, provider, and future admin actions must emit immutable audit events.

Rationale: Auditability is required for support, finance, compliance, incident review, and provider reconciliation.

## ADR-034 - Provider Confirmation Is Separate From User-Facing Success

Decision: The app must not display final payment confirmation until provider confirmation rules and internal ledger requirements are satisfied.

Rationale: Provider acceptance, timeout, internal success, and user-facing success are different states. Collapsing them creates false-success risk.

## ADR-035 - Idempotency Required For Payment Confirmation

Decision: Payment confirmation and retry must use idempotency keys to prevent double provider submission or double charge.

Rationale: Double tap, network retries, and provider timeouts are normal payment-system failure modes.

## ADR-036 - Prontipagos Integration Requires Provider Transaction Mapping

Decision: Before integrating Prontipagos, FondixPay must map service catalog, reference validation, amount lookup, payment execution, provider confirmation, error codes, receipts, and reconciliation.

Rationale: Provider-specific behavior must be explicit before sandbox or real integration work begins.
