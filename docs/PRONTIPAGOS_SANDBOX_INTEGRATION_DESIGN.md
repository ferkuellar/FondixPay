# Prontipagos Sandbox Integration Design

## Executive Summary

FondixPay uses debit and credit card as the only user-facing payment method. A future card processor tokenizes and charges the user card. Prontipagos is a separate future service-payment aggregator used by the FondixPay backend to execute domestic service payments in Mexico after approved card-charge evidence exists.

Phase 8B is design only. It defines sandbox architecture, contracts, state handling, reconciliation, operations, and security gates without calling Prontipagos, processing cards, moving money, or enabling production.

## Design Goals

- Design a safe Prontipagos sandbox integration.
- Validate service references and lookup amounts where provider capability exists.
- Execute and confirm service payments with explicit state mapping.
- Preserve idempotency, audit trails, reconciliation, and support evidence.
- Separate card charge success from service-payment execution.
- Prepare safe provider errors, receipts, operations, and future admin workflows.

## Non-Goals

- No production integration.
- No real money or live service payments.
- No real credentials or secrets.
- No Prontipagos API calls in this phase.
- No card processing or card processor implementation.
- No runtime mobile UI change.
- No live Prontipagos receipt or reconciliation implementation.

## Separation of Concerns

User card charge:

`Usuario -> FondixPay Mobile -> Card Processor -> FondixPay Backend`

Service payment execution:

`FondixPay Backend -> Prontipagos -> Service Provider`

Prontipagos is not assumed to be a card processor. FondixPay must call Prontipagos only after the future card processor flow proves the card charge or authorization is successful according to approved rules. Failed, pending, timeout, or unknown card states must not submit service payment execution.

## Required Prontipagos Capabilities

All capabilities remain to confirm with Prontipagos until contractual/API documentation is reviewed:

- Service catalog.
- Reference validation.
- Amount lookup.
- Payment execution.
- Transaction confirmation.
- Receipt, folio, or provider proof metadata.
- Transaction status query.
- Error codes and decline reasons.
- Sandbox environment and test cases.
- Authentication mechanism.
- Reconciliation reports or exports.
- Webhook or polling support, if available.

## Integration Architecture

Future implementation should adapt to repo patterns while keeping provider code isolated. Proposed shape:

```text
backend/app/modules/providers/prontipagos/
  client.py
  schemas.py
  adapter.py
  errors.py
  service_catalog.py
  reconciliation.py
  mocks.py
  tests/
```

- `ProntipagosClient`: bounded HTTP/API transport, auth, timeouts, retry envelope, request IDs.
- `ProntipagosAdapter`: normalizes provider responses into FondixPay states and safe error objects.
- `ServicePaymentOrchestrator`: checks card prerequisite, internal status, idempotency, audit, receipts, and retry policy.
- `ReconciliationService`: future provider report/status comparison and review queue feed.
- `ProviderErrorMapper`: converts provider errors into internal codes and user-safe messages.

The current `AggregatorMockClient` remains a mock/dev path, not the Prontipagos adapter contract.

## Sandbox Flow

1. User selects a service.
2. FondixPay validates the user service and reference.
3. FondixPay calculates service amount, fee, and total.
4. User confirms payment.
5. Future card processor charges or authorizes the card.
6. If card state is approved, FondixPay creates `ServicePaymentIntent` or equivalent internal execution context.
7. FondixPay submits idempotent payment execution to Prontipagos sandbox.
8. Prontipagos returns provider reference/status evidence when available.
9. FondixPay maps the response to `provider_confirmed`, `provider_pending`, `provider_rejected`, `provider_timeout`, or `provider_unknown`.
10. Internal payment and service-payment state are updated without guessing success.
11. Receipt is created or promoted only when Prontipagos confirmation rules allow it.
12. Audit events and safe hashes are recorded.
13. Mobile history, receipt, support, and reconciliation consume internal status only.

## Prontipagos State Machine

| Provider Execution State | Internal Meaning | User-Facing Status | Receipt Status |
|---|---|---|---|
| `provider_request_created` | Prepared internally | Preparando pago | unavailable |
| `provider_request_submitted` | Sent to provider | Procesando pago | pending |
| `provider_accepted` | Provider accepted request, not final unless confirmed | Procesando pago | pending |
| `provider_pending` | Provider has not confirmed final outcome | Pendiente de confirmacion | pending |
| `provider_confirmed` | Provider confirmation satisfies rules | Pago confirmado | provider_confirmed |
| `provider_rejected` | Provider rejected operation | Pago no completado | unavailable |
| `provider_failed` | Safe failed outcome | Pago no completado | unavailable |
| `provider_timeout` | No final provider evidence | Pendiente de revision | pending |
| `provider_unknown` | Ambiguous provider state | Pendiente de revision | pending |
| `provider_duplicate_blocked` | Idempotency prevented duplicate submission | Pago en revision | pending |
| `provider_reversed_future` | Future reversal evidence | Reversion en revision | voided_or_future |
| `provider_reconciled_future` | Reconciliation matched evidence | Confirmacion conciliada | provider_confirmed_or_review |
| `provider_mismatch_future` | Reconciliation mismatch | Revision requerida | pending |

