# Environment Strategy - DEV / STAGING / PROD

Status: Sprint 018 canonical environment strategy. Documentation and planning only; no runtime, infrastructure, workflow, deployment, provider, or secret behavior is changed by this document.

## Canonical Relationship

`docs/ENVIRONMENTS.md` is the canonical DEV / STAGING / PROD environment strategy for FONDIXPAY.

`docs/ENVIRONMENT.md` is a short pointer to this file. Older Sprint 012/013 language that treated `docs/ENVIRONMENT.md` as canonical is superseded by Sprint 018.

Current implementation status:

- Local development is operational.
- AWS Terraform currently implements only a minimal `dev` foundation; it is not staging or production.
- STAGING and PROD application runtimes are not deployed.
- Tekae remains disabled/blocked.
- Prontipagos remains permanently removed.
- Vercel is approved only for the public landing page under `landing/`.

## Environment Overview

| Environment | Purpose | Users | Money/provider mode | Current status |
|---|---|---|---|---|
| DEV | Local/shared development and mock/demo validation. Safe to break locally. | Builders and developers only. | Mock/demo only. No real money. Tekae disabled. | Local is operational; shared dev backend remains future/controlled. |
| STAGING | Preproduction QA, integration testing, visual evidence, release rehearsal, and future Tekae sandbox/test validation. | Internal QA, product, security, and operations reviewers. | No real users or real money. Tekae sandbox/test only after Sprint 019 readiness approval. | Not implemented. |
| PROD | Real users and production operations after all gates pass. | Real users and authorized operators. | Real provider credentials only after approval. | Not implemented and blocked. |

## Component Matrix

| Component | DEV | STAGING | PROD |
|---|---|---|---|
| Mobile app | Expo/local or development build; may point to local/dev API. | Staging build/profile pointing only to staging API. | Production App Store / Play Store build pointing only to production API. |
| Backend API | Local FastAPI/Docker or isolated dev backend when approved. | Dedicated staging backend, separate config and secrets. | Dedicated production backend with hardened auth, monitoring, rollback, and support controls. |
| Database | Local/dev database or mock data. Safe to reset. | Dedicated staging database with test data only; never production data. | Dedicated production database with backup, restore, retention, and access controls. |
| Tekae | Disabled. No Tekae credentials. | Sandbox/test only after Sprint 019 readiness approval. | Production credentials only after security, network, provider, audit, and operations approval. |
| Landing page | Local preview or Vercel preview for public static content only. | Vercel preview/staging for public static content only. | Vercel production for public static landing only. |
| Admin/CRM | Local/dev internal validation only. Dev auth can be enabled only in DEV. | Staging admin with real RBAC/session behavior, no dev auth. | Production admin with hardened auth, MFA/session policy, RBAC, audit, and support ownership. |
| Observability | Debug logs allowed; no secrets. | Structured logs, audit behavior enabled, alert rehearsal. | Production monitoring, alerting, incident response, audit review, and support escalation. |
| Backups/rollback | Local snapshots/manual reset acceptable. | Backup/restore and rollback rehearsal required before release. | Tested backup/restore and rollback required before launch. |

## DEV Rules

Purpose:

- Local development and mock/demo testing.
- Used by developers and builders.
- Safe to break locally.
- No real users.
- No real money.
- No production credentials.
- Tekae disabled.
- Mock payment behavior only.

Expected components:

- Mobile DEV via Expo/local.
- Backend DEV local or isolated dev backend.
- DEV database or local/mock data.
- Safe `.env.example` only in repo.
- Local `.env` files may exist on a workstation but must remain uncommitted.
- Debug logs are acceptable, but secrets, tokens, full phone numbers, OTPs, provider payloads, PAN, and CVV are not.

Must never happen in DEV:

- Real payment processing.
- Production credentials.
- Tekae production access.
- Production user data.
- Production database connections.
- Production support or reconciliation decisions.

## STAGING Rules

Purpose:

- Preproduction validation.
- QA, integration testing, visual evidence, release rehearsal.
- Closest practical match to PROD without real users or real money.
- Tekae sandbox/test may be used here only after Sprint 019 readiness approval.

Expected components:

- Mobile staging build/profile.
- Backend staging.
- Staging database, separate from DEV and PROD.
- Tekae sandbox/test credentials only.
- Structured logs.
- Audit behavior enabled.
- Test data only.
- Release candidate validation.

Must never happen in STAGING:

