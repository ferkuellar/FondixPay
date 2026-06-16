# Sprint 102 — Builder Handoff Prompt

You are executing Sprint 102: Production Launch Gate for FONDIXPAY.

## Context

All sprints 091–101 are complete. Sprint 101 Go/No-Go vote passed with sign-offs from product, security, and legal. This sprint activates production: provisions the production environment, deploys the backend with production Tekae credentials, enables `TEKAE_ENABLED=true` for the first time in production, and monitors the first 24 hours.

**This sprint touches production systems. Every step must be verified before proceeding to the next. Do not activate TEKAE_ENABLED=true until all prior gates pass.**

## Exact Execute Sequence

Follow the 18-step sequence in `blueprint.md`. Do not skip steps. Do not activate Tekae until step 11 (network path test) passes.

## What To Build

1. **Production Terraform** (`infra/terraform/environments/production/`): adapt from staging. Apply.

2. **Production secrets**: set all listed secrets in AWS Secrets Manager (`/fondixpay/production/...`). Never commit secret values.

3. **Production CI/CD** (`.github/workflows/deploy-production.yml`): manual dispatch only, not auto-trigger.

4. **Deploy**: run tests → build image → migrate DB → start service.

5. **Health check**: `GET https://api.fondixpay.com/health` must return `{"status":"ok","db_reachable":true}`.

6. **Tekae network test**: confirm production backend can reach Tekae production API. Confirm production credentials work (with `TEKAE_ENABLED=false` first, then set to `true` after network confirmed).

7. **Mobile**: EAS production build with `EXPO_PUBLIC_API_URL=https://api.fondixpay.com` and `EXPO_PUBLIC_TEKAE_ENABLED=true`. Submit to stores.

8. **Monitor 24 hours**: error rate, Tekae success rate, crash-free rate. Rollback if error rate >10% for 15 consecutive minutes.

## Files to Read First

- `planning/sprints/102-production-launch-gate/blueprint.md` — 18-step deploy sequence
- `planning/sprints/102-production-launch-gate/acceptance.md` — all launch gate criteria
- `docs/RUNBOOK.md` — rollback procedures (created in Sprint 099)
- `infra/terraform/environments/staging/` — base for production Terraform
- `planning/PRODUCTION_CLOSURE_PLAN.md` — confirm all B-0x blockers are closed
- `backend/app/core/config.py` — validate_security_settings (will run on prod startup)

## Constraints

- Never commit production secrets (use AWS Secrets Manager)
- `TEKAE_ENABLED=true` is the last env var to set, after all health checks pass
- Production deploy trigger must be manual (not auto on push to main)
- Document every step taken, all health check results, and monitoring snapshots in sprint completion notes

## Output

Sprint completion notes must include: Terraform resources created, health check response, Sentry test event confirmed, Tekae session test result (portal URL generated with production credentials), mobile build ID, store submission status, and 24-hour monitoring summary (error rate at hours 1, 4, 12, 24).

**This is the final sprint. Production is live when acceptance.md criteria are all checked.**
