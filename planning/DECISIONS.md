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

## ADR-037 - Audit Event Writer Becomes Mandatory For Critical Actions

Decision: Critical auth, user-service, payment, receipt, provider, and future admin actions must use the central audit event writer.

Rationale: Audit behavior must be consistent, redacted, testable, and reviewable across modules.

## ADR-038 - Request ID And Correlation ID Are First-Class Operational Identifiers

Decision: Every request must carry or receive a `request_id`, and each financial flow must carry a `correlation_id`.

Rationale: Support, incident review, financial investigation, and reconciliation require stable identifiers across API, audit, payments, receipts, and provider records.

## ADR-039 - Payment Mock Must Use Idempotency Semantics Before Real Providers

Decision: Mock payment confirmation must support idempotency semantics before any real provider is introduced.

Rationale: Double taps and retries happen before provider integration; the mock flow should exercise the same duplicate-prevention discipline.

## ADR-040 - Payment State Transitions Must Be Explicit

Decision: Payment intent and attempt status changes must pass through a controlled state-transition validator.

Rationale: Financial status changes should not be scattered as unchecked assignments because invalid transitions create false success, retry, and reconciliation risk.

## ADR-041 - Alembic Is Preferred For Schema Evolution

Decision: Ledger and audit tables are represented by Alembic migration when viable. `Base.metadata.create_all` may remain only as local/dev/test support while migration discipline is completed.

Rationale: Production-like environments need repeatable schema evolution and rollback visibility.

## ADR-042 - Fee Disclosure Before Payment Confirmation

Decision: FondixPay must show the service amount, FondixPay fee, and final total before a user confirms any payment.

Rationale: Users must understand the cost of payment before consent. Hidden fees are a production blocker.

## ADR-043 - Fee Breakdown Must Be Consistent Across Payment Screens

Decision: Payment detail, confirmation, CTA, success, receipt, and history surfaces must use the same payment breakdown.

Rationale: Inconsistent totals create support, complaint, chargeback, and trust risk.

## ADR-044 - Mock Fee Model Is Allowed Only For Dev/MVP

Decision: A fixed mock/dev fee model is allowed while payments remain mock. Before production, the fee model must be replaced or approved by product/legal/commercial stakeholders.

Rationale: A mock fee is useful for UX validation but must not be mistaken for a final commercial model.

## ADR-045 - Trust Copy Must Be Specific And Truthful

Decision: FondixPay UI must use specific trust copy and must not claim regulation, PCI, tokenization, bank-grade protection, or "100% secure" controls unless implemented and approved.

Rationale: Unsupported security/compliance claims create user harm and legal/commercial risk.

## ADR-046 - No Phantom Payment Methods

Decision: The app must not show cards or other methods as real selected methods unless a real flow or explicit mock method exists.

Rationale: Phantom methods mislead users and create support, security, and compliance risk.

## ADR-047 - Raw Card Data Must Never Be Stored

Decision: FondixPay will not store full PAN, CVV, or sensitive card data. Future cards must use an approved provider tokenization/vault flow.

Rationale: Raw card storage creates unacceptable PCI and data exposure risk.

## ADR-048 - Payment Method Strategy Is Card-Focused

Decision: Payment method UX must focus on debit and credit card add/select/change behavior for the current roadmap.

Rationale: FondixPay is card-only for user-facing payments. Segment research may inform card onboarding and trust copy, but it must not reopen unsupported methods without a new roadmap decision.

## ADR-049 - Mock Payment Method Allowed Only In Dev/Internal Validation

Decision: Mock payment method can be used only for development and internal/closed validation without real money, and must be clearly labeled.

Rationale: Mock methods are useful for flow validation but cannot imply real provider capability.

## ADR-050 - Payment Confirmation Requires Selected Payment Method

Decision: Before any real payment, confirmation must include selected method, final total, and a change-method action.

Rationale: Payment consent requires both amount and method clarity.

# ADR-051 — Payment method mock UX before real provider

## Decision

FondixPay will provide a mobile mock/dev UX for adding and selecting a payment method before integrating any real provider.

## Status

Accepted.

# ADR-052 — Demo payment methods must be explicitly labeled

## Decision

Every demo payment method must clearly state that it is simulated and does not generate real charges.

## Status

Accepted.

# ADR-053 — No real card fields in mock flow

## Decision

The mock flow must not ask for card number, CVV, expiration, CLABE, or any real payment credential.

## Status

Accepted.

# ADR-054 — Payment confirmation must display selected method

## Decision

Payment confirmation must display the selected payment method and allow the user to add or change it before paying.

## Status

Accepted.

# ADR-055 — Payment recovery before real provider integration

## Decision

FondixPay must define payment recovery paths before Prontipagos sandbox work or any real payment integration.

## Rationale

Recovery paths prevent duplicate charges, ambiguous states, missing receipts, unsupported retries, and support cases without evidence.

## Status

Accepted.

# ADR-056 — No paid state without sufficient confirmation

## Decision

No payment can be shown as paid without sufficient internal/provider confirmation rules.

## Rationale

Provider timeout, provider acceptance, backend processing, and final payment confirmation are different states. Collapsing them creates false-success risk.

## Status

Accepted.

