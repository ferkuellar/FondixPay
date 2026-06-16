# Sprint 099 — Builder Handoff Prompt

You are implementing Sprint 099: Observability, Operations & Incident Readiness for FONDIXPAY.

## Context

FONDIXPAY backend uses FastAPI on Python 3.11. There is currently no structured logging (some `print()` calls exist), no error tracking, no uptime monitoring, and no operational runbook. This sprint adds all of them.

**Sprint 093 must be complete** (staging environment needed for validation).

## What To Build

1. **Structured JSON logging**: create `backend/app/core/logging.py` with a JSON formatter. Replace all `print()` in `backend/app/` with `logger.info/error/warning` calls. Every HTTP request must produce a JSON log line with `request_id`, `method`, `path`, `status_code`, `duration_ms`.

2. **Health endpoint**: extend or create `GET /health` to return `{"status":"ok"|"degraded"|"down","db_reachable":bool,"tekae_enabled":bool,"uptime_seconds":int}`. Add `GET /health/detailed` (admin auth) with migration status and failed payments count.

3. **Sentry integration**:
   - Backend: `pip install sentry-sdk[fastapi]`; add `sentry_sdk.init(dsn=settings.sentry_dsn)` in `main.py`; add `SENTRY_DSN` to Settings
   - Mobile: `npx expo install @sentry/react-native`; init with `EXPO_PUBLIC_SENTRY_DSN`
   - Add `before_send` filter that strips OTP/JWT/Tekae values from events

4. **Replace `@app.on_event("startup")`** with `@asynccontextmanager` lifespan (FastAPI deprecation fix — was noted as SEV-4)

5. **Uptime monitor**: set up external monitoring on `/health` (BetterUptime/UptimeRobot — manual setup, document in ADR-199 and RUNBOOK.md)

6. **`docs/RUNBOOK.md`**: create with sections: Startup, Restart, Rollback, TEKAE_ENABLED disable, OTP fallback, DB migration procedure, On-call escalation

## Files to Read First

- `backend/app/main.py` — current startup and event handlers
- `backend/app/core/config.py` — Settings class
- `backend/app/modules/health/` (if exists) — existing health endpoint
- `mobile/app.json` — Expo plugin list

## Constraints

- Sensitive values (OTP, JWT, Tekae credentials, portalUrl) must NEVER appear in logs or Sentry events
- All 202+ existing backend tests must pass after logging changes
- `SENTRY_DSN` must default to empty string (no Sentry if not configured)
- Do not add Datadog or Grafana (future scope)
- `TEKAE_ENABLED` remains false

## Validation

```bash
grep -rn "print(" backend/app/ --include="*.py"
# must return zero matches in production code
```

Report: files changed, print() count removed, Sentry test event received (yes/no), health endpoint response in staging, runbook sections completed, ADR-199 text.
