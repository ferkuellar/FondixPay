# Phase 10D.1 Blueprint

## Architecture

- Add `docs/WHATSAPP_RECEIPT_CHANNEL.md` as the primary channel architecture document.
- Add a WhatsApp-specific backlog.
- Add proposed data model for notification preferences and delivery logs.
- Add future API contracts only.
- Add future audit event catalog.
- Add security, operations, validation, UI/UX, roadmap, and state alignment.

## Runtime Boundary

No code, provider adapter, credentials, webhooks, sender, template runtime, mobile screen, or admin runtime is implemented in this phase.

## Future Implementation Path

1. Implement consent and preferences.
2. Select provider and provision secrets outside repo.
3. Implement delivery log and idempotency.
4. Implement `fondix_pago_exitoso` only.
5. Add CRM delivery visibility and safe retry controls.
