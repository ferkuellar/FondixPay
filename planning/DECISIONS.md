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

## ADR-144 - Public landing chatbot is an owned web channel

Decision: The public landing chatbot is a web-first owned channel and does not depend on Meta, WhatsApp Cloud API, Twilio, WhatsApp Web extensions, or third-party chat widgets.

Rationale: The landing assistant must stay controlled, auditable, and separate from unsupported messaging channels.

Status: Accepted.

## ADR-145 - Approved chatbot visual design is preserved

Decision: The approved floating chatbot FAB, robot SVG, tooltip, panel, colors, animations, suggested pills, message bubbles, and input style must remain unchanged during implementation. Only the backend integration may change.

Rationale: The founder-approved UI is the visual contract for Phase 10X.1.

Status: Accepted.

## ADR-146 - Public chatbot is informational and routing-only

Decision: The public chatbot must not access private customer data, payment data, transaction status, receipt details, balances, OTP validation, card checks, or account-level operations.

Rationale: The landing page is unauthenticated and must not become a public data oracle or payment operations surface.

Status: Accepted.

## ADR-147 - CRM/Admin owns chatbot response configuration

Decision: The CRM/Admin includes a response console to manage FAQs, intents, knowledge base entries, bot settings, conversations, and fallbacks.

Rationale: Public chatbot answers need operational governance, RBAC, audit events, and fallback review.

Status: Accepted.

## ADR-148 - Chatbot works without an AI provider

Decision: If no AI provider is configured, the chatbot continues operating in FAQ/rule/intent/knowledge/fallback mode.

Rationale: Availability and safety must not depend on external AI credentials during MVP readiness.

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

## ADR-082 — Prontipagos is the service payment aggregator

Decision: FondixPay will use Prontipagos to execute service payments, separate from the future card processor.

Status: Accepted.

## ADR-083 — Service payment execution requires successful card charge

Decision: FondixPay must not execute a Prontipagos service payment when the card charge or authorization failed, is pending, timed out, or is unknown.

Status: Accepted.

## ADR-084 — Provider timeout is not success

Decision: Timeout or unknown Prontipagos outcome is pending/review evidence, not paid success.

Status: Accepted.

## ADR-085 — Provider references must be stored separately

Decision: Prontipagos references must remain separate from internal IDs for reconciliation, support, and audit.

Status: Accepted.

## ADR-086 — Prontipagos integration requires reconciliation and manual review

Decision: Prontipagos cannot move to production without reconciliation and manual review/admin support paths.

Status: Accepted.

## ADR-087 — Sandbox adapters before real provider integrations

Decision: FondixPay will implement sandbox/mock contractual adapters before any productive card processor or Prontipagos integration.

Status: Accepted.

## ADR-088 — Prontipagos execution is gated by card charge success

Decision: Service-payment execution through Prontipagos can run only when the controlled internal card charge/auth state is successful.

Status: Accepted.

## ADR-089 — Provider integrations must be idempotent

Decision: Card charge and Prontipagos service-payment execution must use idempotency keys to prevent duplicate charge or duplicate service payment.

Status: Accepted.

## ADR-090 — Ambiguous provider results require recovery/manual review

Decision: Timeout, pending, or unknown card-processor or Prontipagos outcomes must not be marked success and must remain pending/recovery/manual-review states.

Status: Accepted.

## ADR-091 — Contractual mocks are acceptable until official sandbox docs/credentials exist

Decision: When official sandbox documentation or credentials are absent, documented contractual mocks with tests are acceptable and must not be represented as real integrations.

Status: Accepted.

## ADR-092 — Receipt confirmation requires valid payment/provider state

Decision: FondixPay must not show confirmed proof when the payment or provider state is pending, failed, timeout, or unknown.

Status: Accepted.

## ADR-093 — Proof of payment must include fee breakdown and status

Decision: Every proof must show service amount, fee, total, currency, state, and a support-safe reference.

Status: Accepted.

## ADR-094 — Mock/sandbox receipts must be labeled

Decision: Mock/sandbox receipts must say they are not production confirmation or fiscal proof.

Status: Accepted.

## ADR-095 — Notifications must reflect exact payment state

Decision: Notifications must distinguish confirmed, pending, failed, timeout, and unavailable receipt states.

Status: Accepted.

## ADR-096 — Support-safe references are required

Decision: Receipt and payment status surfaces expose safe references such as payment id, receipt id, correlation id, and provider reference when applicable.

Status: Accepted.

## ADR-097 — CRM Admin Panel is required before commercial production

Decision: FondixPay requires a CRM/Admin Panel before commercial production for support, reconciliation, manual review, auditability, and operations.

Status: Accepted.

## ADR-098 — CRM Admin Panel requires strict RBAC

Decision: Every CRM view and action must be protected by explicit role and permission checks.

Status: Accepted.

## ADR-099 — Admin actions must be audited

Decision: Every critical admin read or mutation must produce an audit event according to policy.

Status: Accepted.

## ADR-100 — CRM must not expose PAN, CVV, secrets or raw provider payloads

Decision: CRM/Admin responses, logs, notes, and exports never expose PAN, CVV, sensitive tokens, secrets, or raw provider payloads.

Status: Accepted.

## ADR-101 — Manual review is required for ambiguous payment states

Decision: Ambiguous conditions such as card success plus provider failure, provider timeout, receipt unavailable, or reconciliation mismatch must enter manual review.

Status: Accepted.

## ADR-102 — Admin APIs require explicit RBAC

Decision: Every `/admin/*` endpoint requires authentication and an explicit server-side permission check.

Status: Accepted.

## ADR-103 — Admin responses must be redacted by role

Decision: Admin responses are redacted by role and never expose PAN, CVV, secrets, sensitive card tokens, or raw provider payloads.

Status: Accepted.

## ADR-104 — Admin read operations are audited

