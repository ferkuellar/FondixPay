# Payment Recovery Paths

## Summary
Payment Recovery Paths are controlled flows for handling failed, pending, unconfirmed, duplicated, receipt-missing, provider-error, and support-required payment cases in FondixPay.

This document is blueprint-only. It does not implement real payments, Prontipagos, refunds, reversals, reconciliation, or irreversible financial logic.

## Dependency Status
- Phase 5A ledger/audit design exists.
- Phase 5B ledger/audit implementation exists for mock/dev baseline.
- Phase 5C fee transparency exists.
- Phase 5D payment method strategy exists.
- Phase 5E mock payment method UX exists under `005e-payment-method-ux-mock-implementation`.

Because real provider behavior is still unknown, implementation of recovery logic remains blocked until provider contracts, sandbox behavior, idempotency rules, audit coverage, and reconciliation rules are accepted.

## Principles
- Never hide uncertainty from the user.
- Never show “paid” without sufficient confirmation.
- Never duplicate charges without idempotency protection.
- Every state change must be auditable.
- Every failed payment needs a clear next action.
- Every pending payment needs an estimated time or instruction.
- Every missing receipt must be traceable.
- Every ambiguous case must go to support or reconciliation.
- Provider timeout is not success.
- Receipt availability is separate from payment confirmation.

## Main Scenarios

### Scenario A — Payment Failed Before Processing
Examples:
- Payment method rejected.
- Validation error.
- Insufficient funds.
- Invalid service reference.

Expected result:
- Do not generate receipt.
- Show clear error.
- Allow correction or changing method.
- Emit audit event.

User message:
“No pudimos completar tu pago. Revisa el método o intenta con otro.”

### Scenario B — Payment Pending
Examples:
- Provider takes longer to confirm.
- Temporary timeout.
- Operation sent but no final response.

Expected result:
- State: `pending_confirmation`.
- Do not show as paid.
- Show “Estamos confirmando tu pago”.
- Block immediate duplicate payment when idempotency applies.
- Create follow-up tracking.

### Scenario C — Payment Processing
Examples:
- Backend received request.
- Operation is queued.
- Waiting for provider response.

Expected result:
- State: `processing`.
- Show waiting or history state.
- Allow status refresh.
- Do not repeat provider operation without idempotency key.

### Scenario D — Successful Payment Without Receipt
Examples:
- Payment confirmed.
- Receipt generation failed.

Expected result:
- Payment state: `paid`.
- Receipt state: `pending_generation` or `failed_generation`.
- Show “Tu pago fue confirmado. Estamos generando tu comprobante”.
- Create receipt recovery task.

### Scenario E — Failed After Provider Attempt
Examples:
- Provider rejected.
- Reference not accepted.
- Service temporarily unavailable.

Expected result:
- State: `failed_provider`.
- Show safe, friendly cause.
- Allow retry only if retry-safe.
- Store provider code safely.

### Scenario F — Duplicate Payment
Examples:
- User taps twice.
- Network retry.
- Future duplicated webhook.

Expected result:
- Use idempotency key.
- Do not duplicate charge.
- Emit `payment.duplicate_detected`.
- Show original result.

User message:
“Detectamos un intento duplicado. No te cobraremos dos veces.”

### Scenario G — Charged But Not Applied
Examples:
- Provider confirms charge but utility provider does not reflect payment yet.

Expected result:
- State: `paid_pending_provider_application`.
- Create clarification case.
- Show honest status.
- Escalate to support/reconciliation.

### Scenario H — Incorrect Reference
Examples:
- User registered wrong service number.

Expected result:
- Future Prontipagos validation should block before payment.
- If detected after payment attempt, route to support/manual review.

### Scenario I — Aggregator Timeout
Examples:
- Prontipagos does not respond in expected window.

Expected result:
- State: `provider_timeout`.
- Do not mark final failed if charge uncertainty exists.
- Schedule later provider status check.
- Show “en verificación”.

### Scenario J — Future Reversal / Refund
Examples:
- Payment needs reversal.
- Operation failed after charge.

Expected result:
- No implementation now.
- Proposed states: `reversal_requested`, `reversal_processing`, `reversed`, `reversal_failed`.
- Requires later financial, provider, legal, and ledger rules.

