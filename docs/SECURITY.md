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
