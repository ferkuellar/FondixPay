# Sprint 099 — Blueprint

## Backend Files

### backend/app/core/logging.py (new)
```python
import logging, json, uuid
from fastapi import Request

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log = {
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "ts": self.formatTime(record),
        }
        if hasattr(record, "request_id"): log["request_id"] = record.request_id
        if hasattr(record, "user_id"): log["user_id"] = record.user_id
        return json.dumps(log)

def get_logger(name: str):
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger
```

### backend/app/main.py
- Add logging middleware: generate UUID request_id per request, log request/response
- Replace `@app.on_event("startup")` with `@asynccontextmanager` lifespan (fixes SEV-4 deprecation)
- Add Sentry init: `sentry_sdk.init(dsn=settings.sentry_dsn, ...)`

### backend/app/core/config.py
- Add `sentry_dsn: str = ""` setting

### backend/app/modules/health/routes.py (new or extend existing)
- `GET /health` — public, fast
- `GET /health/detailed` — admin auth

### backend/requirements.txt
- Add `sentry-sdk[fastapi]`

## Mobile Files

### mobile/app.json (or via expo plugins)
- Add Sentry plugin: `@sentry/react-native`

### mobile/src/app.tsx (or _layout.tsx)
- Init Sentry on app start with `EXPO_PUBLIC_SENTRY_DSN`

### mobile/.env.example
- Add `EXPO_PUBLIC_SENTRY_DSN=`

## Docs

### docs/RUNBOOK.md (new)
- Sections: Startup, Restart, Rollback, Tekae disable, OTP fallback, DB migration, Escalation

## Uptime Monitor Setup (manual, not code)

1. Register at BetterUptime or UptimeRobot
2. Add monitor: HTTP GET `https://api.fondixpay.com/health`, interval 1min
3. Alert: email `fercuellar@gmail.com` on downtime > 2min
4. Record monitor name and provider in ADR-199

## Replace print() Statements

```bash
grep -rn "print(" backend/app/ --include="*.py"
```
Replace each with appropriate `logger.info()` or `logger.error()` using the new JSON logger.