Decision: Sensitive admin reads such as user, payment, receipt, audit-event, dashboard, and reconciliation views emit audit events when the audit writer exists.

Status: Accepted.

## ADR-105 — CRM backend starts read-mostly

Decision: The first CRM backend implementation is read-mostly; support tickets and controlled manual-review updates are the limited operational writes.

Status: Accepted.

## ADR-106 — Manual review cases are required for ambiguous payment states

Decision: Ambiguous payment conditions must be representable as manual-review cases with safe references and an event trail.

Status: Accepted.

## ADR-107 — CRM Admin Panel frontend is a separate web app

Decision: The CRM Admin Panel frontend is implemented as a separate internal web app and does not replace the Expo mobile client.

Status: Accepted.

## ADR-108 — Admin frontend must enforce permission-aware rendering

Decision: Admin navigation, views, and writable controls render only for frontend permissions aligned to backend RBAC, while backend authorization remains authoritative.

Status: Accepted.

## ADR-109 — Admin frontend must never render sensitive payment data

Decision: The admin frontend must not render PAN, CVV, secrets, sensitive tokens, or raw provider payloads.

Status: Accepted.

## ADR-110 — CRM frontend starts read-mostly

Decision: The first CRM frontend is read-mostly and limits writes to backend-supported support ticket and manual-review operations.

Status: Accepted.

## Decision — MVP service coverage behavior

| Date       | Decision                                                                              | Reason                                                                                       | Impact                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-22 | FONDIXPAY MVP will hide services that are not available in the user's selected state. | Reduces UX noise, avoids failed payment attempts, and keeps the first mobile catalog simple. | Mobile app must request services from backend by state. Unavailable services must not be rendered in the user-facing catalog. |
| 2026-05-22 | Coverage rules must not be hardcoded in the mobile app or shipped as Excel logic.     | Coverage will change over time and must be operationally maintainable.                       | Coverage must live in backend/database tables and be exposed through API.                                                     |
| 2026-05-22 | Manual state selection has priority over GPS.                                         | Users may pay services for another state and GPS can be inaccurate or denied.                | Mobile app must allow user-selected state and persist it in profile.                                                          |

## WhatsApp receipt channel approved as future non-blocking notification channel

FONDIXPAY approves WhatsApp as a future post-payment notification channel for payment receipts.

The approved visual/product target includes:

- `fondix_otp_login`
- `fondix_pago_exitoso`
- `fondix_recordatorio_vencimiento`
- `fondix_pago_fallido`
- `fondix_resumen_mensual`
- onboarding consent screen

Implementation sequencing:

- Immediate: documentation and architecture alignment only.
- MVP implementation: `fondix_pago_exitoso` only.
- Future notification expansion: reminders, failed payment notices, and monthly summary.
- Future authentication option: WhatsApp OTP login.

Rules:

- WhatsApp failure must never block payment.
- Consent must be explicit and granular.
- No toggles may be pre-enabled.
- Notification logs must be append-only.
- Full phone numbers must never be logged.
- Notification delivery must be idempotent.
- Raw provider/payment errors must never be shown to users.
- Payment receipts must remain available in-app even if WhatsApp delivery fails.

Status:

Approved as future architecture. Not active runtime behavior yet.

## ADR-111 - Ambiguous payment states require manual review workflow

Decision: Ambiguous payment states such as `card_success_prontipagos_failed`, provider timeout, unavailable receipt, duplicate suspicion, provider unknown, and amount mismatch must be handled through manual review.

Rationale: Operators must not resolve uncertain financial/provider states by intuition or destructive edits.

## ADR-112 - Support tickets must link to operational entities

Decision: Support tickets may link to `user_id`, `payment_id`, `receipt_id`, `manual_review_case_id`, and `correlation_id` when available.

Rationale: Support needs traceable references without exposing sensitive card/provider payload data.

## ADR-113 - Reconciliation views are separated by provider type

Decision: Card processor reconciliation and Prontipagos reconciliation remain separate admin workflows and response models.

Rationale: Card charge state and service payment state are different operational legs with different failure modes.

## ADR-114 - Manual review resolution requires audit trail

Decision: Manual review status changes and closure require event history with actor, before/after status, note/resolution context, and admin audit events.

Rationale: Payment operations need a durable investigation trail before any future production gate.

## ADR-115 - CRM operations are read-mostly until production controls mature

Decision: The CRM Admin Panel remains read-mostly, with controlled writes only for support tickets, ticket notes, manual review cases, and manual review events.

Rationale: The admin surface must not edit ledger entries, payment amounts, card outcomes, provider confirmations, or production configuration in this phase.

## ADR-116 - WhatsApp receipt channel is approved as future non-blocking notification

Decision: WhatsApp is approved as a future post-payment receipt notification channel, but only as a non-blocking channel that does not replace internal receipt/proof/audit/ledger evidence.

Rationale: WhatsApp can improve user access to receipts, but delivery reliability must not affect financial truth or payment state.

Status: Accepted for future architecture; no runtime behavior in Phase 10D.1.

## ADR-117 - WhatsApp consent must be explicit and granular

Decision: Users must explicitly opt in to WhatsApp notifications by channel and notification type. No WhatsApp notification toggle may be pre-enabled.

Rationale: Consent for receipts, failed-payment messages, reminders, monthly summaries, and OTP are different privacy decisions.

Status: Accepted.

## ADR-118 - WhatsApp failure must never block payment or receipt generation

Decision: A WhatsApp delivery failure must not block or alter payment state, receipt generation, proof-of-payment state, ledger state, or audit evidence.

Rationale: Notification delivery is operationally secondary to payment and receipt source-of-truth records.

Status: Accepted.

## ADR-119 - WhatsApp delivery logs are append-only and idempotent

Decision: Future WhatsApp delivery records must be append-only and idempotent using a key such as `receipt_id + channel + template_name + recipient_hash`.

