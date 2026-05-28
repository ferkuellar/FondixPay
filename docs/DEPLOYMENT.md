# Deployment

## Current State

The project is local/dev only. It is not production ready.

## Backend Local

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Mobile Local

```powershell
cd mobile
npm install
npx expo start
```

## Docker Local

```powershell
docker compose up -d
```

## Environments Future

- local.
- dev.
- staging.
- production.

## Environment Variables

Current examples live in `.env.example`. Real secrets must not be committed.

Key current variables:

- `DATABASE_URL`.
- `JWT_SECRET_KEY`.
- `JWT_ALGORITHM`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`.
- `OTP_DEV_CODE`.
- `APP_ENV`.
- `CORS_ORIGINS`.
- `EXPO_PUBLIC_API_URL`.

## Pending

- Production secret management.
- CI/CD.
- Staging environment.
- Mobile build profiles.
- Android/iOS release process.
- Rollback plan.

## AWS Dev Deployment

The AWS Terraform foundation lives under `infra/terraform/`.

Current AWS deployment status:

- Dev Terraform foundation exists.
- Terraform format/init/validate pass for dev and backend bootstrap.
- Terraform plan is blocked until AWS credentials for a confirmed non-production account are configured.
- Terraform apply has not been run.
- No production AWS deployment exists.

Detailed workflow: [AWS_DEV_STAGING_DEPLOYMENT.md](AWS_DEV_STAGING_DEPLOYMENT.md).

Production-sensitive systems, real payments, production Prontipagos connectivity, production secrets, and production databases remain out of scope.

## AWS-3 CI/CD Deployment Controls

CI/CD workflow documentation: [CICD_PIPELINE.md](CICD_PIPELINE.md).

Current GitHub Actions deployment posture:

- Pull request validation does not deploy.
- `ci.yml` validates backend, mobile, admin, and landing boundaries without cloud credentials.
- `terraform-dev.yml` validates Terraform on infrastructure changes and can run a manual dev plan only when GitHub `dev` environment secrets are configured.
- `deploy-dev.yml` is manual only, requires `confirm_environment=dev`, requires `apply=true`, and uses the GitHub `dev` environment.
- Production deployment is not enabled.
- Staging deployment is not enabled because no Terraform staging environment exists.

Rollback/destruction remains manual:

1. Review the failed deployment logs.
2. Run a fresh Terraform plan for dev.
3. Run `terraform plan -destroy` only if destruction is the intended rollback.
4. Do not run `terraform destroy` without explicit human approval.

Vercel remains approved only for `landing/`. Backend/API, CRM/Admin, payment processing, ledger/audit, reconciliation, provider credentials, and production secrets must not be deployed through the landing pipeline.
