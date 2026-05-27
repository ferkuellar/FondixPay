# Security

## Current State

Authentication is mock/dev OTP based. The development OTP is configured as `OTP_DEV_CODE=123456` in `.env.example`.

FondixPay is not production financial software yet.

## Rules

- No real secrets in the repository.
- Secrets must come from environment-specific secret stores.
- Private endpoints must require authentication.
- Authorization must be enforced on the backend.
- Future financial actions must generate audit logs.
- Real provider webhooks must be authenticated and persisted.
- User-facing errors must not expose stack traces.

## Current Risk Areas

- Development OTP.
- Missing rate limiting.
- Missing production SMS/OTP delivery design.
- Missing RBAC implementation.
- Missing audit logs.
- Missing ledger.
- Missing real provider webhook validation.
- CORS must be restricted per environment.
- Payment provider and compliance decisions are pending.

## Mobile Security

- Expo Secure Store is available and should be used for sensitive session storage.
- Session expiration, refresh, revocation, and logout behavior require hardening.
- Avoid storing sensitive personal or financial data in plain client state.

## Backend Security

- Validate inputs for all write endpoints.
- Protect private endpoints.
- Enforce ownership checks.
- Use consistent error responses.
- Add rate limiting for OTP and payment-sensitive endpoints.
- Add security headers at deployment edge.

## Not Production Ready

Real financial use is blocked until authentication, authorization, audit, ledger, validation, observability, provider integration, and compliance review are completed.

## Phase 4A Auth & Session Rules

Current auth remains phone + OTP + access token. The implementation is still mock/dev for OTP delivery: no real SMS provider is integrated and the development OTP remains `123456` for local work.

Environment behavior:

- `development`: OTP dev code may be returned as `otp_dev` only when `OTP_DEV_RESPONSE_ENABLED=true`.
- `test`: OTP dev code may be returned for automated tests when explicitly enabled.
- `staging`: `otp_dev` must not be returned; `JWT_SECRET_KEY` must be strong; CORS must be explicit.
- `production`: same as staging; real OTP delivery requires an approved provider and separate implementation phase.

JWT rules:

- `JWT_SECRET_KEY` must not use placeholders such as `change-me`, `dev-secret`, `secret`, `changeme`, or short values outside development.
- `JWT_ALGORITHM` is currently `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES` is configurable and defaults to 60 minutes.
- Refresh tokens, server-side token revocation, session inventory, and device trust are not implemented yet.

Mobile session rules:

- Expo Secure Store may store the current access token only.
- Mobile must handle missing `otp_dev`; users can manually enter the OTP.
- Invalid session restore must clear local token state.

Remaining production blockers:

- Real OTP/SMS provider.
- Rate limiting and brute-force protection.
- Auth audit logs.
- Refresh/revocation/session inventory.
- RBAC enforcement.
- Ledger and audit foundation before any real payments.

## Phase 4B Security Validation Results

Automated tests now cover:

- Invalid bearer token rejected by `/auth/me`.
- Development OTP flow still works in test/dev conditions.
- Anonymous access rejected for:
  - `GET /users/me`
  - `GET /user-services`
  - `POST /user-services`
  - `GET /payments`
  - `POST /payments`
  - `GET /receipts`
  - `GET /notifications`
- User-scoped list endpoints do not return another user's services, payments, receipts, or notifications.
- Public service provider catalog remains public read-only.

Security risks still pending:

- Rate limiting and OTP abuse controls.
- RBAC/permissions beyond current user ownership.
- Audit log persistence.
- Server-side session revocation.
- Ledger and financial integrity checks.
- Payment idempotency and reconciliation.

Production remains blocked until rate limiting, RBAC, audit logs, ledger, migration discipline, and provider decisions are completed.

## Phase 4C UX/Product Security Notes

- OTP visual design must remain 6 digits. Any 4-digit OTP mockup is obsolete.
- Trust signals do not replace real security controls.
- Do not promise "secure" without explaining concrete controls such as data protection, support, auditability, and provider handling.
- Do not store card data unless tokenization, provider approval, and compliance responsibilities are defined.
- Real payment method handling requires an approved provider decision and compliance review.
- Payment error screens must state whether a charge happened, did not happen, or is pending confirmation.
- Fee disclosure is a security/trust requirement because hidden fees create disputes and user harm.

## Phase 5A Financial Data Protection

