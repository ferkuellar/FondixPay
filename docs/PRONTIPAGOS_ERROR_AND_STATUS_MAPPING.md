# Prontipagos Error And Status Mapping

Phase 8B uses placeholders until Prontipagos contract/API documentation confirms real statuses and error codes.

## Provider Status Mapping

| Prontipagos Status | Internal Status | User Status | Receipt Status | Retry | Support |
|---|---|---|---|---|---|
| `TO_CONFIRM_ACCEPTED` | `provider_accepted` | Procesando pago | pending | status check | if delayed |
| `TO_CONFIRM_PENDING` | `provider_pending` | Pendiente de confirmacion | pending | no blind retry | yes if SLA exceeded |
| `TO_CONFIRM_CONFIRMED` | `provider_confirmed` | Pago confirmado | provider_confirmed | no | only if receipt issue |
| `TO_CONFIRM_REJECTED` | `provider_rejected` | Pago no completado | unavailable | only safe retry | maybe |
| `TO_CONFIRM_TIMEOUT` | `provider_timeout` | Pendiente de revision | pending | status check first | yes |
| `TO_CONFIRM_UNKNOWN` | `provider_unknown` | Pendiente de revision | pending | no blind retry | yes |
| `TO_CONFIRM_DUPLICATE` | `provider_duplicate_blocked` | Pago en revision | pending | no new execution | yes |

## Provider Error Mapping

| Error Code | Meaning | Internal Status | User Message | Retry Allowed | Audit Event | Severity |
|---|---|---|---|---|---|---|
| `TO_CONFIRM_INVALID_REFERENCE` | Reference rejected or invalid | `provider_rejected` | Revisa la referencia del servicio. | after edit | `prontipagos.reference_validation_failed` | MEDIUM |
| `TO_CONFIRM_TIMEOUT` | No final provider response | `provider_timeout` | Estamos verificando el estado del pago. | status check only | `prontipagos.payment_execution_timeout` | HIGH |
| `TO_CONFIRM_DUPLICATE` | Duplicate provider transaction signal | `provider_duplicate_blocked` | Ya existe un intento para este pago. | no | `prontipagos.duplicate_blocked` | HIGH |
| `TO_CONFIRM_PROVIDER_UNAVAILABLE` | Provider outage or unavailable service | `provider_failed` | No pudimos conectar con el proveedor. | bounded | `prontipagos.payment_execution_failed` | HIGH |
| `TO_CONFIRM_AMOUNT_MISMATCH` | Provider amount differs from internal quote | `provider_failed` | El monto cambio. Confirma de nuevo antes de pagar. | after refresh | `prontipagos.amount_lookup_failed` | HIGH |
| `TO_CONFIRM_AUTH_FAILED` | Provider authentication/config failure | `provider_failed` | El pago no esta disponible por ahora. | no | `prontipagos.payment_execution_failed` | CRITICAL |
| `TO_CONFIRM_UNKNOWN_ERROR` | Unmapped provider failure | `provider_unknown` | Estamos revisando el estado del pago. | no blind retry | `prontipagos.payment_execution_failed` | HIGH |

