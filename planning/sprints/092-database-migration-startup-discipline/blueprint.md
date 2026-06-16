# Sprint 092 — Blueprint

## Files to Change

### backend/app/main.py
- Delete lines containing `Base.metadata.create_all(bind=engine)` and any associated import if unused after removal
- Add startup check function:
  ```python
  def _check_migrations_applied():
      if settings.app_env in ("production", "staging"):
          with engine.connect() as conn:
              result = conn.execute(text("SELECT to_regclass('alembic_version')"))
              if result.scalar() is None:
                  raise RuntimeError(
                      "Database has not been migrated. "
                      "Run 'alembic upgrade head' before starting the server."
                  )
  ```
- Call `_check_migrations_applied()` in the `startup` event handler

### backend/alembic/versions/20260616_0012_chatbot_ai_metrics.py (new)
- Create `chatbot_ai_metrics` table migration matching `ChatbotAiMetric` model exactly:
  - `id` bigserial PK
  - `conversation_id` UUID FK to `chatbot_conversations`
  - `model` varchar(100)
  - `latency_ms` integer
  - `input_tokens` integer
  - `output_tokens` integer
  - `created_at` timestamptz default now()

### backend/alembic/versions/20260616_0013_otp_tokens.py (new, if Sprint 091 used PostgreSQL)
- Create `otp_tokens` table: `phone` varchar PK, `otp_hash` varchar, `expires_at` timestamptz, `attempts` int default 0, `locked_until` timestamptz nullable

### backend/README.md (create if missing)
- Required deploy sequence: `alembic upgrade head` → `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Environment variables table
- Test command: `cd backend && pytest --tb=short`

### backend/tests/test_migration_discipline.py (new)
- Test: startup with empty DB in staging mode raises RuntimeError with migration message
- Test: startup with migrated DB in staging mode succeeds
- Test: startup with empty DB in development mode succeeds (no check)

## Validation Steps

1. `alembic upgrade head` on a fresh PostgreSQL DB — must succeed without errors
2. `alembic downgrade base` then `alembic upgrade head` — round-trip must produce identical schema
3. Backend starts with migrated DB and production env — must not crash
4. Backend starts with empty DB and production env — must fail with migration message
5. Backend starts with empty DB and development env — must succeed

## Risk Mitigation

Before removing `create_all`, run `alembic upgrade head` on a test DB and compare schema with `pg_dump` against what `create_all` produced. Any differences must be resolved in the migrations before this sprint is marked complete.