## Recommended Payment States

| State | Description | Changed by | Terminal | Receipt? | Audit? | Retry? | User Message |
|---|---|---|---|---|---|---|---|
| `created` | Payment record initialized | system | no | no | yes | no | Pago iniciado |
| `validating` | Service/method/amount validation running | system | no | no | yes | no | Validando datos |
| `pending_user_confirmation` | User must confirm total and method | user/system | no | no | yes | no | Revisa y confirma |
| `processing` | Request accepted for processing | system | no | no | yes | no direct retry | Procesando tu pago |
| `pending_confirmation` | Provider result uncertain | system/provider | no | no | yes | controlled | Estamos confirmando |
| `paid` | Sufficient confirmation exists | system/provider | yes for payment | yes or pending | yes | no | Pago confirmado |
| `paid_pending_receipt` | Paid but receipt not ready | system | no | pending | yes | no | Comprobante en proceso |
| `paid_pending_provider_application` | Charged but application not verified | system/support | no | conditional | yes | no | Pago en aclaración |
| `failed_validation` | Validation failed before processing | system | yes | no | yes | yes after correction | Revisa los datos |
| `failed_payment_method` | Method failed | provider/system | yes | no | yes | yes with method change | Cambia método |
| `failed_provider` | Provider rejected or failed final | provider/system | yes | no | yes | maybe | No se completó |
| `provider_timeout` | Provider did not respond clearly | system/provider | no | no | yes | no immediate retry | En verificación |
| `cancelled` | User/system cancelled before submission | user/system | yes | no | yes | no | Pago cancelado |
| `duplicate_detected` | Duplicate attempt blocked | system | yes for attempt | original only | yes | no | Intento duplicado |
| `recovery_required` | Needs operational review | system | no | conditional | yes | no | Pago en revisión |
| `support_required` | Needs support/finance action | support/system | no | conditional | yes | no | Requiere soporte |
| `reversal_requested` | Future reversal requested | support/finance | no | no | yes | no | Reverso solicitado |
| `reversal_processing` | Future reversal processing | system/provider | no | no | yes | no | Reverso en proceso |
| `reversed` | Future reversal completed | provider/system | yes | voided | yes | no | Pago reversado |
| `reversal_failed` | Future reversal failed | provider/system | no | conditional | yes | no | Reverso no completado |

## Allowed Transitions

| From | To |
|---|---|
| `created` | `validating` |
| `validating` | `pending_user_confirmation`, `failed_validation` |
| `pending_user_confirmation` | `processing`, `cancelled` |
| `processing` | `pending_confirmation`, `paid`, `failed_provider`, `provider_timeout` |
| `pending_confirmation` | `paid`, `recovery_required`, `failed_provider` |
| `paid` | `paid_pending_receipt`, `paid_pending_provider_application`, `reversal_requested` |
| `paid_pending_receipt` | `paid`, `support_required` |
| `provider_timeout` | `pending_confirmation`, `failed_provider`, `recovery_required` |
| `failed_validation` | `pending_user_confirmation` after correction |
| `failed_payment_method` | `pending_user_confirmation` after method change |
| `failed_provider` | `pending_user_confirmation` only if retry-safe |
| `recovery_required` | `support_required`, `paid`, `failed_provider` |
| `support_required` | `paid`, `failed_provider`, `reversal_requested` |
| `reversal_requested` | `reversal_processing` |
| `reversal_processing` | `reversed`, `reversal_failed` |

## Forbidden Transitions
- `paid` → `failed_provider` without special reversal/support event.
- `failed_provider` → `paid` without provider verification.
- `reversed` → `paid`.
- `cancelled` → `paid`.
- `duplicate_detected` → `paid` without linking to original payment.
- `provider_timeout` → `paid` without confirmation.

## User-Facing UX States

### Payment Failed
Message:
“No pudimos completar tu pago.”

Actions:
- Intentar de nuevo.
- Cambiar método.
- Contactar soporte.

### Payment Pending
Message:
“Estamos confirmando tu pago.”

Actions:
- Ver estado.
- Recibir notificación.
- Return to history.

