# Phase 5F — Payment Recovery Paths Requirements

## Goal
Define payment recovery paths for failed, pending, duplicated, unconfirmed, missing-receipt, provider-timeout, and support-required payment scenarios.

## Mode
Mock/dev mobile UX implementation plus recovery blueprint. Backend/provider recovery remains out of scope.

## In Scope
- Recovery scenarios.
- Payment states and safe transitions.
- User-facing recovery UX.
- Future admin/support UX.
- Future API contracts.
- Audit events.
- Retry rules.
- Risks, questions, and acceptance criteria.
- Mobile failed/pending recovery screens.
- Controlled mobile scenario selector for success, failed, pending, timeout, and duplicate-blocked.

## Out of Scope
- Real payments.
- Prontipagos integration.
- Refunds/reversals implementation.
- Provider webhooks.
- Admin panel.
- Notifications.
- Backend models/endpoints.
- Backend runtime changes.

## Dependencies Checked
- Phase 5A exists.
- Phase 5B exists.
- Phase 5C exists.
- Phase 5D exists.
- Phase 5E exists as `005e-payment-method-ux-mock-implementation`.

## Acceptance
Phase 5F is accepted when recovery design is documented and production remains explicitly blocked.