Rationale: Duplicate receipt sends create user confusion and support risk; mutable delivery history weakens investigations.

Status: Accepted.

## ADR-120 - WhatsApp MVP is limited to successful payment receipt

Decision: The future WhatsApp MVP is limited to `fondix_pago_exitoso`. Failed payment, due reminder, monthly summary, and OTP templates remain future phases.

Rationale: Successful receipt delivery is the lowest-risk first channel use because it follows existing receipt/proof evidence.

Status: Accepted.

## ADR-121 - Public landing page is commercial front door only

Decision: The public FondixPay landing page functions only as a commercial, informational, and interest-capture front door. It does not host transactional, financial, CRM, payment, reconciliation, ledger, admin, provider, or secret-handling logic.

Rationale: Public marketing can move faster than regulated/financial runtime, but it must not blur into payment operations or production readiness claims.

Status: Accepted.

## ADR-122 - Vercel is approved only for public landing page

Decision: Vercel is approved only for the static public landing page under `landing/`. Sensitive backend, CRM/Admin, payment, reconciliation, ledger, provider, and secret-bearing runtime must be deployed separately on controlled infrastructure.

Rationale: Static marketing hosting is a different risk class than financial transaction systems.

Status: Accepted.

## ADR-123 - Landing page must not expose unconfirmed operational channels

Decision: The public landing must not publish final support, WhatsApp, app store, terms, privacy, social, or public-domain URLs until officially confirmed.

Rationale: Unconfirmed public channels create support, legal, privacy, and trust risk.

Status: Accepted.

## ADR-124 - Landing page must preserve mobile/core separation

Decision: The public landing must not import, modify, or couple itself to the mobile app, backend, CRM/Admin, payments, ledger, audit, receipts, Prontipagos, or card processor modules.

Rationale: Commercial front-door work must not destabilize the transactional core or imply production readiness.

Status: Accepted.

## ADR-125 - Service catalog must be coverage-aware

Decision:
FondixPay must only show services as payable when coverage and transactional capability are confirmed.

Rationale:
The public coverage map and Excel coverage reference can describe commercial availability, but mobile payment eligibility requires provider mapping, reference validation, amount lookup, payment execution, receipt capability, fee rules, and operations support.

## ADR-126 - MVP hides unavailable services by default

Decision:
For MVP, unavailable, unconfirmed, provider-pending, unknown, maintenance, and deprecated services are not shown as payable in the mobile app.

Rationale:
Hiding unavailable services avoids user frustration and prevents payments from entering flows that cannot be executed or supported safely.

## ADR-127 - Coverage map is commercial/reference layer, not payment authority

Decision:
The coverage map can be used in the public landing page as a commercial/reference layer, but it does not define by itself which services are payable.

Rationale:
The map is hardcoded/reference data and does not include provider capability, Prontipagos validation, operational readiness, or receipt rules.

## ADR-128 - Provider capability is required before payment execution

Decision:
A service cannot enter the payment flow unless provider capability is confirmed for the required operations: reference validation, amount lookup, payment execution, and receipt handling as applicable.

Rationale:
Coverage without transactional capability can create ambiguous or failed payments and support burden.

## ADR-129 - Coverage changes require audit trail

Decision:
Changes to coverage, visibility, payable status, or provider mapping must generate audit events.

Rationale:
Catalog changes directly affect what users can attempt to pay and must be traceable for operations, support, and compliance readiness.

## ADR-130 - Mobile catalog only exposes payable services

Decision:
The mobile app must only show selectable/payable services returned by the coverage-aware `/service-catalog` endpoint.

Rationale:
Mobile discovery must not expose services that are only reference coverage, provider-pending, unknown, or unconfirmed.

Status: Accepted.

## ADR-131 - Seeded coverage data is not provider confirmation

Decision:
Coverage data seeded from Excel, map assets, or local fixtures does not constitute Prontipagos operational confirmation.

Rationale:
Reference coverage can support landing/admin visibility, but real payment eligibility requires provider capability and operational validation.

Status: Accepted.

## ADR-132 - Admin catalog visibility includes non-payable services

Decision:
CRM/Admin can see non-payable, pending, disabled, and unknown catalog items for support and operations.

Rationale:
Operators need visibility into why services are unavailable, while users should not see them as payable.

Status: Accepted.

## ADR-133 - Service catalog implementation must preserve safe defaults

Decision:
Every new seeded or imported service starts as non-payable unless explicitly approved with confirmed provider capability.

Rationale:
Safe defaults prevent accidental payment enablement from reference data or incomplete provider mapping.

Status: Accepted.

## ADR-010G-001 - WhatsApp receipt MVP uses mock provider by default

Decision: Phase 10G implements `fondix_pago_exitoso` through a provider abstraction with `WhatsAppMockProvider` as the only runtime provider.

Rationale: FondixPay has no approved production WhatsApp provider, Meta template approval, webhook security review, or production credentials.

## ADR-010G-002 - WhatsApp delivery is not financial truth

Decision: WhatsApp delivery failure never changes payment, receipt, proof, ledger, or internal receipt status.

Rationale: The internal ledger/audit/receipt evidence remains the source of truth. WhatsApp is a convenience notification channel only.

## ADR-010G-003 - Consent is explicit and disabled by default

Decision: `NotificationPreference` defaults to disabled and requires user opt-in for `whatsapp/payment_receipt`.

Rationale: WhatsApp is an external messaging channel and must not send payment receipts without consent.

## ADR-134 - AWS-2 remains dev-only until staging Terraform exists

Decision: Phase AWS-2 may validate and document the current non-production Terraform workflow, but the only implemented environment is `dev`. Staging must not be claimed as deployed until an approved sprint adds a dedicated staging environment under `infra/terraform/environments/staging`.

Rationale: The AWS-1 Terraform code validates `environment = "dev"` only. Treating dev infrastructure as staging would blur environment boundaries and increase operational risk.