- Production Tekae credentials.
- Real users or real money.
- Production database reuse.
- Dev OTP response exposure.
- Dev auth mode.
- Wildcard CORS.
- Treating sandbox success as production readiness.

## PROD Rules

Purpose:

- Real users and production operations.
- Real provider integrations only after approval.
- Real monitoring, backups, rollback, support, and audit controls.

Expected components:

- Mobile production build.
- Production backend.
- Production database.
- Tekae production credentials only after approved readiness.
- VPN/VPC or approved secure network path for Tekae token generation if required by Tekae.
- Backend-only provider token generation.
- Secrets managed outside repo.
- Operational runbooks and rollback required.

Must never happen in PROD:

- Mock payment execution as user-facing payment behavior.
- Development OTP fallback or `otp_dev` response.
- Dev auth mode.
- Sandbox credentials.
- Provider credentials in frontend/mobile/admin bundles.
- Unapproved Tekae launch, token, webhook, or reconciliation behavior.
- Deployment without rollback and support ownership.

## Data Rules

- DEV may use local/mock data and may be reset.
- STAGING uses test data only. Production data may not be copied into STAGING unless a future approved data-protection process defines anonymization, access control, retention, and audit requirements.
- PROD uses real user and operational data only after production approval.
- Each environment must have a separate database or clearly isolated data store.
- Coverage/catalog data must be environment-specific: DEV may use fixtures, STAGING may use test coverage/provider sandbox mappings, and PROD may expose only approved provider-backed payable services.
- Geolocation/service coverage design must test environment-specific catalog data and must not infer mobile payable status from public landing coverage alone.

## Secrets Rules

- No real secrets in the repository.
- Do not commit `.env`, `.env.local`, `.env.development`, `.env.staging`, `.env.production`, provider credentials, API keys, JWT secrets, private URLs, Terraform state, Terraform plans, or backend override files.
- `.env.example` files are placeholders only.
- DEV may use local-only placeholder values.
- STAGING and PROD require an approved secrets manager before deployment.
- Candidate secret stores remain open until decided: GitHub Environment secrets, AWS Secrets Manager, or another approved managed secret store.
- Frontend/mobile/admin bundles may contain only public environment variables and must never contain provider secrets or production Tekae credentials.

## Environment Variable Strategy

Use environment-specific values for the same logical variables rather than inventing unrelated names per tier.

Backend examples:

- `APP_ENV`: `development`, `test`, `staging`, or `production`.
- `DATABASE_URL`: environment-specific database URL from local `.env` or secret store.
- `JWT_SECRET_KEY`: weak local placeholders are allowed only in DEV; STAGING/PROD require strong private values.
- `OTP_DEV_RESPONSE_ENABLED`: may be `true` only in development/test; must be `false` in STAGING/PROD.
- `CORS_ORIGINS`: explicit per environment; never wildcard in STAGING/PROD.

Mobile examples:

- `EXPO_PUBLIC_API_URL`: points to the correct environment API.
- `EXPO_PUBLIC_APP_ENV`: optional public label for UI/runtime guards; it is not a security boundary.

Admin examples:

- `VITE_API_BASE_URL`: points to the correct environment API.
- `VITE_ENABLE_ADMIN_DEV_AUTH`: `true` only in DEV; `false` in STAGING/PROD.

Tekae examples:

- `TEKAE_ENABLED`: `false` until approved.
- `TEKAE_MODE`: `disabled` until approved.
- `TEKAE_ENV`: empty/disabled in DEV, sandbox/test in STAGING after approval, production in PROD after approval.
- `TEKAE_CLIENT_ID`, `TEKAE_CLIENT_SECRET`, `TEKAE_WEBHOOK_SECRET`: secrets store only; never frontend; never repo.

## Tekae Rules

- Tekae remains disabled until a future approved readiness/implementation sprint changes it.
- Tekae sandbox/test belongs only to STAGING and only after Sprint 019 readiness approval.
- Tekae production belongs only to PROD after VPN/VPC or approved network path, credentials, backend token flow, security, audit, reconciliation, support, and operational approvals.
- Tekae token generation must remain backend-controlled.
- Mobile, admin, landing, and frontend code must never generate, store, log, or expose production Tekae credentials or access tokens.
- Tekae launch/session creation is not payment success.
- Tekae success, failure, pending, timeout, reconciliation, and receipt evidence must be defined before runtime behavior changes.


## Sprint 019 Tekae Readiness Rules