### Confirmed Without Receipt
Message:
“Tu pago fue confirmado. Estamos generando tu comprobante.”

Actions:
- Ver historial.
- Solicitar comprobante.

### Payment Under Review
Message:
“Tu pago está en revisión.”

Actions:
- Abrir ticket.
- Ver folio interno.

### Duplicate Detected
Message:
“Detectamos un intento duplicado. No te cobraremos dos veces.”

Actions:
- Ver pago original.
- Ver estado.

## Future Admin UX

Future admin/support console should include:
- Recovery queue.
- Filters by state, priority, user, provider, amount, date, error code, retry count.
- Assigned support/finance owner.
- Recommended action.
- Provider reference.
- Internal folio.
- Timeline and audit log.
- Case notes.
- Resolution status.

## Future API Concepts

These endpoints are proposed only. They are not implemented in Phase 5F.

| Endpoint | Purpose | Auth | Future Role | Validation | Audit Event |
|---|---|---|---|---|---|
| `GET /payments/{payment_id}/status` | Read payment status | required | USER owner/SUPPORT/FINANCE | ownership/RBAC | `payment.status_viewed` future |
| `POST /payments/{payment_id}/retry` | Request retry | required | USER owner | retry-safe state, idempotency | `payment.retry_requested` |
| `POST /payments/{payment_id}/cancel` | Cancel before provider submission | required | USER owner/SUPPORT | cancellable state | `payment.cancelled` |
| `POST /payments/{payment_id}/recovery-case` | Create recovery case | required | USER owner/SUPPORT | ambiguous or support state | `recovery.case_created` |
| `GET /payment-recovery-cases` | List recovery cases | required | SUPPORT/FINANCE/ADMIN | RBAC | `recovery.case_listed` future |
| `GET /payment-recovery-cases/{case_id}` | Read case | required | SUPPORT/FINANCE/ADMIN | RBAC | `recovery.case_viewed` future |
| `POST /payment-recovery-cases/{case_id}/assign` | Assign case | required | SUPPORT/ADMIN | assignee exists | `recovery.case_assigned` |
| `POST /payment-recovery-cases/{case_id}/resolve` | Resolve case | required | SUPPORT/FINANCE/ADMIN | resolution code, evidence | `recovery.case_resolved` |
| `POST /receipts/{receipt_id}/regenerate` | Regenerate missing receipt | required | SUPPORT/SYSTEM | paid state and receipt failure | `receipt.regeneration_requested` |

## Audit Events

Required future events:
- `payment.created`
- `payment.validation_failed`
- `payment.processing_started`
- `payment.pending_confirmation`
- `payment.provider_timeout`
- `payment.paid`
- `payment.failed`
- `payment.duplicate_detected`
- `payment.recovery_required`
- `payment.support_required`
- `payment.retry_requested`
- `payment.retry_blocked`
- `payment.cancelled`
- `payment.reversal_requested`
- `receipt.generation_failed`
- `receipt.regeneration_requested`
- `recovery.case_created`
- `recovery.case_assigned`
- `recovery.case_resolved`

Each event should include:
- actor
- entity
- before
- after
- severity
- requires_review
- request_id
- correlation_id
- safe metadata only

## Retry Rules
- Retry is allowed only from retry-safe states.
- No automatic retry when there is charge uncertainty.
- Retry requires idempotency key.
- Retry attempts must be limited by count and time window.
- `provider_timeout` must not retry immediately without status lookup.
- Validation errors require user correction.
- Payment method errors can allow method change.
- Provider errors can allow retry only after provider-specific safe window.

## Communication Rules
- Use clear language.
- Do not expose raw provider technical errors.
- Do not say “falló” if the state is only pending.
- Do not say “pagado” without sufficient confirmation.
- Always show internal folio when support is needed.
- Include estimated time when possible.
- Always show the next action.

## Implementation Blockers
- Real provider behavior and status codes are unknown.
- Prontipagos sandbox is not integrated.
- Real reconciliation rules are not implemented.
- Recovery case backend model is not implemented.
- Support/admin console does not exist.
- Notification channels are not implemented.
- Refund/reversal financial rules are not approved.