- Financial data must use least privilege access by role.
- Audit logs must not expose raw card data, OTP codes, access tokens, provider secrets, or full sensitive provider payloads.
- Provider payload storage should use hashing and redaction by default.
- Raw secrets, full PAN, CVV, and provider credentials must never be stored in application tables or committed to repo.
- Payment methods must be tokenized by an approved provider before real use.
- Idempotency keys must be scoped to user, operation, and resource to avoid cross-user replay.
- Future provider requests should support signing or authenticated webhook verification when provider capability exists.
- Audit/admin endpoints must be restricted to `AUDITOR`, `FINANCE`, `ADMIN`, or `SUPER_ADMIN` according to the final RBAC matrix.
- Finance/admin/auditor roles must follow least privilege; support must see only the minimum data needed.
- Provider references must not be treated as authorization proof.
- User-facing success must depend on internal state plus provider confirmation rules, not client-side state.

## Phase 5B Ledger/Audit Security Notes

- Audit metadata is redacted before persistence for obvious sensitive keys including OTP, tokens, secrets, PAN, CVV, and card numbers.
- `X-Request-ID` is available for support and incident investigation, but it must not be treated as authentication.
- Payment `correlation_id` is used to connect internal mock payment records; future provider integrations must propagate it without exposing secrets.
- `idempotency_key` prevents duplicate mock payment creation for the same user/key; future provider work must bind it to amount, service, and provider operation to reject conflicting retries.
- Provider payloads must remain hashed/redacted. Raw secrets, raw PAN, CVV, auth tokens, and provider credentials must never be stored in audit or ledger records.
- Audit/admin read access remains pending and must require backend RBAC before exposure.

Production remains blocked until rate limiting, RBAC, full audit coverage, production ledger semantics, provider confirmation mapping, and reconciliation controls exist.

## Phase 5C Trust And Fee Security Notes

- Fee disclosure is treated as a user-protection requirement, not decoration.
- The UI must not hide the FondixPay fee or final total before confirmation.
- Trust copy must remain truthful and specific.
- Do not use "100% seguro" or imply PCI, tokenization, banking protection, or regulatory approval without implementation and review.
- No card storage was added in Phase 5C.
- Receipt breakdown must not expose sensitive payment method details.
- Mock fee values must not be treated as production commercial policy.

## Payment Method Security

- Full PAN must never be stored.
- CVV must never be stored.
- Future cards require provider tokenization and provider vault.
- Mobile Secure Store must not store card numbers, CVV, provider secrets, or raw payment credentials.
- Logs and audit events must store only safe labels, method IDs, provider token references, and redacted metadata.
- Payment method delete should be soft delete internally and provider detach/delete when supported.
- Admin/support must not see sensitive card details.
- Mock payment method is allowed only for development/internal validation without real money.
- A real payment cannot proceed without a valid selected method and backend ownership validation.
# Payment Method Mock Security

- Phase 5E mock payment methods do not capture PAN, CVV, expiration date, CLABE, or real payment credentials.
- Expo Secure Store is not used for mock payment methods because there is no sensitive payment credential to persist.
- A demo method must not be treated as a provider token, card vault reference, or real authorization.
- Production payment methods require approved provider tokenization and compliance review.
- Logs, receipts, and UI must not expose sensitive payment credentials.
- Real payment methods remain blocked until provider selection, tokenization, audit logs, tests, and recovery paths are complete.

# Payment Recovery Security

- Recovery states must not expose raw provider errors to users.
- Support/admin recovery views must use RBAC and least privilege.
- Recovery cases must include safe identifiers: internal folio, provider reference, request_id, and correlation_id.
- Recovery audit metadata must be redacted.
- Retry endpoints must be rate-limited and idempotent.
- Provider timeout must not trigger uncontrolled automatic retry.
- Reversal/refund actions require explicit finance/admin authorization and audit events.
- Payment recovery data must not include PAN, CVV, access tokens, OTPs, or raw provider secrets.

Phase 5F mock recovery UI rules:

- Error messages remain user-safe and do not expose raw provider or technical errors.
- Safe support references may be shown; secrets and payment credentials may not.
- Pending/unknown status must not be relabeled as success.
- Retry safety is represented in mock UX only; provider-grade idempotency remains required before real money.

# Account and Balance Security

- Account, balance, movement, and statement endpoints require authenticated user-scoped access.
- Demo balances must not be described as real funds.
- No regulated, custody, or protection claim is allowed before legal/provider approval.
- Demo and future real balance records must remain separated by explicit flags/source.
- Account status changes and balance-affecting demo actions require audit events.
- Admin/auditor balance access requires least privilege and safe read policies.
- Logs must not leak other-user balance snapshots or sensitive payment/provider data.

## Phase 6B Demo Account Security Notes
- Account endpoints derive scope from `get_current_user`; no account ID is accepted from the client.
- Mobile account data is kept in Zustand memory state and is not written to Secure Store.
- Demo balance copy explicitly rejects real-money interpretation.
- Balance and movement payloads contain no PAN, CVV, provider secrets, or regulated-funds claims.
## Phase 7 Receipt And History Security