Status: Accepted.

## ADR-135 - Terraform apply requires confirmed non-production identity and explicit approval

Decision: Terraform `apply` for AWS-2 must not run until AWS credentials are configured, `aws sts get-caller-identity` confirms a non-production account, `terraform plan` succeeds, the plan is reviewed, and explicit human approval is given.

Rationale: Infrastructure changes can create cost, exposure, or production-impact risk if account, region, environment, or destructive changes are not reviewed first.

Status: Accepted.

## ADR-136 - CI validation is separated from deployment

Decision: FONDIXPAY pull request and push validation must not deploy infrastructure or application runtimes.

Rationale: CI should reduce regression risk without creating uncontrolled infrastructure or production deployment paths.

Status: Accepted.

## ADR-137 - Dev Terraform apply is manual and approval-gated

Decision: Terraform apply for dev may run only through a manual GitHub Actions workflow using GitHub Environment `dev`, OIDC, remote state, environment confirmation, and a plan immediately before apply.

Rationale: Infrastructure apply can create cost, public exposure, or wrong-account impact. Manual approval and identity checks keep AWS-3 non-production and auditable.

Status: Accepted.

## ADR-138 - Production deployment is not active in AWS-3

Decision: AWS-3 does not enable production deployment workflows for infrastructure, backend, admin, payments, reconciliation, ledger/audit, or landing-adjacent sensitive runtime.

Rationale: Production requires a future approved environment design, secret model, monitoring, rollback, and security review.

Status: Accepted.

## ADR-139 - Vercel remains landing-only in CI/CD

Decision: CI/CD may validate the static landing folder, but Vercel deployment is not wired in AWS-3 and Vercel remains approved only for `landing/`.

Rationale: The public landing page is a different risk class than backend, CRM/Admin, payment, ledger, provider, and reconciliation workloads.

Status: Accepted.

## ADR-140 - Fraud readiness is manual review only

Decision: Phase 11 fraud readiness stores explainable fraud signals for authorized human review and does not automatically block users, refund payments, close accounts, or change payment state.

Rationale: Fraud false positives can harm users and create operational/legal risk. The safe Phase 11 goal is evidence and review.

Status: Accepted.

## ADR-141 - Chargeback readiness is internal evidence management only

Decision: Dispute and chargeback cases in Phase 11 are internal records with evidence metadata. They do not submit responses to card networks, card processors, or Prontipagos.

Rationale: External dispute submission requires provider contracts, legal review, evidence rules, deadlines, and production approval.

Status: Accepted.

## ADR-142 - Fraud and dispute admin operations require RBAC and audit

Decision: Fraud signal and dispute/chargeback operations require explicit backend permissions and emit audit events for mutations.

Rationale: Sensitive investigation workflows must be traceable and cannot rely on frontend-only controls.

Status: Accepted.

## ADR-143 - Evidence references are private metadata

Decision: Dispute evidence stores metadata and private/internal references only, not public files or raw provider/card payloads.

Rationale: Evidence can contain sensitive operational or customer context and must not leak through public URLs, logs, or docs.

Status: Accepted.

## ADR-144 - CRM Chat Operations Console is the internal chatbot escalation console

Decision: The CRM Chat Operations Console is the official internal console for monitoring chatbot conversations, managing escalations, and routing high-severity cases to human support.

Rationale: Bot response configuration and human support operations are different workflows and require separate permissions, auditability, and UI surfaces.

Status: Accepted.

## ADR-145 - SEV-1 and SEV-2 chat cases require human review

Decision: `SEV-1` and `SEV-2` chatbot-origin cases must always require human review and must not be automatically closed by AI.

Rationale: Fraud, data exposure, payment trust, receipt, and money-loss concerns can harm users if resolved by autonomous logic.

Status: Accepted.

## ADR-146 - Bot de Landing remains configuration and metrics only

Decision: `Bot de Landing` remains focused on identity, welcome message, prompt, guided responses, knowledge base, metrics, and model health. Ticket operations and human escalation belong to Chat Operations, Tickets, or Human Queue.

Rationale: Mixing configuration with support execution would obscure accountability and increase operational risk.

Status: Accepted.

## ADR-147 - Public chatbot remains informational and non-private

Decision: The public chatbot remains informational and routing-oriented and must not access private payment, transaction, receipt, balance, OTP, card, account, or customer data.

Rationale: The landing page is public and unauthenticated. Private support must happen through authenticated app/support flows.

Status: Accepted.

## ADR-148 - Chat console is not restored to sidebar

Decision: Chat console must not be restored to the CRM sidebar unless explicitly approved; navigation must respect the current CRM structure.

Rationale: The approved module structure keeps `Bot de Landing` visible and avoids adding an unapproved sidebar module.

Status: Accepted.

## ADR-149 - DEV AUTH banner is non-production only by default

Decision: The DEV AUTH banner must be visible in internal non-production environments and must not be shown in production unless explicitly enabled by configuration.

Rationale: Internal dev warnings prevent production confusion while avoiding false production warnings.

Status: Accepted.


