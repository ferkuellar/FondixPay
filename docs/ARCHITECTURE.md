# Architecture

## Product Principle

FondixPay should feel like a simple service-payment app, not a bank. The primary flow remains:

```txt
Open app -> see pending services -> pay -> receive receipt
```

## Current State

The repository contains an existing MVP mock/dev implementation. It is not production financial infrastructure.

No real payment provider is integrated. The current integration is a mock that simulates balance lookup, service payment, and receipt generation.

Sprint 010 updates the target provider architecture: Tekae is the approved payment/service capability provider. FONDIXPAY is not a fintech, bank, wallet, card processor, acquirer, SPEI processor, tokenization service, or banking core. FONDIXPAY only embeds Tekae payment capabilities through approved integration boundaries.

## Mobile Architecture

- Expo.
- React Native.
- TypeScript.
- React Navigation.
- Zustand stores.
- Expo Secure Store dependency is available.

Current screens:

- Onboarding.
- Phone login.
- OTP verification.
- Home.
- Add service.
- Service detail.
- Confirm payment.
- Payment success.
- History.
- Profile.

## Backend Architecture

FastAPI exposes a modular API by domain:

- `auth`: phone, mock OTP, JWT.
- `users`: minimal profile/user domain.
- `service_providers`: provider catalog.
- `user_services`: user-owned service references.
- `payments`: mock payment creation/simulation.
- `receipts`: receipt records.
- `notifications`: simple messages.
- `integrations/aggregator_mock`: replaceable mock aggregator boundary.

Other current pieces:

- SQLAlchemy models and session setup.
- Alembic scaffold.
- PostgreSQL configuration.
- `/health` endpoint.
- CORS configured from settings.

## Sprint 010 Tekae Target Architecture

The approved discovery architecture is:

```txt
FONDIXPAY Mobile App -> FONDIXPAY Backend -> Tekae SSO URL -> Tekae Business
```

Backend responsibilities:

- Authenticate and authorize the FONDIXPAY user.
- Generate Tekae SSO sessions using backend-held credentials.
- Store only safe internal session references and audit metadata.
- Return only a minimal mobile launch payload.
- Redact Tekae credentials, tokens, and full launch URLs from logs.

Mobile responsibilities:

- Request a Tekae launch session from the backend.
- Open the Tekae URL when provided.
- Treat Tekae launch as provider handoff, not payment success.
- Show pending/unknown/support states when provider evidence is missing.

Forbidden FONDIXPAY architecture:

- Card vault.
- Wallet.
- Ledger balance.
- Tokenization.
- Acquiring.
- SPEI processor.
- Banking core.


## Sprint 019 Tekae Readiness Architecture

`docs/TEKAE_INTEGRATION_READINESS.md` is the canonical pre-implementation readiness pack for Tekae.

Future Tekae architecture remains backend-brokered: mobile requests a FONDIXPAY backend session, backend validates auth/environment/eligibility/duplicate-flow controls, backend calls Tekae token endpoints, backend builds the short-lived responsive URL, and mobile opens the approved launch strategy.

No Sprint 019 architecture change enables Tekae runtime. The conceptual `POST /api/payments/tekae/session` endpoint remains proposed/not implemented. Tekae launch/session creation must not mark a payment successful, generate production receipt proof, mutate ledger/reconciliation state, or bypass provider evidence rules.

## Key Backend Entry Point

`backend/app/main.py`:

- Creates database metadata with `Base.metadata.create_all(bind=engine)`.
- Registers CORS middleware.
- Includes routers for `/auth`, `/users`, `/service-providers`, `/user-services`, `/payments`, `/receipts`, and `/notifications`.
- Exposes `GET /health`.

## Current Risks

- `Base.metadata.create_all` is useful for early development but should be reviewed before production.
- Current OTP is development-only.
- Payment and receipt behavior is mock/dev.
- RBAC is not documented as implemented.
- Audit logs are not implemented.
- Real provider webhooks do not exist yet.

