# Sprint 099 — Observability, Operations & Incident Readiness

## Why This Sprint Exists

Blocks B-09 (SEV-2). FONDIXPAY cannot operate production safely without structured logging, error tracking, uptime monitoring, and operational runbooks. If an incident occurs, there is currently no mechanism to detect it, diagnose it, or execute a documented response. This sprint closes that gap.

## Blockers Closed

- B-09: No observability in production (SEV-2)

## Scope

1. **Structured JSON logging (backend):**
   - Replace all `print()` statements with structured logger
   - Every HTTP request logs: `request_id` (UUID), `method`, `path`, `status_code`, `duration_ms`, `user_id` (if authed)
   - JSON format (not plain text) — compatible with CloudWatch Logs or equivalent
   - Sensitive values never logged: OTP codes, JWT tokens, Tekae credentials, portalUrl

2. **Health endpoint hardening:**
   - `GET /health` currently exists — extend to return: `db_reachable`, `redis_reachable` (if applicable), `tekae_enabled`, `uptime_seconds`
   - `GET /health/detailed` (admin auth only): add `migrations_current`, `pending_payments_count`, `failed_payments_last_hour`

3. **Error tracking (Sentry):**
   - Backend: `sentry-sdk[fastapi]` — capture all unhandled exceptions with stack trace, user_id, request_id
   - Mobile: `@sentry/react-native` — capture crashes and unhandled promise rejections
   - `SENTRY_DSN` env var for backend; `EXPO_PUBLIC_SENTRY_DSN` for mobile
   - Never send OTP, JWT, or Tekae credential values to Sentry (use `before_send` filter)

4. **Uptime monitoring:**
   - Configure an external uptime check (BetterUptime, UptimeRobot, or AWS CloudWatch synthetics) on `GET /health`
   - Alerting: email/SMS/Slack on downtime > 2 minutes
   - ADR-199 must record which monitoring backend was chosen

5. **Alerting thresholds:**
   - Error rate > 5% in any 5-minute window → alert
   - p95 response time > 3s in any 5-minute window → alert
   - Tekae session failure rate > 10% → alert
   - OTP rate limit breach count > 20/hour → alert (potential brute-force)

6. **Operational runbook (`docs/RUNBOOK.md`):**
   - Backend startup: environment vars required, migration step, health check
   - Backend restart: expected behavior, how to verify recovery
   - Rollback: how to deploy previous version
   - `TEKAE_ENABLED` disable: how to turn off Tekae without downtime
   - OTP fallback: how to operate if OTP provider (Twilio) is down
   - DB migration: how to run `alembic upgrade head` in production safely
   - On-call escalation: who to contact (placeholder until ops team assigned)

## Out of Scope

- Full APM (Application Performance Monitoring) — Datadog, New Relic (future)
- Log analytics dashboards (Kibana, Grafana) — future
- Mobile crash analytics beyond Sentry (future)

## Prerequisite

Sprint 093 (staging environment) must be complete — observability stack must be validated in staging before production.
