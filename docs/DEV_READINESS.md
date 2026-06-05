# Dev Readiness

Status: Sprint 012 documentation snapshot. This document does not authorize runtime payment implementation.

## Scope

Sprint 012 prepares FONDIXPAY for future Tekae runtime integration while Tekae contract closure remains externally blocked.

This readiness work is documentation-only. It does not create payment endpoints, webhook endpoints, migrations, credentials, backend runtime changes, mobile runtime changes, AWS resources, or production deployment behavior.

## Current Repo Structure

| Area | Current path | Readiness status |
| --- | --- | --- |
| Backend API | `backend/` | FastAPI app with SQLAlchemy, Alembic scaffold, pytest dependencies, and local Docker support. Runtime remains mock/dev for payments. |
| Mobile app | `mobile/` | Expo React Native TypeScript app with `npm run typecheck`. Tekae shell/readiness code exists but remains disabled. |
| Admin app | `admin/` | Vite React TypeScript admin app with typecheck/build scripts. |
| Local orchestration | `docker-compose.yml` | Starts PostgreSQL and backend using `.env.example` plus an internal Docker `DATABASE_URL`. |
| AWS infra | `infra/terraform/` | Dev-only Terraform foundation with VPC, public subnet, optional EC2 compute disabled by default, optional storage, and budgets. |
| CI | `.github/workflows/` | Backend pytest/compile, mobile typecheck, admin typecheck/build, landing static boundary check, Terraform validation and manual dev deploy workflows. |
| Planning | `planning/` | Sprint and governance records. Sprint 011 remains the external Tekae contract gate. |
| Docs | `docs/` | Architecture, API, security, deployment, environment, Tekae discovery, and integration docs. |

## Backend Readiness

Current backend stack:

- FastAPI.
- SQLAlchemy.
- Alembic scaffold.
- PostgreSQL via local Docker.
- Pytest available through `backend/requirements.txt`.
- `/health` endpoint documented.
- Current payment behavior remains mock/dev and must not be treated as real provider execution.

Local backend run path:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Docker backend run path:

```powershell
docker compose up -d
```

Backend blockers before real provider runtime:

- Tekae contract readiness remains external and incomplete.
- Real provider status/query/reconciliation model is missing.
- Webhook or official no-webhook model is missing.
- Provider reference/folio mapping is missing.
- Runtime credential storage and rotation process is not configured.
- Production auth/RBAC/rate limiting/audit/observability remain production gates.

## Database And Alembic Readiness

Current state:

- `backend/alembic.ini` exists.
- `backend/alembic/versions/` contains historical migrations.
- `docs/ARCHITECTURE.md` notes that `Base.metadata.create_all(bind=engine)` is still used by the backend entry point and should be reviewed before production.

Sprint 012 does not create migrations.

Database blockers before future runtime:

- Migration discipline must be confirmed before production.
- Provider transaction, session, audit, receipt, and reconciliation schemas must wait for Tekae contract readiness.
- No Tekae payment tables should be added until the implementation sprint is approved.

## Mobile Readiness

Current mobile stack:

- Expo.
- React Native.
- TypeScript.
- React Navigation.
- Zustand.
- Expo Secure Store dependency available.
- `npm run typecheck` exists in `mobile/package.json`.

Current provider readiness:

- Tekae integration shell/readiness files exist.
- `TEKAE_ENABLED=false` remains required.
- Mobile must not generate Tekae tokens.
- Mobile must not hold Tekae credentials.
- Mobile may only launch a backend-provided Tekae URL after a future approved runtime sprint.

Mobile blockers before future runtime:

- No approved Tekae launch endpoint exists.
- No Tekae sandbox credentials or Swagger are available.
- No transaction outcome model exists.
- App copy that implies production success must be reviewed before any real provider flow.

## Admin Readiness

Current admin stack:

- Vite.
- React.
- TypeScript.
- `npm run typecheck`.
- `npm run build`.
- API base configured through `VITE_API_BASE_URL`.

Admin blockers before future provider operations:

- Admin/support views must never expose Tekae credentials, tokens, full launch URLs, raw provider payloads, PAN, CVV, OTPs, or secrets.
- Tekae support/reconciliation views remain blocked until Tekae provides official status, reconciliation, and support contracts.

## CI Readiness

Current workflows:

- `.github/workflows/ci.yml`
  - Backend compile and pytest.
  - Mobile typecheck.
  - Admin typecheck and build.
  - Landing static boundary check.
