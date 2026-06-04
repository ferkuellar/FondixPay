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

