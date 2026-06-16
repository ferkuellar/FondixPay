# Sprint 093 — Acceptance Criteria

## Staging Infrastructure

- [ ] `infra/terraform/environments/staging/` exists and applies without errors
- [ ] Staging backend URL is distinct from dev URL
- [ ] Staging RDS PostgreSQL instance is separate from dev

## CI/CD Pipeline

- [ ] `.github/workflows/deploy-staging.yml` exists
- [ ] Pipeline runs on push to `main` (or `staging` branch — documented)
- [ ] Pipeline runs backend tests before deploy (must pass)
- [ ] Pipeline runs `alembic upgrade head` against staging DB before service restart
- [ ] Pipeline deploys updated backend container after migrations succeed
- [ ] Pipeline runs health smoke test: `GET /health` returns 200 after deploy

## Staging Environment Variables

- [ ] `backend/.env.staging.example` exists with all required vars documented
- [ ] `APP_ENV=staging` enforced in staging environment
- [ ] `TEKAE_ENABLED=false` default confirmed in staging
- [ ] `validate_security_settings` passes on staging startup (strong JWT secret)
- [ ] `DEBUG=false` in staging

## Mobile Staging Target

- [ ] `mobile/.env.staging.example` (or documentation) shows how to set `EXPO_PUBLIC_API_URL` to staging
- [ ] EAS preview build profile documented (not required to be built in this sprint, but runbook must exist)

## General

- [ ] `GET staging-url/health` returns `{"status":"ok"}` from public internet
- [ ] Staging deploy can be triggered manually by running the GitHub Actions workflow