| Date       | Decision                                                                                                                   | Reason                                                                                    | Impact                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 2026-06-03 | Prontipagos is permanently removed from FONDIXPAY.                                                                         | Founder decision.                                                                         | All architecture, docs, mocks, reconciliation and support flows must remove Prontipagos references.                   |
| 2026-06-03 | Tekae is the approved provider for FONDIXPAY.                                                                              | Official Tekae documentation was received and approved for discovery.                     | Future payment/service integration work must assume Tekae unless changed by founder decision.                         |
| 2026-06-03 | FONDIXPAY is not a fintech.                                                                                                | Business positioning and risk control.                                                    | Public language, architecture and compliance docs must describe FONDIXPAY as a platform/app using Tekae capabilities. |
| 2026-06-03 | Current Tekae documentation supports SSO launch into Tekae responsive platform, not yet a full payment API implementation. | Manual describes token generation and responsive URL launch.                              | Implementation must not assume direct payment API, webhooks or reconciliation until Tekae confirms.                   |
| 2026-06-03 | Tekae credentials and token generation must remain backend-only.                                                           | Tekae manual requires backend token generation to avoid exposing credentials to frontend. | Mobile app may request launch session but must never hold Tekae uid/password.                                         |
| 2026-06-03 | Payment success must not be inferred from launching Tekae.                                                                 | SSO launch only proves user entered provider experience.                                  | Internal states must support pending/unknown/manual review outcomes.                                                  |
| 2026-06-03 | Sprint 010 is documentation and architecture only.                                                                          | Tekae webhook, reconciliation, transaction query, sandbox, and production connectivity gaps remain unresolved. | No production code, migrations, WebView, webhook endpoint, credential configuration, or runtime payment logic changes are allowed in Sprint 010. |
| 2026-06-03 | FONDIXPAY must not implement card vault, wallet, ledger balance, tokenization, acquiring, SPEI processor, or banking core. | FONDIXPAY embeds Tekae capabilities and is not a fintech/payment infrastructure provider. | Future implementation must broker Tekae access without duplicating Tekae payment infrastructure. |
| 2026-06-03 | While Tekae contract closure remains externally blocked, FONDIXPAY will proceed with a non-payment Dev Readiness & App Cleanup sprint. | Tekae runtime implementation is blocked until Tekae provides the complete technical/operational contract, but infrastructure readiness, mock/provider separation, environment hygiene, CI validation, and documentation cleanup can safely advance. | The next practical sprint may improve dev readiness and remove ambiguity, but must not implement real Tekae payment runtime behavior. |

## ADR-150 - DEV / STAGING / PROD Is Official Environment Strategy

Decision: FONDIXPAY uses DEV / STAGING / PROD as the official environment strategy, with `docs/ENVIRONMENTS.md` as the canonical environment document.

Rationale: Tekae readiness, mobile build profiles, backend deployment, database separation, secrets, observability, support, and release promotion need one durable environment model.

Status: Accepted in Sprint 018.

## ADR-151 - DEV Is Mock/Demo Only

Decision: DEV is mock/demo only and must not use production credentials, production data, real payment behavior, or Tekae production access.

Rationale: Development must remain safe, reversible, and isolated from real users and money movement.

Status: Accepted in Sprint 018.

## ADR-152 - STAGING Owns Sandbox Provider Integration And Release Rehearsal

Decision: STAGING is the only environment for preproduction release rehearsal and future Tekae sandbox/test integration after Sprint 019 readiness approval.

Rationale: Sandbox provider validation must be isolated from DEV shortcuts and PROD real-user operations.

Status: Accepted in Sprint 018.

## ADR-153 - PROD Owns Real Users And Production Provider Credentials

Decision: PROD is the only environment for real users, production data, production provider credentials, and production operations after all approval gates pass.

Rationale: Production credentials and real user operations require stronger network, secret, audit, support, monitoring, backup, and rollback controls.

Status: Accepted in Sprint 018.

## ADR-154 - Tekae Token Generation Is Backend-Controlled

Decision: Tekae token generation must remain backend-controlled. Mobile, admin, landing, and frontend code must never generate, store, log, or expose production Tekae credentials or access tokens.

Rationale: Tekae credentials and tokens are sensitive provider secrets and must not enter user-facing bundles or public hosting surfaces.

Status: Accepted in Sprint 018.

## ADR-155 - Vercel Remains Landing-Only

Decision: Vercel is approved only for the public static landing page. It must not host core transactional logic, backend APIs, payment processing, reconciliation, admin workflows, provider credentials, Tekae token generation, or backend secrets.

Rationale: Public commercial hosting and financial/payment operations are different risk classes and must remain separated.

Status: Accepted in Sprint 018.

## ADR-156 - Tekae Readiness Pack Is Canonical Pre-Implementation Gate

Decision: `docs/TEKAE_INTEGRATION_READINESS.md` is the canonical Tekae pre-implementation readiness pack.

Rationale: Tekae token flow, access URL handling, security boundaries, proposed session endpoint, environment gates, and open questions need one current source before runtime work begins.

Status: Accepted in Sprint 019.

## ADR-157 - Tekae Integration Remains Disabled Until Approved Implementation Sprint

Decision: Tekae runtime remains disabled until a later approved implementation sprint explicitly changes runtime behavior.

Rationale: Readiness documentation is not the same as provider implementation, credential configuration, endpoint creation, webhook handling, or production approval.

Status: Accepted in Sprint 019.

## ADR-158 - Tekae Token And Session Generation Is Backend-Only

Decision: Tekae token/session generation must happen only in the FONDIXPAY backend using server-side credentials.

Rationale: Tekae `uid`, `password`, provider credentials, `accessToken`, and access URL construction are sensitive operations that must not enter mobile/frontend/admin bundles.

Status: Accepted in Sprint 019.

## ADR-159 - Mobile Receives Only Approved Short-Lived Tekae Session URL

Decision: Mobile may receive only an approved short-lived Tekae launch URL/session from the backend after authentication, eligibility, environment, duplicate-flow, and audit checks.

Rationale: Mobile needs a launch handoff, not provider credentials or token-generation authority.

Status: Accepted in Sprint 019.

## ADR-160 - STAGING Is First Tekae Sandbox Validation Target

Decision: Tekae sandbox/test validation belongs first in STAGING, not DEV or PROD.

Rationale: Sandbox provider behavior must be separated from local mock shortcuts and production real-user operations.

Status: Accepted in Sprint 019.

## ADR-161 - Tekae PROD Is Blocked Until Security, Network, Audit, Rollback, Observability, And Ownership Are Approved