# ADR-057 — Retry must be idempotent

## Decision

Every future retry must use an idempotency key or equivalent duplicate-prevention mechanism.

## Rationale

Retries from double tap, network timeout, or provider uncertainty must not create duplicate charges.

## Status

Accepted.

# ADR-058 — User-facing payment messages must reduce panic

## Decision

Payment recovery messages must state whether the result is failed, pending, timeout, or duplicate-blocked and must tell the user what to do next.

## Status

Accepted.

# ADR-059 — Support path must expose safe troubleshooting references

## Decision

Payment recovery UX must prepare safe mock references now and future `request_id`/`correlation_id` references for support without exposing sensitive data.

## Status

Accepted.

# ADR-060 — Balance must be derived from ledger

## Decision

Visible balance must not be an arbitrary editable field. It must derive from ledger entries or a controlled derived snapshot.

## Status

Accepted.

# ADR-061 — Demo balance must never be confused with real money

## Decision

Every simulated balance must be flagged and communicated as demo/mock.

## Status

Accepted.

# ADR-062 — Available, pending and held balances are separate

## Decision

Available, pending, and held balance concepts must be modeled and displayed separately.

## Status

Accepted.

# ADR-063 — Account status changes require audit events

## Decision

Every future account status change must emit an audit event.

## Status

Accepted.

# ADR-064 — No wallet/real balance without legal and provider model

## Decision

FondixPay will not implement a real wallet or real balance without legal review, provider/custody model, ledger, audit, and reconciliation.

## Status

Accepted.

# ADR-065 — Simulated balance implementation is demo-only

## Decision

The Phase 6B balance implementation is demo/mock only and does not represent real money.

## Status

Accepted.

# ADR-066 — Account balance endpoints require authentication

## Decision

Account, balance, and movement endpoints must require an authenticated user and only return data for the current user.

## Status

Accepted.

# ADR-067 — Balance fields use integer minor units

## Decision

Available, pending, held, and simulated balance fields are exposed as integer minor units with explicit currency.

## Status

Accepted.

# ADR-068 — Balance is not stored in Secure Store

## Decision

Mobile may keep demo balance in in-memory state but must not persist balance in Secure Store.

## Status

Accepted.

# ADR-069 — Demo movements must display non-real-money disclaimer

## Decision

Balance and movement UI must communicate that demo data is simulated and not real money.

## Status

Accepted.

# ADR-070 — Receipt status must be explicit

## Decision

Every visible receipt projection must state whether the receipt is generated, pending, unavailable, or future-voided.

## Status

Accepted.

# ADR-071 — Transaction history must distinguish succeeded, pending and failed

## Decision

History must not represent pending, timeout, failed, or duplicate-blocked payment attempts as paid success.

## Status

Accepted.

# ADR-072 — Receipt detail must include fee breakdown

## Decision

Receipt and transaction detail surfaces must show service amount, fee, total, and currency from the approved breakdown source.

## Status

Accepted.

# ADR-073 — Mock receipts must be labeled

## Decision

Mock/dev receipt surfaces must say they are not real provider confirmation.

## Status

Accepted.

# ADR-074 — Movements, receipts and payments must be traceable

## Decision

Visible financial history must carry current or future trace links through payment, receipt, movement, request, or correlation identifiers.

## Status

Accepted.

## Status

## ADR-075 — Card-only user payment model

FondixPay supports service payments exclusively through debit and credit cards as the user-facing payment method.

FondixPay will use a future approved card processor for card tokenization and user charges.

FondixPay will use Prontipagos as the service payment aggregator to execute payments to service providers.

Prontipagos must not be assumed to be the user-facing card processor unless confirmed by contract or API documentation.

Out of scope for the current roadmap:

- SPEI
- CoDi
- OXXO
- cash-in
- wallet balance as a real payment method
- bank transfer
- stored-value payment methods

Implications:

- Card tokenization is mandatory before real payments.
- FondixPay must never store PAN or CVV.
- PCI/security review is required before production.
- Card decline, expired card, invalid CVV, processor timeout, 3DS/auth challenge and chargeback workflows must be designed.
- Prontipagos integration is separate from card processing.

Accepted.

## ADR-077 — Card processor is separate from Prontipagos

Decision: FondixPay will use a card processor to tokenize/charge the user's debit or credit card and Prontipagos to execute the service-payment leg. They are separate integrations.

Status: Accepted.

## ADR-078 — Tokenization required for real card payments

Decision: FondixPay will not store PAN or CVV. Every real card payment requires tokenization through an approved processor flow.

Status: Accepted.

## ADR-079 — Hosted fields or mobile SDK tokenization preferred

Decision: FondixPay will prefer hosted fields, hosted checkout, mobile SDK tokenization, or an equivalent approved provider-controlled capture path to reduce PCI scope.

Status: Accepted.

## ADR-080 — Card charge must complete before service execution

Decision: Service-payment execution through Prontipagos must not start until the card charge or authorization has an approved state under the card processor strategy.

Status: Accepted.

## ADR-081 — Card processor sandbox before production

Decision: Any card integration must be exercised in sandbox for success, decline, timeout, duplicate, expired-card, and auth-challenge paths before production.

Status: Accepted.
