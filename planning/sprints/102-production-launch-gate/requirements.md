# Sprint 102 — Production Launch Gate

## Why This Sprint Exists

Sprint 101 passed the Go/No-Go vote. This sprint activates production: switches to production credentials, enables Tekae for real users, verifies every launch gate criterion, and monitors the first 24 hours of live traffic.

## Prerequisites (hard gates — cannot bypass)

- Sprint 101 Go/No-Go: product, security, and legal sign-off obtained
- Sprint 098: app available on at minimum one store (Google Play or App Store)
- Sprint 097: legal pages live at `fondixpay.com` with no placeholders
- Sprint 099: observability (Sentry, structured logs, uptime monitor) active in production
- Sprint 100: security headers and refresh token rotation active in production

## Scope

1. **Production environment provisioning:**
   - `infra/terraform/environments/production/` (adapt from staging)
   - Production RDS instance (separate from staging and dev)
   - Production ECS/EC2 service
   - Production secrets in AWS Secrets Manager (not in code or `.env`)

2. **Production environment variables:**
   - `APP_ENV=production`
   - `TEKAE_ENABLED=true` ← only here, after all gates pass
   - `TEKAE_UID`, `TEKAE_PASSWORD`, `TEKAE_BEARER`, `TEKAE_BASE_URL` — production values from Tekae (not sandbox)
   - `TEKAE_PORTAL_UID` — production portal UID (same value as TEKAE_UID per ADR-192)
   - Strong `JWT_SECRET` (64+ characters)
   - `DATABASE_URL` pointing to production RDS
   - `SENTRY_DSN` pointing to production Sentry project
   - `CORS_ORIGINS` = `https://fondixpay.com,https://www.fondixpay.com`

3. **Tekae production network path (ADR-197):**
   - Confirm VPN, IP allowlist, or mTLS path to Tekae production API
   - Verify production backend can reach `https://endpointtekaetokenprod-704030137706.us-central1.run.app`
   - Confirm `validate_security_settings` passes on startup

4. **Production deploy sequence:**
   - `terraform apply` on production environment
   - AWS Secrets Manager: set all production secrets
   - GitHub Actions production pipeline: run tests → migrate DB → deploy → health check
   - `alembic upgrade head` on production DB (no `create_all`)
   - `GET production-url/health` must return `{"status":"ok","db_reachable":true}`

5. **Mobile production build:**
   - New EAS production build pointing to production API
   - `EXPO_PUBLIC_API_URL=https://api.fondixpay.com`
   - `EXPO_PUBLIC_TEKAE_ENABLED=true` (only now, after all gates)
   - Submit updated build to stores
   - Monitor crash rate in Sentry for first 24 hours

6. **DNS:**
   - `fondixpay.com` → Vercel (landing) — already confirmed
   - `api.fondixpay.com` → production backend (set in AWS Route 53 or DNS provider)

7. **24-hour post-launch monitoring:**
   - Monitor error rate every 30 minutes for first 4 hours
   - Monitor Tekae session success rate every 30 minutes
   - Monitor OTP rate limit breach count (alert if >20/hour)
   - Rollback criteria: if error rate >10% for 15 consecutive minutes → rollback

8. **Rollback procedure (documented in RUNBOOK.md):**
   - Backend: deploy previous version via GitHub Actions
   - Tekae: set `TEKAE_ENABLED=false` (users see graceful "no disponible" message)
   - Mobile OTA: `eas update --branch production --message "rollback"` (users get patch without re-download)

## Constraint

`TEKAE_ENABLED=true` in production is the final action and must be the last environment variable set, after `GET /health` confirms all other systems are up.