Decision: Tekae production runtime is blocked until production credentials, VPN/VPC or approved secure network path, backend token flow, audit, rollback, observability, support process, and operational ownership are approved.

Rationale: Production token generation and provider launch affect real users and require explicit operational controls.

Status: Accepted in Sprint 019.

## ADR-162 - Tekae User-Facing Errors Must Be Safe

Decision: Raw Tekae errors must not be shown to users; future runtime must map provider errors to safe user-facing copy and redacted operational details.

Rationale: Raw provider errors can leak sensitive implementation details, confuse users, and create support/security risk.

Status: Accepted in Sprint 019.

## ADR-163 - Service Visibility Is Coverage-Aware

Decision: FONDIXPAY service visibility will be coverage-aware and backend-owned.

Rationale: Users should only see services available for their selected/detected state plus national services, and mobile must not hardcode coverage rules.

Status: Accepted in Sprint 020.

## ADR-164 - MVP Coverage Filtering Is State-Based

Decision: MVP filtering is state-based, not city-level.

Rationale: State-level filtering provides enough coverage control for the first implementation while keeping city/municipality complexity future-scoped.

Status: Accepted in Sprint 020.

## ADR-165 - National Services Use MX-ALL Or NATIONAL

Decision: National services are represented by `MX-ALL` or `coverageMode=NATIONAL` and must appear for every Mexican state unless disabled.

Rationale: National coverage needs explicit logic so nationwide services are not hidden by state filtering.

Status: Accepted in Sprint 020.

## ADR-166 - GPS Is Used Only To Infer State

Decision: GPS may be used only to infer the user's state for service availability.

Rationale: FONDIXPAY does not need continuous tracking or raw coordinates for payments or provider launch.

Status: Accepted in Sprint 020.

## ADR-167 - Manual State Selection Is Required Fallback And Override

Decision: Manual state selection is required when GPS is denied/unavailable and overrides GPS for browsing until the user changes it.

Rationale: Users may need to pay services outside their current physical location and GPS can be inaccurate or unavailable.

Status: Accepted in Sprint 020.

## ADR-168 - Raw GPS Coordinates Must Not Be Logged Or Sent To Tekae

Decision: Raw GPS coordinates must not be logged, persisted by default, or sent to Tekae.

Rationale: State-level service coverage can be handled with minimal location data, reducing privacy and security risk.

Status: Accepted in Sprint 020.

## ADR-169 - DEV May Use Mock State Fixtures

Decision: DEV may use mock state fixtures, manual selector data, and labeled demo catalog behavior.

Rationale: Local validation needs repeatable fixtures without real user location or provider credentials.

Status: Accepted in Sprint 020.

## ADR-170 - STAGING Validates Coverage With Test Or Sandbox Catalog Data

Decision: STAGING validates service coverage using test fixtures or sandbox catalog mapping, not production data.

Rationale: Preproduction validation must exercise realistic coverage behavior without real users, real money, or production provider credentials.

Status: Accepted in Sprint 020.

## ADR-171 - PROD Uses Real Coverage Data Only After Release Gates

Decision: PROD may use real coverage data only after release gates approve provider-backed catalog source, privacy rules, support visibility, operations, and rollback.

Rationale: Wrong production coverage can hide valid services or expose unavailable services to real users.

Status: Accepted in Sprint 020.

## ADR-172 - FONDIXPAY Uses An Internal Normalized Service Catalog

Decision: FONDIXPAY will use an internal normalized service catalog model instead of exposing raw Tekae catalog structure directly to mobile UI or business logic.

Rationale: Provider catalog fields can change, may not match user-facing taxonomy, and should not become primary business concepts.

Status: Accepted in Sprint 021.

## ADR-173 - Tekae Catalog Identifiers Are Provider Metadata

Decision: Tekae `menu`, `categoria`, `carrier`, and provider product identifiers must be preserved as provider mapping metadata.

Rationale: Future Tekae launch/session construction may need those values, but user-facing service taxonomy should remain FONDIXPAY-owned.

Status: Accepted in Sprint 021.

## ADR-174 - Coverage Filtering Depends On Normalized Coverage Fields

Decision: Future coverage-aware filtering depends on normalized `coverageMode` and `coverageStates`, not raw Tekae category or carrier structure.

Rationale: State availability and provider navigation are separate concerns and must be validated independently.

Status: Accepted in Sprint 021.

## ADR-175 - Unknown Catalog Coverage Requires Review

Decision: Unknown catalog coverage must be marked `UNKNOWN_REVIEW_REQUIRED` and must not be treated as national by default.

Rationale: Overexposing unavailable services can create failed payment flows and support risk.

Status: Accepted in Sprint 021.

## ADR-176 - Catalog MVP Coverage Remains State-Based

Decision: Catalog normalization for MVP remains state-based; city/municipality coverage remains future scope.

Rationale: Sprint 020 established state-level filtering as the MVP boundary, and Sprint 021 preserves that boundary for catalog normalization.

Status: Accepted in Sprint 021.

## ADR-177 - Tekae Confidential Materials Stay External

Decision: Tekae NDA is in place. Tekae-provided documents, manuals, real catalog files, credentials, provider identifiers, commercial terms, URLs, token material, and integration materials are confidential external references. They must not be committed to the repository. Only derived non-sensitive implementation notes may be documented.

Rationale: Tekae materials can contain contractual, commercial, provider, security, credential, token, URL, catalog, and operational information that must remain controlled outside source control.

Status: Accepted in Sprint 026.

## ADR-178 - Public Catalog Coverage API Uses Canonical MX Codes

Decision: Future public/mobile catalog coverage API responses must emit canonical `MX-*` state codes only.

Rationale: Mobile selected-state behavior already uses `MX-*`; public short-code leakage would break filtering and keep frontend behavior coupled to legacy backend storage.

Status: Accepted in Sprint 027.

## ADR-179 - Public National Coverage Uses NATIONAL With Empty States

