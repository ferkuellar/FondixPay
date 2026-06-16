# Sprint 093 — Staging Environment Foundation

## Why This Sprint Exists

Blocks B-03 (SEV-1). Without a staging environment, every change must be validated in production or not validated at all. Staging is the required gate before any Tekae payment confirmation testing, observability setup, or security hardening can be validated safely.

## Blockers Closed

- B-03: No staging environment (SEV-1)

## Scope

1. **Terraform staging environment:** Create `infra/terraform/environments/staging/` based on existing `dev/`. Staging uses the same AWS region and account as dev. Separate RDS instance, separate ECS service or EC2 target group. Staging backend URL must be distinct from dev.

2. **GitHub Actions staging deploy pipeline:** `.github/workflows/deploy-staging.yml` triggers on push to `main` branch (or a `staging` branch — decide and record). Must: run tests, run Alembic migrations, deploy backend container.

3. **Staging environment variables:** Document `backend/.env.staging.example` with all required vars. Key overrides vs. dev:
   - `APP_ENV=staging`
   - `TEKAE_ENABLED=false` (mandatory default)
   - `DEBUG=false`
   - Strong JWT secret required (`validate_security_settings` enforced)
   - `CORS_ORIGINS` includes only staging frontend URL

4. **Staging health smoke test:** CI step after deploy: `curl staging-url/health` must return `{"status":"ok"}`.

5. **Alembic in CI:** Before the health check, CI must run `alembic upgrade head` against the staging DB. If migrations fail, deployment halts.

6. **Staging mobile build (optional):** Document how to point the mobile app at staging API URL via `EXPO_PUBLIC_API_URL`. An EAS preview build is sufficient; production track is not needed for staging.

## Out of Scope

- Production Terraform (Sprint 102)
- Tekae enabled in staging (deferred until Sprint 095 after contract is resolved)
- Mobile store submissions (Sprint 098)
- Observability stack (Sprint 099)

## External Dependency

- AWS credentials must be available in GitHub Actions secrets for staging deploy
- Staging RDS endpoint must be provisioned before CI can run migrations