## Pending Architecture Work

- Authentication hardening.
- Database migration discipline.
- Audit logs.
- Role-based access control.
- Backend permission enforcement.
- Automated tests.
- CI/CD.
- Payment provider selection.
- Observability.
- Production environment strategy.
- Tekae webhook, transaction query, reconciliation, sandbox, and production VPN/VPC details.

## Sprint 012 Dev Readiness Boundary

Sprint 012 prepares internal readiness while Tekae contract closure remains externally blocked.

Current backend hosting posture:

- Local/Docker remains the current operational development path.
- The AWS Terraform foundation is dev-only and minimal.
- Current Terraform supports a dev VPC/public subnet foundation, optional EC2 compute disabled by default, storage, and budget alerts.
- Current Terraform does not implement staging, production, RDS, ECS/Fargate, load balancers, NAT Gateway, WAF, or production Tekae connectivity.

Architecture rules:

- Do not infer production readiness from dev readiness.
- Do not infer Tekae runtime readiness from CI, Terraform validation, or local mock payment behavior.
- Keep public landing separate from backend/API/payment/admin runtime. Vercel may host the public landing only.
- Keep mock/dev payment flows separate from future Tekae provider-confirmed flows.
- Keep Tekae runtime blocked until Sprint 011 contract readiness passes.

## Sprint 020 Service Coverage And Geolocation Architecture

`docs/SERVICE_COVERAGE_GEOLOCATION_DESIGN.md` is the canonical design for future state-based service visibility and geolocation/manual fallback behavior.

Architecture direction: mobile obtains a user-selected or GPS-derived state, backend owns normalized coverage rules, backend returns state-eligible services plus national services, and mobile displays only the backend-approved catalog. GPS is used only to infer state and must not be treated as payment evidence, provider eligibility, or continuous tracking.

Sprint 020 does not implement GPS, reverse geocoding, endpoint changes, migrations, Tekae mapping, payment logic, or runtime filtering changes.

## Sprint 021 Tekae Catalog Normalization Architecture

`docs/TEKAE_CATALOG_NORMALIZATION_DESIGN.md` is the canonical Sprint 021 design for the future catalog normalization layer.

The target architecture keeps raw Tekae catalog structure behind a FONDIXPAY-owned normalized service catalog. Tekae `menu`, `categoria`, and `carrier` values are provider mapping metadata, while mobile and business logic consume internal fields such as category, display name, `coverageMode`, `coverageStates`, and active/payable status.

Sprint 021 does not implement parser scripts, import jobs, backend models, migrations, endpoints, mobile filtering, Tekae launch, provider calls, or payment behavior. It only documents the future layer needed before coverage-aware Tekae runtime can be approved.

## Sprint 027 Public Catalog Coverage API Architecture

`docs/PUBLIC_CATALOG_COVERAGE_API_DESIGN.md` is the canonical Sprint 027 design for the future public/mobile catalog coverage API projection.

Target architecture:

```text
Normalized Backend Catalog -> Sanitized Public Catalog Projection -> Mobile Service Discovery
```

The backend remains the owner of catalog coverage rules. Mobile should eventually consume backend-provided `coverage.mode` and `coverage.states` instead of relying on local/demo coverage metadata.

Public projection rules:

- Expose only FONDIXPAY business fields and sanitized coverage fields.
- Represent national services as `coverage.mode = "NATIONAL"` with `coverage.states = []`.
- Represent state services as `coverage.mode = "STATE"` with canonical `MX-*` state codes.
- Keep `MX-ALL` internal/import-only.
- Keep Tekae `menu`, `categoria`, `carrier`, provider IDs, source row IDs, raw payloads, credentials, tokens, production URLs, commercial terms, and confidential provider material outside public/mobile responses.

Sprint 027 does not implement the projection, endpoint, schema, migration, mobile integration, Tekae runtime, or payment behavior.