Decision: Public national service coverage is represented as `coverage.mode = "NATIONAL"` and `coverage.states = []`. `MX-ALL` remains internal/import compatibility only and must not be exposed as a user-selectable state.

Rationale: `NATIONAL` expresses the business rule directly. Treating `MX-ALL` like a state would confuse user selection and mobile filtering.

Status: Accepted in Sprint 027.

## ADR-180 - Tekae Provider Metadata Is Internal-Only In Public Catalog APIs

Decision: Tekae `menu`, `categoria`, `carrier`, provider IDs, `sourceProviderServiceId`, raw payloads, source row IDs, credentials, token material, production URLs, commercial terms, and NDA/confidential provider material must not be exposed by public/mobile catalog APIs.

Rationale: Provider metadata is needed for backend/admin mapping and future launch construction, but it is not FONDIXPAY public taxonomy and may be confidential.

Status: Accepted in Sprint 027.

## ADR-181 - Legacy State Short Codes Are Temporary Input Compatibility Only

Decision: Future backend catalog APIs may temporarily accept legacy short codes such as `CHH`, but must normalize them at the API boundary and emit only canonical `MX-*` in public responses.

Rationale: Current backend tables use short codes. A compatibility window reduces migration risk, while canonical public output prevents new short-code dependency.

Status: Accepted in Sprint 027.

## ADR-182 - Tekae menu/categoria/carrier Parameters Are Backend-Controlled

Decision: Optional Tekae launch parameters (`redirect`, `menu`, `categoria`, `carrier`, `blockview`) must be determined and validated by the backend, not constructed by mobile. Mobile may pass intent and context to the backend session endpoint; backend maps them to Tekae parameters.

Rationale: Tekae parameter values (menu=null/1/2/3) have direct product impact on what users see inside the Tekae platform. Letting mobile construct these raw opens the door to unsanctioned menu routing and bypasses catalog coverage checks.

Status: Accepted 2026-06-15.

## ADR-183 - TEKAE_ENABLED=false Is the Mandatory Default in All Environments

Decision: `TEKAE_ENABLED` must default to `false` in all backend environments. Setting it to `true` requires explicit configuration with validated credentials and network path for the target environment.

Rationale: Accidental activation without sandbox credentials, VPN/VPC, or approved security review creates a broken or insecure integration that could be confused with real payment readiness.

Status: Accepted 2026-06-15.

## ADR-184 - Backend Config Must Validate Tekae Credentials on Startup in Staging/Production

Decision: `validate_security_settings` in `backend/app/core/config.py` must raise `ValueError` if `TEKAE_ENABLED=true` and `TEKAE_UID`, `TEKAE_PASSWORD`, or `TEKAE_BASE_URL` are empty in staging or production.

Rationale: Failing fast at startup is safer than failing silently at runtime when the first user attempts a Tekae session. Missing credentials in a live environment would produce 500 errors with potential secret-adjacent error messages.

Status: Accepted 2026-06-15.

## ADR-185 - Tekae menu Values Are Documented Internal Constants

Decision: Tekae `menu` values confirmed from Manual v3.1 (`null`=Home, `"1"`=Tiempo Aire, `"2"`=Pago de Servicios, `"3"`=Entretenimiento) must be modeled as typed constants in the backend service when implemented, not as magic strings scattered through code.

Rationale: Tekae menu routing directly controls the payment category the user sees. Typed constants prevent invalid values, document intent, and make the mapping auditable.

Status: Accepted 2026-06-15.

## ADR-186 - API Timeout Is 15 Seconds via AbortController

Decision: All `apiRequest()` calls have a 15-second timeout enforced with a native `AbortController`. The timeout error maps to a user-facing Spanish message.

Rationale: A hung request without timeout leaves the user on an infinite loading screen with no recovery path. 15s is generous for mobile on a weak network; the AbortController is the only cross-platform timeout pattern in React Native that doesn't require an external library.

Status: Accepted 2026-06-15.

## ADR-187 - 401 Handler Uses Callback Pattern to Break Circular Dependency

Decision: `api.ts` exports `setUnauthorizedHandler(handler)` that stores a module-level callback. `AppNavigator.tsx` registers `useAuthStore.getState().signOut()` as that callback on mount.

Rationale: Importing `authStore` directly in `api.ts` creates a circular dependency chain: `api.ts` → `authStore.ts` → `authApi.ts` → `api.ts`. The callback pattern inverts the dependency — `api.ts` knows nothing about auth state; callers wire the behavior externally.

Status: Accepted 2026-06-15.

## ADR-188 - QA Scenario Picker Requires Explicit Opt-In Via Env Flag

Decision: The internal payment scenario picker in `ConfirmPaymentScreen` is gated by `EXPO_PUBLIC_ENABLE_PAYMENT_QA_SCENARIOS === 'true'` in addition to `isDemoPaymentEnabled()`. Default (flag absent) = picker hidden.

Rationale: The existing `isDemoPaymentEnabled()` guard relies on `NODE_ENV`, which can be truthy in preview/staging EAS builds. An explicit per-variable opt-in is the only safe default that prevents internal QA tooling from appearing in any build where the flag is not explicitly set.

Status: Accepted 2026-06-15.

## ADR-189 - MexicoStateCode Expanded to All 32 ISO 3166-2:MX Entities

Decision: `MexicoStateCode` union type and `MEXICO_STATE_OPTIONS` now cover all 32 Mexican federal entities with official ISO 3166-2:MX codes. `locationStateResolver.ts` covers all 32 states with normalized aliases for geocoder output.

Rationale: GPS-based state resolution and manual state selection were unusable for 85% of Mexico. The 5-state limitation was an MVP artifact with no intentional product boundary.

Status: Accepted 2026-06-15.

## ADR-190 - ProfileScreen Uses Real Stores; Empty States Are Honest