- Receipt and history surfaces must not expose raw provider payloads, card data, or sensitive payment-method data.
- Backend receipt/payment lists remain user scoped and must stay authenticated.
- Support references in UI must be safe identifiers such as mock reference, request id, or correlation id.
- Receipt copy must avoid regulated or provider-confirmed claims when the state is mock, pending, failed, timeout, or unavailable.
- Future download/share flows require the same authorization and redaction checks as receipt detail.

## Card Payment Security

- FondixPay is card-only for user-facing payments in the current roadmap.
- PAN must never be stored.
- CVV must never be stored.
- Future card payment requires approved processor tokenization and provider vault behavior.
- PCI scope must be reviewed before any real card payment release.
- Logs and support tools must never include card numbers or CVV.
- Mobile Secure Store must not store PAN or CVV.
- Recovery must handle declined card, expired card, invalid CVV, card auth failure, and processor timeout without exposing raw processor payloads.
- Real card payments remain blocked until provider selection, security review, auditability, idempotency, recovery, tests, and fee transparency gates are accepted.
- SPEI, CoDi, OXXO/store payment, cash-in, cash, bank transfer, wallet balance, and stored balance are out of scope as user-facing payment methods.

## Card Processor Security

- Card-only remains the user-facing payment model.
- PAN and CVV must not enter FondixPay backend by default and must never be persisted.
- Real card flows require approved tokenization.
- Prefer hosted fields, hosted checkout, mobile SDK tokenization, or equivalent processor-controlled secure UI to minimize PCI scope.
- Processor public/secret/webhook credentials must use environment-specific secret management.
- Future card webhooks require signature verification, replay protection, redaction, and idempotent processing.
- Logs, audit events, provider payload summaries, and support tickets must remain safe/redacted.
- Admin/support panels must never show PAN/CVV and must use least privilege.
- Mobile Secure Store must not persist PAN, CVV, raw processor credentials, or raw card payloads.
- Production remains blocked until processor selection, PCI/security review, tokenization, idempotency, audit, recovery, reconciliation, and sandbox validation are accepted.

## Prontipagos Integration Security

- Prontipagos secrets must use environment-specific secret management and never enter source control.
- Provider authentication mechanism must be confirmed before implementation.
- Payment execution needs bounded timeout and retry limits.
- Ambiguous timeout or unknown provider outcome must not be relabeled as success.
- Logs, audit records, and provider error surfaces must be redacted and user safe.
- Request/response payload evidence should be hashed or redacted by default.
- Future webhooks require signature/replay verification if Prontipagos supports them.
- Reconciliation/admin access must use RBAC and least privilege.

## Phase 8C Sandbox Provider Security

- Phase 8C uses mocks only; no real provider credentials or production URLs are required.
- `.env.example` contains placeholders for card processor and Prontipagos sandbox configuration.
- Sandbox card contracts accept token references only and tests verify no PAN/CVV fields.
- Sandbox provider response evidence is stored through safe references and hashes, not raw payloads.
- Production remains blocked until official contracts, secret management, webhook/status security, reconciliation, PCI review, and manual-review operations exist.

## Phase 9 Receipt Proof Security

- Receipt proof exposes fee breakdown, status, and support-safe identifiers only.
- Safe card metadata is limited to safe label and future approved brand/last4; PAN and CVV stay out of proof.
- Service references are masked in backend proof.
- Provider raw payloads and secrets are not returned.
- Mobile sharing uses only mock proof text without sensitive payment credentials.
- Notification content must not include PAN, CVV, OTP, access token, provider secret, or raw provider payload.
- Receipt, payment proof, and notification reads are authenticated and current-user scoped.

## CRM Admin Panel Security

- Every admin API requires authentication, explicit role, explicit permission, response redaction, and tests.
- Future admin MFA is required before commercial production.
- Admin session management must add expiration, revocation/session inventory, login/logout audit, and no shared accounts.
- Least privilege applies to support, finance, admin, auditor, and super-admin paths.
- No PAN, CVV, card token, OTP, secret, session token, or raw provider payload may appear in CRM responses, logs, exports, or ticket notes.
- Provider and audit data must use mapped/redacted views and safe references.
- Exports require explicit controls, audit events, and policy gating.
- Admin auth, search, export, and mutation paths need rate limiting and future lockout/backoff.
- Future IP/device controls should be evaluated for privileged roles.
- Ledger and audit views remain read-only from CRM; manual review preserves append-only evidence and audit trail.
## CRM Admin Panel Security Runtime

Phase 10B adds backend `/admin/*` dependencies that require bearer authentication, an admin role, and one explicit runtime permission. A valid normal `USER` token is insufficient.

