# FONDIX PAY - AXON-AI Project Instructions

FONDIX PAY / FondixPay is a mobile-first application for domestic service payments in Mexico.

Current status: existing MVP mock/dev implementation. It is not a real financial production system and must not be represented as production-ready.

## Current Stack

- Mobile: Expo, React Native, TypeScript, React Navigation, Zustand, Expo Secure Store.
- Backend: FastAPI, SQLAlchemy, Alembic scaffold, PostgreSQL.
- Local orchestration: `docker-compose.yml`.

## Builder Reading Order

Every Builder must read these files before changing implementation:

1. `AGENTS.md`
2. `planning/STATE.md`
3. `planning/DECISIONS.md`
4. `planning/DOMAIN.md`
5. `planning/RISKS.md`
6. `planning/ROADMAP.md`
7. Active sprint under `planning/sprints/`
8. `docs/ARCHITECTURE.md`
9. `docs/API.md`
10. `docs/SECURITY.md`

## Operating Rules

- Do not expand scope without an approved sprint requirement.
- Do not delete the existing `mobile/` or `backend/` implementation.
- Do not restructure existing folders without documenting the decision in `planning/DECISIONS.md`.
- Do not integrate real payment providers without an approved phase.
- Do not handle real money until ledger, audit logs, security, validation, and provider decisions are defined.
- Do not store secrets, API keys, tokens, passwords, or private URLs in the repo.
- Do not create endpoints without authentication and authorization design.
- Do not introduce financial actions without audit logging requirements.
- Do not declare the product production-ready while payment, receipt, OTP, and provider flows remain mock/dev.
- Preserve AXON-AI Architect / Builder separation: Architect defines approved scope and Builder implements only against `requirements.md`, `blueprint.md`, and `acceptance.md`.

## Current Mock Scope

The current flow supports phone login, development OTP `123456`, adding CFE/Telmex/Telcel services, mock payment confirmation, mock receipt generation, and mock history.

## Durable Decisions

All durable decisions must be recorded in `planning/DECISIONS.md`. All current state must be recorded in `planning/STATE.md`. Risks belong in `planning/RISKS.md`. Open questions belong in `planning/QUESTIONS.md`. Relevant files belong in `planning/FILE_INVENTORY.md`.