- `.github/workflows/terraform-dev.yml`
  - Terraform fmt/init/validate.
  - Manual dev plan only when GitHub `dev` environment secrets are configured.
- `.github/workflows/deploy-dev.yml`
  - Manual dev apply only.
  - Requires `confirm_environment=dev` and `apply=true`.

CI blockers:

- CI green does not mean Tekae runtime readiness.
- CI green does not mean production readiness.
- Dev deploy workflows depend on GitHub environment secrets and AWS OIDC configuration.
- Staging and production workflows are not enabled.

## AWS Dev Readiness

Current implemented AWS direction:

- `infra/terraform/environments/dev` is the only active Terraform environment.
- It creates a low-cost dev VPC/public subnet foundation.
- Optional EC2 compute is disabled by default through `enable_compute=false`.
- No NAT Gateway, Load Balancer, ECS/Fargate, EKS, RDS, WAF, or production landing infrastructure is created.
- Terraform plan/apply require configured AWS identity and explicit approval.

Backend hosting direction:

- Local/Docker remains the current active development path.
- AWS dev can support future controlled backend validation only after plan review and explicit approval.
- Current Terraform does not implement staging.
- Staging backend hosting remains a future design decision and must not be inferred from dev.

Landing boundary:

- The public landing page may remain hosted outside AWS, currently assumed Vercel unless changed by decision.
- Landing must not host backend financial runtime, provider credentials, payment operations, reconciliation, ledger/audit workloads, or admin runtime.

## Mock Provider Vs Real Provider Boundary

Mock/dev behavior:

- May simulate payments, receipts, provider placeholders, and demo states.
- Must be labeled as mock/dev where relevant.
- Must not be presented as provider-confirmed money movement.

Real Tekae behavior:

- Remains blocked until Sprint 011 contract readiness passes.
- Requires official sandbox/API access, webhook or no-webhook model, transaction status/query model, reconciliation model, production connectivity, reference/folio mapping, receipt rules, support process, and security requirements.

Copy rule:

- Token generation or URL launch must never be described as payment success.
- Mock success must be distinguished from provider-confirmed success.
- Pending/unknown/provider-unconfirmed outcomes must not be relabeled as success.

## Internal Blockers

- `docs/ENVIRONMENT.md` and this readiness snapshot were created in Sprint 012 and should be reviewed before execution starts.
- Sprint 013 reconciled `docs/ENVIRONMENTS.md` with `docs/ENVIRONMENT.md`. Sprint 018 supersedes the canonical relationship: `docs/ENVIRONMENTS.md` is now canonical and `docs/ENVIRONMENT.md` is a pointer. Current Terraform remains a cheaper dev foundation with optional EC2 and no RDS/ECS.
- Historical Prontipagos/card processor references remain in older docs and code paths as documentation/runtime debt. Sprint 012 does not perform broad cleanup.
- App copy and mock success screens need future review before real provider flow.

## External Tekae Blockers

- Sandbox URL.
- Swagger/OpenAPI.
- Test credentials.
- Webhook specification or official no-webhook model.
- Transaction status/query API.
- Reconciliation mechanism.
- Production VPN/VPC or allowlist details.
- Provider transaction/reference fields.
- Receipt/comprobante retrieval rules.
- Support/escalation process and SLA.
- Security requirements.

## Sprint 012 Decision Boundary

Sprint 012 improves readiness only.

It does not mark the product production-ready, does not enable Tekae, and does not authorize payment runtime.

## Sprint 018 Environment Strategy Formalization

Sprint 018 promotes `docs/ENVIRONMENTS.md` to the canonical DEV / STAGING / PROD strategy.

DEV remains mock/demo only:

- Local Expo/mobile, local or isolated dev backend, and local/dev database are allowed.
- Real users, real money, production credentials, Tekae runtime, and production data are prohibited.
- Debug logs are acceptable only when they do not expose secrets, OTPs, tokens, full phone numbers, provider payloads, PAN, or CVV.

STAGING remains future preproduction:

- It is the only environment where Tekae sandbox/test credentials may be used, and only after Sprint 019 readiness approval.
- It must use separate backend, database, secrets, CORS, logs, audit behavior, and test data.

PROD remains blocked:

- Production requires approved backend, database, secrets, monitoring, backup/restore, rollback, support ownership, and Tekae production security/network approval before any real provider runtime.

Sprint 018 does not create infrastructure, workflows, secrets, runtime behavior, endpoints, webhooks, migrations, or deployments.
