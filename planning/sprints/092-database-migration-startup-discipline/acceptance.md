# Sprint 092 — Acceptance Criteria

## B-04: No create_all at Startup

- [ ] `backend/app/main.py` has zero `create_all` references
- [ ] `Base.metadata.create_all` is not called anywhere in the startup path
- [ ] `grep -r "create_all" backend/app/` returns zero matches in production code paths

## Alembic Migrations

- [ ] `alembic upgrade head` on a fresh database produces all expected tables
- [ ] `chatbot_ai_metrics` migration file exists and creates the correct schema
- [ ] Migration round-trip (`downgrade base` → `upgrade head`) succeeds without errors
- [ ] All 11+ migration files have correct `down_revision` chain (no gaps)

## Startup Check

- [ ] Backend startup with unmigrated DB in `APP_ENV=production` raises RuntimeError
- [ ] Error message contains "alembic upgrade head"
- [ ] Backend startup with unmigrated DB in `APP_ENV=development` succeeds (no gate)
- [ ] Backend startup with migrated DB in any env succeeds

## Documentation

- [ ] `backend/README.md` documents deploy sequence with `alembic upgrade head` first
- [ ] `.github/workflows/deploy-staging.yml` (or equivalent) references migration step

## General

- [ ] All 202+ existing backend tests pass after `create_all` removal
- [ ] New migration discipline tests: minimum 3 test cases
