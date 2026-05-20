# Sprint 004B - Backend Safety & Test Foundation Blueprint

## Test Architecture

- Use `backend/tests/conftest.py` as the shared pytest fixture entrypoint.
- Create an in-memory SQLite engine with `StaticPool`.
- Override FastAPI `get_db` during tests.
- Drop/create schema per test to avoid local data coupling.
- Use factories for users, providers, user services, payments, receipts, and notifications.

## Test Files

- `test_health.py`: `/health` and `/openapi.json`.
- `test_auth.py`: development OTP login flow.
- `test_auth_security.py`: Phase 4A config/auth hardening tests.
- `test_providers.py`: public provider catalog.
- `test_user_services.py`: protected endpoint and ownership.
- `test_payments.py`: protected endpoint and user scoping.
- `test_receipts.py`: protected endpoint and user scoping.
- `test_notifications.py`: protected endpoint and user scoping.

## Documentation

Update AXON-AI docs with:

- Backend validation commands.
- Current test coverage.
- Remaining production blockers.
- Migration discipline decision.
- Recommendation for next phase.