`provider_timeout` and `provider_unknown` are not success.

## Error Mapping

| Internal Error | Internal Status | User Message | Retry Allowed | Support Needed | Audit Event | Reconciliation Impact |
|---|---|---|---|---|---|---|
| `invalid_reference` | provider_rejected | Revisa la referencia del servicio. | yes after edit | no by default | `prontipagos.reference_validation_failed` | none |
| `service_unavailable` | provider_failed | Este servicio no esta disponible por ahora. | bounded | maybe | `prontipagos.payment_execution_failed` | review if card already charged |
| `amount_mismatch` | provider_failed | El monto cambio. Confirma de nuevo antes de pagar. | after refresh | maybe | `prontipagos.amount_lookup_failed` | mismatch review |
| `expired_reference` | provider_rejected | La referencia ya no es valida. | after refresh | maybe | `prontipagos.reference_validation_failed` | none |
| `provider_timeout` | provider_timeout | Estamos verificando el estado del pago. | not blind retry | yes if unresolved | `prontipagos.payment_execution_timeout` | status check/manual review |
| `provider_unavailable` | provider_failed | No pudimos conectar con el proveedor. | bounded | maybe | `prontipagos.payment_execution_failed` | review if submission may exist |
| `duplicate_transaction` | provider_duplicate_blocked | Ya existe un intento para este pago. | no new execution | yes if ambiguous | `prontipagos.duplicate_blocked` | duplicate review |
| `insufficient_provider_balance` | provider_failed | No pudimos completar el pago en este momento. | no until operations clear | yes | `prontipagos.payment_execution_failed` | operational review |
| `authentication_failed` | provider_failed | El pago no esta disponible por ahora. | no | yes | `prontipagos.payment_execution_failed` | incident |
| `invalid_request` | provider_failed | No pudimos procesar esta solicitud. | after fix only | yes | `prontipagos.payment_execution_failed` | defect review |
| `unknown_error` | provider_unknown | Estamos revisando el estado del pago. | not blind retry | yes | `prontipagos.payment_execution_failed` | manual review |

## Idempotency Strategy

- Service-payment execution uses a dedicated `idempotency_key`.
- The key is unique by `payment_intent_id`, service provider, service reference, and amount.
- Retrying the same operation with the same payload returns existing result or status.
- Same key with conflicting amount/reference/provider is rejected and audited.
- Provider reference is stored separately from internal IDs.
- Timeout handling prefers status check and manual review over blind second execution.
- Duplicate taps and repeated background jobs must not create a second provider payment.

## Audit Events

Future/proposed events:

- `prontipagos.catalog_sync_started`
- `prontipagos.catalog_sync_completed`
- `prontipagos.reference_validation_requested`
- `prontipagos.reference_validation_succeeded`
- `prontipagos.reference_validation_failed`
- `prontipagos.amount_lookup_requested`
- `prontipagos.amount_lookup_succeeded`
- `prontipagos.amount_lookup_failed`
- `prontipagos.payment_execution_requested`
- `prontipagos.payment_execution_submitted`
- `prontipagos.payment_execution_succeeded`
- `prontipagos.payment_execution_pending`
- `prontipagos.payment_execution_failed`
- `prontipagos.payment_execution_timeout`
- `prontipagos.duplicate_blocked`
- `prontipagos.status_checked`
- `prontipagos.reconciliation_started`
- `prontipagos.reconciliation_completed`
- `prontipagos.reconciliation_mismatch`

## Data Model Proposal

### `service_payment_attempts`

Fields: `id`, `payment_intent_id`, `user_service_id`, `service_provider_id`, `provider_name`, `provider_operation`, `service_reference`, `amount_minor`, `currency`, `status`, `idempotency_key`, `provider_reference`, `provider_status`, `error_code`, `error_message_safe`, `request_payload_hash`, `response_payload_hash`, `correlation_id`, `created_at`, `updated_at`.

### `provider_transactions`

Fields: `id`, `service_payment_attempt_id`, `provider_name`, `provider_reference`, `provider_status`, `amount_minor`, `currency`, `raw_response_hash`, `confirmed_at`, `created_at`.

### `provider_status_checks`

Fields: `id`, `service_payment_attempt_id`, `provider_name`, `provider_reference`, `status`, `checked_at`, `result_metadata_hash`.

### `service_catalog_syncs`

