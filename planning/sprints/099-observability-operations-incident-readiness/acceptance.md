# Sprint 099 — Acceptance Criteria

## Structured Logging

- [ ] Zero `print()` statements remain in `backend/app/` (production code paths)
- [ ] Every HTTP request produces a JSON log line with: request_id, method, path, status_code, duration_ms
- [ ] OTP codes, JWT tokens, Tekae credentials, portalUrl are never present in any log line
- [ ] Logs visible in CloudWatch (or equivalent) when backend runs in staging

## Health Endpoints

- [ ] `GET /health` returns JSON with `status`, `db_reachable`, `tekae_enabled`, `uptime_seconds`
- [ ] `GET /health/detailed` (admin auth) returns above plus `migrations_current`, `failed_payments_last_hour`
- [ ] Both endpoints return in < 500ms

## Error Tracking

- [ ] `SENTRY_DSN` configured in staging; Sentry receives test exception
- [ ] Backend unhandled exceptions appear in Sentry with stack trace and request_id
- [ ] Mobile `EXPO_PUBLIC_SENTRY_DSN` documented in `.env.example`
- [ ] Sentry `before_send` filter confirmed: OTP/JWT/Tekae credential values not in Sentry events

## Uptime Monitoring

- [ ] External uptime monitor active on staging `/health` URL
- [ ] Alert fires when `/health` returns non-200 for > 2 minutes (test by temporarily stopping staging server)
- [ ] ADR-199 recorded with chosen monitoring backend

## Alerting

- [ ] Error rate alert threshold defined and configured
- [ ] p95 latency alert threshold defined and configured
- [ ] At least one alert fires successfully in a staging test

## Runbook

- [ ] `docs/RUNBOOK.md` exists
- [ ] Covers: startup, restart, rollback, TEKAE_ENABLED disable, OTP fallback, DB migration
- [ ] Runbook has been read and confirmed accurate by at least one team member

## General

- [ ] All 202+ backend tests pass after logging changes
- [ ] Staging health check returns `{"status":"ok","db_reachable":true}` consistently
