# Sprint 102 — Acceptance Criteria (Launch Gate)

All criteria below must be met before activating `TEKAE_ENABLED=true` in production.

## Infrastructure

- [ ] `infra/terraform/environments/production/` applied successfully
- [ ] Production RDS instance running and reachable from backend
- [ ] Production ECS/EC2 service running
- [ ] All production secrets in AWS Secrets Manager (not in code or git)

## Database

- [ ] `alembic upgrade head` ran on production DB without errors
- [ ] `alembic_version` table present with correct latest revision
- [ ] No `create_all` in production startup path

## Security

- [ ] `validate_security_settings` passes on production startup
- [ ] JWT secret is 64+ characters (confirmed via startup validation)
- [ ] `CORS_ORIGINS` contains no wildcard or localhost in production
- [ ] HTTPS enforced: `curl http://api.fondixpay.com/health` → 301 redirect to HTTPS
- [ ] Security headers present: `curl -I https://api.fondixpay.com/health | grep -i "x-content-type"`

## Health

- [ ] `GET https://api.fondixpay.com/health` → `{"status":"ok","db_reachable":true,"tekae_enabled":false}` (before TEKAE activation)
- [ ] Sentry receiving events on production DSN (test: trigger a test exception)
- [ ] Uptime monitor active and reporting green

## Tekae Production

- [ ] Production Tekae credentials confirmed from Tekae (separate from sandbox)
- [ ] Network path to production Tekae API confirmed (VPN/VPC/allowlist per ADR-197)
- [ ] Test: `POST /api/payments/tekae/session` with production credentials returns valid `portalUrl`
- [ ] Production portal URL resolves and shows Tekae portal for a test user
- [ ] `TEKAE_ENABLED=true` set in production only after all above pass

## Mobile

- [ ] Production EAS build with `EXPO_PUBLIC_API_URL=https://api.fondixpay.com`
- [ ] `EXPO_PUBLIC_TEKAE_ENABLED=true` in production build
- [ ] App submitted to store with production API URL
- [ ] Crash-free rate in Sentry > 99% in first hour of beta users

## DNS / Landing

- [ ] `https://fondixpay.com` resolves with HTTP 200 and no placeholders
- [ ] `https://fondixpay.com/privacidad` resolves with HTTP 200
- [ ] `api.fondixpay.com` DNS resolves to production backend

## 24-Hour Monitoring

- [ ] Error rate < 5% at hour 1, 4, 12, 24
- [ ] Tekae session success rate > 80% at hour 4
- [ ] No rollback triggered (rollback criteria: error rate >10% for 15 consecutive minutes)

## Go/No-Go (carried from Sprint 101)

- [ ] Product owner sign-off: [name + date]
- [ ] Security sign-off: [name + date]
- [ ] Legal sign-off: [name + date]

## Launch Declared Complete When

All checkboxes above are checked AND 24-hour monitoring shows stable metrics.