- Role checks are server-side from the persisted user role; the client cannot grant admin access.
- Admin responses pass through redaction helpers and safe schemas.
- PAN, CVV, card tokens, secrets, passwords, and raw provider payloads are never exposed by implemented admin responses.
- `SUPPORT` receives masked phone and limited provider references.
- Admin read/write operations reuse the existing audit writer for current sensitive routes.
- Reconciliation endpoints are safe placeholders and do not fabricate provider evidence.
- Session hardening, dedicated admin auth, MFA, export controls, lockout/rate-limit policy, and future IP/device trust remain production blockers.

## CRM Admin Frontend Security

- The `admin/` web app is separate from mobile and consumes only redacted backend admin contracts.
- Frontend permission rendering hides unavailable modules/actions but never replaces backend authorization.
- Development role simulation requires `VITE_ENABLE_ADMIN_DEV_AUTH=true` and is documented as development-only.
- The current access screen stores the pasted bearer token in session storage for this initial internal app; dedicated hardened admin session/auth remains pending.
- Audit metadata rendering blocks unexpected sensitive key names such as PAN, CVV, secret, token, and raw payload keys.
- UI copy and reconciliation pages keep mock/sandbox and not-implemented status explicit.
## Phase 10D - CRM Workflow Security

The support, manual review, reconciliation, and search workflows preserve the CRM security model:

- Backend RBAC remains the source of truth for every `/admin/*` endpoint.
- Frontend permission-aware rendering hides unavailable workflows but does not replace backend authorization.
- SUPPORT cannot view full reconciliation or resolve financial manual review cases.
- AUDITOR is read-only.
- Tickets and manual review notes must not include PAN, CVV, card tokens, secrets, or raw provider payloads.
- Provider references are role-redacted.
- Reconciliation endpoints are placeholders and return `production_ready=false`.
- Manual review never mutates ledger entries, payment amounts, card status, provider confirmations, or receipt confirmation state.
- Closing tickets/manual review requires resolution text for traceability.
- Admin action audit metadata is redacted.

Production remains blocked until real admin auth hardening, MFA/session controls, production reconciliation, fraud/chargeback readiness, and operational monitoring are completed.

## Phase 10D.1 - WhatsApp Receipt Channel Security

WhatsApp is future-only in Phase 10D.1. No runtime provider integration, secrets, templates, sends, or webhooks are implemented.

Security requirements for future implementation:

- WhatsApp consent must be explicit and granular.
- No WhatsApp toggle may be pre-enabled.
- Full phone numbers must not be logged in delivery records, audit events, CRM views, or provider evidence.
- Use recipient hash and masked display where needed.
- Message payloads must not include PAN, CVV, card tokens, secrets, raw provider payloads, OTP codes, or raw provider errors.
- Provider secrets must live in environment-specific secret management, not in the repo.
- Future webhooks must verify provider signatures and protect against replay/spoofing.
- Delivery must be idempotent to block duplicate receipt messages.
- Provider errors must be sanitized before user, CRM, log, or audit display.
- WhatsApp failure must not block or alter payment, receipt, proof, ledger, or audit state.

The internal receipt/proof remains the source of truth. WhatsApp is a convenience delivery channel only.

## Phase 10X - Public Landing Page Security

The public landing page is a static commercial front door under `landing/`.

Security rules:

- No secrets, API keys, private URLs, or backend tokens.
- No payment processing.
- No card capture.
- No PAN/CVV.
- No login or account access.
- No CRM/Admin links.
- No provider payloads.
- No ledger, receipt, reconciliation, or audit runtime.
- No unsupported compliance, regulation, tokenization, PCI, or "100% secure" claims.
- Vercel is approved only for this static landing, not for backend financial or admin runtime.

The landing may include public placeholders for future app store, terms, privacy, support, and landing URLs. Those placeholders must not be replaced until official channels are approved.
## Coverage-Aware Service Catalog Security

- Public catalog and coverage endpoints must not expose secrets, provider credentials, raw provider payloads, internal margins, PAN, CVV, card tokens, or private URLs.
- Provider service codes and capability details are admin-only and require RBAC.
- Coverage changes must require explicit permissions and audit events.
- Provider mapping changes must be protected from SUPPORT-level roles unless explicitly approved.
- Landing coverage data is public/commercial reference and must be sanitized before publication.
- Prontipagos credentials and provider API keys must stay in secret management, never in catalog records or frontend bundles.
- Raw provider catalog sync payloads must be stored only if there is a redaction and retention policy; otherwise store normalized safe fields only.
- A compromised public landing page must not grant access to mobile payment APIs, admin APIs, CRM, ledger, receipts, provider payloads, or secrets.
