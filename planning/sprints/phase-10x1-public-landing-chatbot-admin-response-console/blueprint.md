# Phase 10X.1 Blueprint - Public Landing Chatbot & Admin Response Console

## Architecture

- Landing page owns the approved floating chatbot UI in `landing/index.html`.
- Browser sends anonymous public messages to `POST /api/public/chat`.
- Backend resolves responses in this order: private-operation guardrail, exact FAQ, intent, knowledge search, optional AI provider, safe fallback.
- CRM/Admin uses `/admin/chat/*` routes for internal response configuration and review.
- Chatbot data is persisted through SQLAlchemy models and Alembic migration.

## Security Design

- Public input is validated and bounded by message length.
- Public endpoint never queries customer, payment, receipt, balance, card, OTP, transaction, provider, ledger, or admin data.
- Messages are masked before storage.
- Admin APIs require backend permissions.
- Audit events are emitted for mutations and public conversation/fallback creation.
- AI provider credentials are optional environment variables and are not committed.

## UI Design

- Public landing chatbot visual design is copied from the approved artifact and remains unchanged.
- Admin UI follows existing CRM patterns: page sections, panels, tables, loading/empty/error states, and permission-aware actions.
