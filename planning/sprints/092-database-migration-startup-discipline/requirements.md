# Sprint 092 — Database Migration Startup Discipline

## Why This Sprint Exists

Blocks B-04 (SEV-2). `Base.metadata.create_all(bind=engine)` runs at every backend startup (line 60 of `backend/app/main.py`). In production this silently creates tables, ignores schema drift, and bypasses Alembic. If a migration introduces a breaking schema change, `create_all` may silently produce a different schema than Alembic expects, creating production incidents that are extremely difficult to diagnose.

This sprint removes `create_all` from startup and enforces Alembic as the only schema management path.

## Blockers Closed

- B-04: `Base.metadata.create_all` at startup (SEV-2)

## Scope

1. **Remove `create_all`** from `backend/app/main.py`. The `Base.metadata.create_all(bind=engine)` call must be deleted entirely.

2. **Production startup check:** If `APP_ENV` is `production` or `staging` and the `alembic_version` table does not exist in the database, fail startup with a clear error: `"Database has not been migrated. Run 'alembic upgrade head' before starting the server."`. This must NOT block development (`APP_ENV=development`).

3. **Alembic migration for `chatbot_ai_metrics`:** The `ChatbotAiMetric` model (added in Sprint 061) has no Alembic migration — it was relying on `create_all`. Create migration `20260616_0012_chatbot_ai_metrics.py`.

4. **Alembic migration for `otp_tokens`** (if Sprint 091 chose PostgreSQL OTP backend): Coordinate with Sprint 091 output. If the table was created via `create_all` in Sprint 091, add it to Alembic now.

5. **Deployment documentation:** Update `backend/README.md` (or create it if missing) with required deploy sequence: `alembic upgrade head` → `uvicorn app.main:app`. This must appear in CI/CD pipeline comments.

6. **Tests:** Add a test that starts the app with an unmigrated database in production-like mode and confirms it fails with the correct error message.

## Out of Scope

- Staging Terraform provisioning (Sprint 093)
- Changing any migration SQL content beyond the two new migrations
- Any mobile or landing changes

## Risk

If any existing migration is missing or broken, removing `create_all` will expose the schema gap on staging deploy. Run `alembic upgrade head` on a fresh test database before marking this sprint complete.