Fields: `id`, `provider_name`, `status`, `started_at`, `completed_at`, `service_count`, `error_code`.

Do not store secrets or complete sensitive raw provider payloads.

## API Proposal

| Endpoint | Purpose | Auth / Role | Conceptual Request | Conceptual Response | Idempotency | Audit | Security Notes |
|---|---|---|---|---|---|---|---|
| `POST /service-payments/intents` | Prepare service-payment context | user | service/user-service, amount quote, selected card result ref | internal intent summary | create key future | intent event | user scoped |
| `POST /service-payments/{id}/execute` | Execute Prontipagos payment | user/system | approved card evidence, idempotency key | provider-mapped status | required | execution events | card prerequisite |
| `GET /service-payments/{id}/status` | Read internal mapped status | user | path id | status, receipt status, support ref | n/a | optional read | ownership |
| `POST /service-payments/{id}/retry` | Safe retry/status recovery | user/system | retry reason | existing/new safe attempt status | required | retry/execution | block blind timeout retry |
| `GET /service-providers/catalog` | Read supported catalog | public/auth per final policy | filters | normalized catalog | n/a | catalog read policy future | no provider secrets |
| `POST /service-providers/{id}/validate-reference` | Validate service reference | user | reference | normalized validation result | bounded | validation events | avoid raw logs |
| `POST /service-providers/{id}/lookup-amount` | Lookup amount where supported | user | reference | amount + validity | bounded | amount events | amount integrity |
| `GET /admin/prontipagos/reconciliation` | Review reconciliation records | finance/admin | filters | review records | n/a | admin read future | RBAC |
| `POST /admin/prontipagos/reconciliation/run` | Run reconciliation | finance/admin/system | date/report selector | job result | job key future | reconciliation events | least privilege |

## Configuration / Environment

Future placeholders only:

```text
PRONTIPAGOS_ENV=sandbox
PRONTIPAGOS_API_BASE_URL=
PRONTIPAGOS_CLIENT_ID=
PRONTIPAGOS_CLIENT_SECRET=
PRONTIPAGOS_TIMEOUT_SECONDS=
PRONTIPAGOS_WEBHOOK_SECRET=
PRONTIPAGOS_ENABLE_SANDBOX_MOCK=true
```

`.env.example` may document placeholders only. Staging and production secrets belong in secret management, not the repo.

## Authentication / Security

- Confirm provider authentication mechanism before implementation.
- Bound timeouts and retries; never retry ambiguous execution blindly.
- Redact logs and sanitize provider errors before user exposure.
- Hash or redact request/response payloads by default.
- Do not log provider secrets, tokens, credentials, or sensitive service data unnecessarily.
- Verify webhook signatures and replay protections if Prontipagos supports webhooks.
- Restrict reconciliation/admin workflows by least privilege.

## Reconciliation Strategy

| Scenario | Required Handling |
|---|---|
| card charge success + Prontipagos success | match payment, provider transaction, ledger intent, receipt |
| card charge success + Prontipagos pending | keep receipt pending and monitor/status check |
| card charge success + Prontipagos failed | recovery/manual review for customer and finance |
| card charge success + Prontipagos timeout | provider status check before any new execution |
| card charge failed + Prontipagos not called | expected invariant |
| Prontipagos success + card charge missing | SEV-1 impossible-state investigation |
| duplicate provider reference | duplicate review and idempotency evidence |
| amount mismatch | reconciliation mismatch and hold support claim |
| receipt missing | receipt recovery after confirmed provider evidence |
| provider success + internal pending | status repair/manual review |
| internal success + provider missing | mismatch investigation |

Future daily reconciliation should compare internal attempts against status queries or provider reports, create manual review records, and depend on an admin/support console before production.

## Operational Runbooks

Future runbooks:

- Prontipagos timeout.
- Prontipagos unavailable.
- Invalid reference.
- Amount mismatch.
- Provider says paid but app pending.
- App says paid but provider missing.
- Receipt unavailable.
- Duplicate payment attempt.
- Reconciliation mismatch.

## Testing Strategy

Future sandbox tests:

- Catalog sync success/failure.
- Reference validation success/failure.
- Amount lookup success/failure.
- Service payment execution success.
- Provider pending.
- Provider timeout.
- Provider rejected.
- Duplicate idempotency.
- No provider call if card charge failed.
- Provider call only after card charge success.
- Audit events.
- Reconciliation mismatch.
- Redaction/no secrets.

## Production Gates

- Contract and API docs from Prontipagos confirmed.
- Sandbox credentials stored securely.
- Adapter, mocks, and status/error mapping implemented.
- Idempotency, audit, reconciliation, and manual review implemented.
- Card processor prerequisite works end to end.
- End-to-end sandbox tests pass.
- Security review completed.
- Recovery UX and support runbooks ready.
- No secrets committed.

