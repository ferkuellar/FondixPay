# Sprint 092 — Builder Handoff Prompt

You are implementing Sprint 092: Database Migration Startup Discipline for FONDIXPAY.

## Context

FONDIXPAY runs FastAPI/SQLAlchemy/Alembic on Python 3.11 with PostgreSQL. At the start of this sprint, `backend/app/main.py` contains `Base.metadata.create_all(bind=engine)` which runs at every startup. This bypasses Alembic and silently creates schema without migration tracking. The fix is to remove it and enforce Alembic as the only schema path.

**Sprint 091 must be complete before this sprint.** If Sprint 091 created an `otp_tokens` table via `create_all`, that table needs an Alembic migration here.

## What To Build

1. Remove `Base.metadata.create_all(bind=engine)` from `backend/app/main.py`.

2. Add a startup check: if `APP_ENV` is `production` or `staging` and the `alembic_version` table is missing from the database, raise `RuntimeError` with message: `"Database has not been migrated. Run 'alembic upgrade head' before starting the server."` Do NOT add this check for `development` env.

3. Add Alembic migration for `chatbot_ai_metrics` table. The model lives in `backend/app/modules/chatbot/models.py` (`ChatbotAiMetric` class). There is no migration for it yet — it was created by `create_all`.

4. If Sprint 091 used PostgreSQL for OTP tokens, add an Alembic migration for `otp_tokens`.

5. Update `backend/README.md` with deploy sequence: `alembic upgrade head` → `uvicorn`.

## Files to Read First

- `backend/app/main.py` — find and remove `create_all`
- `backend/app/modules/chatbot/models.py` — `ChatbotAiMetric` schema
- `backend/alembic/versions/` — list existing migrations to find the latest `down_revision`
- `backend/alembic/env.py` — confirm `target_metadata = Base.metadata`
- `backend/app/core/config.py` — `Settings.app_env` field (or `APP_ENV`)

## Constraints

- Do not change any migration SQL for existing tables
- Do not add any new product features
- `TEKAE_ENABLED` remains false
- All 202+ existing tests must still pass

## Validation

1. `alembic upgrade head` on empty PostgreSQL DB — must succeed
2. Backend start with empty DB in `APP_ENV=staging` — must raise RuntimeError
3. Backend start with migrated DB — must succeed
4. `grep -r "create_all" backend/app/` — must return zero results

Report: files changed, migration names created, test results, and confirmation of zero `create_all` references.