`docs/TEKAE_INTEGRATION_READINESS.md` is the canonical Tekae readiness pack for environment-specific provider launch rules.

Environment-specific Tekae readiness:

- DEV: Tekae disabled, no credentials, no token generation, no real provider launch, mock/demo only.
- STAGING: first target for Tekae sandbox/test validation after readiness approval; requires sandbox credentials, exact sandbox base URLs, secret management, audit/log redaction, and no real users or real money.
- PROD: blocked until production credentials, VPN/VPC or approved secure network path, backend token flow, audit, rollback, observability, support, and operational ownership are approved.

Mobile/frontend/admin bundles must never contain Tekae `uid`, `password`, provider credentials, `accessToken`, or full responsive access URLs in any environment.

## Vercel / Landing Page Boundary

Vercel is approved only for the public static landing page under `landing/`.

The landing page may host:

- Public marketing content.
- Waitlist/interest capture only if approved.
- Public coverage/reference information that does not authorize payment.
- App store, terms, privacy, and support links only after official confirmation.

The landing page and Vercel must not host:

- Backend APIs.
- Mobile payment runtime.
- CRM/Admin runtime.
- Payment processing.
- Reconciliation.
- Ledger/audit workloads.
- Provider credentials.
- Tekae token generation.
- Backend secrets.
- Private customer, payment, receipt, account, balance, OTP, card, or provider data.

## Promotion Path

1. DEV: implement and validate locally with mock/demo behavior.
2. DEV review: typecheck/tests/docs pass; no secrets or runtime scope drift.
3. STAGING: deploy release candidate only after staging infrastructure, database, secret store, CORS, RBAC/auth, logs, and rollback path are approved.
4. STAGING validation: QA, visual evidence, security review, audit/log review, provider sandbox validation if approved, and release checklist.
5. PROD approval: product, security, operations, support, legal/privacy, provider, and rollback approval.
6. PROD release: deploy with monitoring, backup, incident response, and support coverage active.

## Release Gates

DEV gate:

- Mock/demo behavior remains labeled.
- No real payment/provider behavior.
- No committed secrets.
- Typecheck/tests relevant to touched areas pass.

STAGING gate:

- Dedicated staging backend and database exist.
- Secrets are environment-specific.
- Dev OTP and dev auth are disabled.
- Structured logs and audit behavior are enabled.
- Release candidate has rollback notes.
- Tekae sandbox/test evidence exists only if Sprint 019 readiness is approved.

PROD gate:

- Production backend/database/secrets/monitoring are approved.
- Tekae production network path and credentials are approved if provider runtime is enabled.
- Backend-only token generation and redaction controls are verified.
- Auth, RBAC, audit, rate limiting, reconciliation, support, backup/restore, and rollback runbooks are accepted.
- Legal/privacy/support ownership is confirmed.

## Rollback Expectations

- DEV rollback can be local reset or revert.
- STAGING rollback must rehearse backend deploy rollback, mobile build rollback path, database rollback/restore decision, and config rollback before production release.
- PROD rollback must have named owners, communication path, monitoring triggers, backup/restore validation, and no destructive database rollback without explicit approval.
- Terraform destroy/apply is never a casual rollback; destructive infrastructure actions require reviewed plan and explicit approval.

## Open Questions

The open questions are tracked in `planning/QUESTIONS.md`. Sprint 018 keeps unresolved platform choices open rather than pretending they are decided.

Current blockers include cloud provider/account ownership, Tekae sandbox ownership, production domain/API domain strategy, STAGING/PROD secret manager, database platform per environment, mobile build profiles, observability provider, rollback strategy, and production support/escalation ownership.

## Sprint 020 Coverage And Geolocation Environment Rules

`docs/SERVICE_COVERAGE_GEOLOCATION_DESIGN.md` defines the future coverage/geolocation behavior for DEV, STAGING, and PROD.

- DEV: mock location, manual state selector, fake GPS/state fixtures, mock catalog/demo fallback, and Tekae disabled are allowed when clearly labeled.
- STAGING: validate geolocation, denied/unavailable GPS, manual fallback, national services, and state coverage with test/sandbox catalog data. Tekae sandbox remains allowed only after readiness approval.
- PROD: use real coverage data and approved location permission copy only after release gates. Do not log raw coordinates. Do not put provider credentials in mobile. Tekae production remains blocked until network/security/operational approval.

Environment catalog data must remain isolated so DEV fixtures, STAGING test/sandbox catalog data, and PROD approved provider-backed payable data cannot be confused.
