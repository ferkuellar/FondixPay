# File Inventory

Updated: 2026-05-19

| Path | Purpose | State | Sensitive | Notes |
| --- | --- | --- | --- | --- |
| `README.md` | Project overview and local commands | Updated | No | Now links AXON-AI governance docs |
| `AGENTS.md` | Main Builder instructions | Created | No | Canonical operating source |
| `CLAUDE.md` | Claude adapter | Created | No | Points to `AGENTS.md` |
| `CODEX.md` | Codex adapter | Created | No | Points to sprint files |
| `.env.example` | Example environment variables | Existing | Yes, example only | Contains dev placeholders; no real secrets should be added |
| `docker-compose.yml` | Local Postgres/backend orchestration | Existing | No | Uses development defaults |
| `backend/app/main.py` | FastAPI app, routers, health endpoint | Existing | No | Calls `Base.metadata.create_all`; review in Phase 2 |
| `backend/app/core/config.py` | Backend settings | Existing | Config-sensitive | Review secret handling in Phase 2 |
| `backend/app/core/database.py` | Database engine/session | Existing | No | Review session lifecycle in Phase 2 |
| `backend/app/core/security.py` | JWT/security helpers | Existing | Security-critical | Review in Phase 2 |
| `backend/app/modules/auth/*` | Auth models/routes/schemas/services | Existing | Security-critical | OTP is dev/mock |
| `backend/app/modules/users/*` | User domain | Existing | Personal data | Needs permission enforcement review |
| `backend/app/modules/service_providers/*` | Provider catalog | Existing | No | Includes seed logic |
| `backend/app/modules/user_services/*` | User service accounts | Existing | Personal data | Must be user-scoped |
| `backend/app/modules/payments/*` | Mock payment domain | Existing | Financial-critical | Must remain mock until hardening |
| `backend/app/modules/receipts/*` | Receipt domain | Existing | Financial-critical | Needs traceability |
| `backend/app/modules/notifications/*` | Notification domain | Existing | Personal data | Needs delivery strategy later |
| `backend/app/modules/integrations/aggregator_mock/*` | Mock provider integration | Existing | No | Replacement point for future provider |
| `backend/alembic.ini` | Migration configuration | Existing | Config-sensitive | Migrations not expanded in Phase 1 |
| `backend/alembic/` | Alembic scaffold | Existing | No | No migration added in Phase 1 |
| `backend/requirements.txt` | Backend dependencies | Existing | No | FastAPI, SQLAlchemy, Alembic, JWT libs |
| `mobile/package.json` | Mobile dependencies and scripts | Existing | No | Includes `typecheck` |
| `mobile/App.tsx` | Expo app entry | Existing | No | Not modified |
| `mobile/src/navigation/AppNavigator.tsx` | Mobile navigation | Existing | No | Not modified |
| `mobile/src/screens/*` | Existing app screens | Existing | No | Not modified |
| `mobile/src/services/*` | Mobile API clients | Existing | Config-sensitive | Review API error handling in Phase 2 |
| `mobile/src/store/*` | Zustand stores | Existing | State-sensitive | Review persistence/session handling |
| `mobile/src/theme/colors.ts` | Mobile color tokens | Existing | No | Align with `fondix.png` in Phase 3 |
| `docs/architecture.md` | Existing architecture notes | Updated | No | Expanded into AXON-AI architecture doc |
| `fondix.png` | Visual reference | Not found | No | Add under repo or `references/` before Phase 3 if available |
