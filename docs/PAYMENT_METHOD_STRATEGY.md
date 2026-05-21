# Card Payment Method Strategy

Updated: 2026-05-20

## Executive Summary

FondixPay is card-only for user-facing service payments. A user pays FondixPay with a debit or credit card. FondixPay then executes the service-payment leg through Prontipagos as the service payment aggregator. Prontipagos must not be assumed to be the user-facing card processor unless an explicit future contract and API mapping confirm that role.

The current implementation remains mock/dev. No real card capture, card processor, tokenization, provider vault, or real service-payment execution is enabled.

## Current Decision

- Supported user-facing payment method in the current roadmap: debit or credit card.
- Supported mock/dev method: card demo.
- Card processor: future provider, not selected.
- Service-payment aggregator: Prontipagos, future integration.
- Out of roadmap as user-facing payment methods: SPEI, CoDi, OXXO/store payment, cash-in, cash, bank transfer, wallet balance, and stored-value balance.

## Separation Of Concerns

| Leg | Responsibility |
|---|---|
| User -> FondixPay | Debit or credit card payment experience. |
| FondixPay -> card processor | Future tokenization, authorization, fraud controls, card settlement, processor recovery. |
| FondixPay -> Prontipagos | Service payment execution to billers/providers after the internal flow allows it. |

## Current Gap

FondixPay already removed the phantom-card assumption from the mock flow, but real card payment is still not implemented:

- no approved card processor,
- no tokenization or provider vault,
- no real add/select/remove card contract,
- no card authorization/3DS mapping,
- no chargeback and fraud strategy,
- no PCI/security review for real card flow.

## In Scope

- Debit card.
- Credit card.
- Card demo/mock for development and internal validation.
- Future tokenized card references.
- Future approved card processor.
- Card-specific recovery states.

## Out Of Scope

- SPEI.
- CoDi.
- OXXO/store payments.
- Cash-in and cash payments.
- Bank transfer.
- Wallet balance or stored-value balance as payment method.
- Prontipagos as an assumed card processor.

## Card UX Requirements

- Start with no card when no explicit card demo exists.
- Add card flow must be provider-backed in real implementation.
- Select and change selected card before confirmation.
- Show safe card label and last four digits only.
- Remove card in a future token detach/delete flow.
- Handle expired card.
- Handle declined card.
- Handle invalid CVV without storing CVV.
- Handle processor timeout.
- Handle 3DS/auth challenge in a future card provider phase.
- Confirmation must show selected card, service amount, fee, total, and change-card action.

Mock/dev copy must say:

- `Tarjeta demo`
- `No se realizará ningún cargo real`
- `No ingreses datos reales de tarjeta`

## Security

- PAN must never be stored by FondixPay.
- CVV must never be stored by FondixPay.
- Future card payments require processor tokenization.
- Future card payments require provider vault or equivalent approved token custody.
- Logs and support tools must not include full card number or CVV.
- Mobile Secure Store must not persist PAN or CVV.
- PCI scope and processor security controls must be reviewed before real card payments.

## Provider Selection

The card processor is not selected yet. Provider selection must cover:

- tokenization and vault model,
- authorization and failure codes,
- 3DS/auth challenge support when required,
- fraud and chargeback support,
- idempotency and webhook/status model,
- sandbox and test strategy,
- costs and operational support.

Prontipagos remains the service payment aggregator. The card processor decision is separate.

## Audit Events

- `payment_method.card_add_started`
- `payment_method.card_tokenized`
- `payment_method.card_add_failed`
- `payment_method.card_selected`
- `payment_method.card_changed`
- `payment_method.card_removed`
- `payment_method.card_declined`
- `payment_method.card_auth_failed`
- `payment_method.card_expired`
- `payment_method.card_mock_selected`

## Data Model Proposal

### `payment_methods`

- `id`
- `user_id`
- `type = card`
- `card_brand`
- `last4`
- `exp_month`
- `exp_year`
- `provider_name`
- `provider_token_reference`
- `display_label`
- `status`
- `is_default`
- `is_mock`
- `created_at`
- `updated_at`
- `deleted_at`

### `payment_method_events`

- safe event metadata only,
- no PAN,
- no CVV,
- request/correlation identifiers for support and audit.

## Future API Proposal

- `GET /payment-methods`
- `POST /payment-methods/card-token`
- `PATCH /payment-methods/{id}/default`
- `DELETE /payment-methods/{id}`
- `GET /payment-methods/{id}`

`POST /payment-methods/card-token` depends on the future approved card processor. It accepts tokenization references or processor-approved handoff data, never raw card storage payloads for FondixPay persistence.

## Production Gates

- Card processor selected.
- Tokenization implemented.
- Provider vault and detach/delete behavior designed.
- No PAN/CVV storage verified.
- PCI/security review complete.
- Fraud and chargeback strategy defined.
- Idempotency implemented.
- Audit logs implemented.
- Recovery paths implemented.
- Fee transparency preserved.
- Tests cover auth, ownership, card failure paths, and retry safety.
