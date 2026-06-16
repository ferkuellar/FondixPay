# Sprint 093 — Builder Handoff Prompt

You are implementing Sprint 093: Staging Environment Foundation for FONDIXPAY.

## Context

FONDIXPAY has an AWS dev environment with Terraform in `infra/terraform/environments/dev/`. GitHub Actions workflows exist for dev: `.github/workflows/deploy-dev.yml` and `terraform-dev.yml`. This sprint creates an equivalent staging environment and CI/CD pipeline.

**Sprints 091 and 092 must be complete** before this sprint (OTP hardening and Alembic migration discipline must be in place before staging is used for validation).

## What To Build

1. Copy and adapt `infra/terraform/environments/dev/` to `infra/terraform/environments/staging/`. Change resource names and environment identifiers. Staging must have a separate RDS instance from dev.

2. Create `.github/workflows/deploy-staging.yml`. It must:
   - Trigger on push to `main` branch
   - Run `cd backend && pytest` (fail fast if tests fail)
   - Build and push Docker image to ECR
   - Run `alembic upgrade head` against staging DB
   - Deploy updated backend container
   - Run smoke test: `curl $STAGING_URL/health` returns 200

3. Create `backend/.env.staging.example` with all required variables. `TEKAE_ENABLED=false` is mandatory. `DEBUG=false`. `APP_ENV=staging`. Strong JWT secret required.

4. Document in `mobile/README.md` (or update if exists) how to point the mobile app at staging via `EXPO_PUBLIC_API_URL`.

## Files to Read First

- `infra/terraform/environments/dev/` — all Terraform files
- `.github/workflows/deploy-dev.yml` — existing dev pipeline
- `.github/workflows/terraform-dev.yml`
- `backend/app/core/config.py` — Settings class for env var names
- `backend/.env.example` — current env var documentation

## Constraints

- `TEKAE_ENABLED=false` must be the default in staging (hard-coded in `.env.staging.example`)
- No production Terraform (that is Sprint 102)
- Do not enable Tekae in staging in this sprint
- Staging deploy must run Alembic migrations before starting the server (Sprint 092 dependency)

## Output

Report: Terraform resources created, CI pipeline file location, smoke test result (manually triggered or described), and any GitHub Secrets that need to be set (list names only, never values).