Decision: `ProfileScreen` reads payment methods and saved services from `usePaymentMethodStore` and `useServiceStore`. If a store is empty, the screen shows an honest empty state. Demo data seeded in stores (from `serviceStore.ts`) is the source of truth, not duplicated in the screen.

Rationale: The screen was shadowing real store data with a local hardcoded list, making it impossible to verify that stores were working. Any user session would always see fake data regardless of actual app state.

Status: Accepted 2026-06-15.

## ADR-191 - Tekae API Uses Two-Layer Authentication

Decision: Tekae API requires `Authorization: Bearer {TEKAE_BEARER}` in every HTTP header, plus `uid` (= `TEKAE_UID`) and `password` (= `TEKAE_PASSWORD`, a KMS-encrypted value) in the request body of `cipherData`. Both layers are required; either alone returns 401.

Rationale: Confirmed via live sandbox API test on 2026-06-16. `TEKAE_BEARER` is a separate static secret from `TEKAE_UID`/`TEKAE_PASSWORD`.

Status: Accepted 2026-06-16.

## ADR-192 - TEKAE_UID and TEKAE_PORTAL_UID Are the Same Value

Decision: The `uid` used in `cipherData`/`generateTokenCiphered` request bodies (`TEKAE_UID`) and the `uid` segment in the portal responsive URL (`TEKAE_PORTAL_UID`) are the **same value**. Both env vars are kept separate in config for explicit documentation, but must be set to the same credential.

Rationale: Initially assumed to be different identifiers based on an error in the credentials package. Corrected by Tekae on 2026-06-16 — the portal URL uses the same UID as the API body. Using a different UID in the portal URL caused "sesión caducada" in sandbox testing.

Status: Corrected 2026-06-16.

## ADR-193 - Tekae accessToken TTL Is 30 Minutes; No Caching Allowed

Decision: Each `POST /api/payments/tekae/session` call must generate a fresh Tekae session. `accessToken` TTL is 1800 seconds (30 minutes). Backend must not cache or reuse tokens across requests.

Rationale: JWT payload from sandbox confirmed `exp - iat = 1800s`. Reusing an expired token would cause a broken session for the user in the Tekae portal.

Status: Accepted 2026-06-16.

## ADR-194 - accessToken Is Never Stored or Logged; portalUrl Is Returned Once

Decision: The Tekae `accessToken` is used solely to construct `portalUrl` and is immediately discarded. `portalUrl` is returned to mobile once and not persisted. Audit events record only `session_ref` (UUID), not the token or URL.

Rationale: Storing or logging tokens creates credential leak risk. The token is short-lived and single-use per session. If the user needs to re-enter Tekae, a new session is generated.

Status: Accepted 2026-06-16.

## ADR-195 - OTP Persistence Backend: Redis vs. PostgreSQL

Decision: PENDING — Sprint 091 must choose between Redis (`REDIS_URL`) and PostgreSQL (`otp_tokens` table) for OTP persistence.

Rationale: PostgreSQL reuses existing infrastructure (no new service); Redis provides atomic TTL and is standard for short-lived tokens. The choice affects operational complexity (Redis requires provisioning) vs. simplicity (PostgreSQL is already managed). If Redis is unavailable in staging, PostgreSQL is the fallback.

Status: PENDING — must be decided and recorded before Sprint 091 implementation begins.

## ADR-196 - JWT Refresh Token Rotation and Revocation Model

Decision: PENDING — Sprint 100 must implement JWT refresh token rotation. Key parameters: refresh token TTL (recommended 30 days), access token TTL in production (recommended 15 minutes), rotation strategy (revoke-on-use), server-side revocation table (`refresh_tokens`).

Rationale: Current HS256/60-min access-token-only model has no server-side revocation and no session inventory. If a token is stolen, it is valid for 60 minutes with no kill switch. Refresh rotation and a `refresh_tokens` table with `revoked_at` closes this gap.

Status: PENDING — must be decided and recorded in Sprint 100.

## ADR-197 - Tekae Production Network Path

Decision: PENDING — Sprint 093/102 must confirm whether Tekae production API access requires VPN, IP allowlist, or mTLS. Sandbox uses public HTTPS endpoints. Production topology may differ.

Rationale: ADR-161 blocked production Tekae until network path is confirmed. Sandbox-to-production network changes are a common source of production failures for SSO integrations.

Status: PENDING — must be confirmed with Tekae before Sprint 102.

## ADR-198 - Contact Form Submission Backend

Decision: PENDING — Sprint 097 must choose and implement a real form submission endpoint for `landing/contacto.html`. Options: Formspree (no backend), Resend (email API), backend `POST /api/public/contact`, Netlify Forms.

Rationale: The form currently has `action="#"` — a production-blocked stub. Users who submit the form get no confirmation and no email is sent. A real endpoint is required before landing publish.

Status: PENDING — must be decided and recorded in Sprint 097.

## ADR-199 - Production Observability Backend

Decision: PENDING — Sprint 099 must choose and configure an error tracking and uptime monitoring backend. Options for error tracking: Sentry (recommended, free tier available), Datadog, Rollbar. Options for uptime: BetterUptime, UptimeRobot, AWS CloudWatch Synthetics.

Rationale: Without error tracking, production incidents are invisible until a user reports them. Without uptime monitoring, downtime is detected by users, not operators. Both are required before Sprint 102 production launch.

Status: PENDING — must be decided and recorded in Sprint 099.

## ADR-200 - Closed Beta User Acquisition and Invitation Model

Decision: PENDING — Sprint 101 must define how closed beta users are invited. Options: TestFlight internal group (iOS), Google Play internal testing track (Android), EAS preview build with direct APK/IPA download, or all three.

Rationale: Beta testers must use production-equivalent builds to surface real issues before launch. The invitation model affects how quickly testers can onboard and whether real Tekae sandbox payments can be tested.

Status: PENDING — must be decided before Sprint 101 begins.
