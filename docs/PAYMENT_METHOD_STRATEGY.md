# Payment Method Strategy

Updated: 2026-05-20

## Executive Summary

FondixPay cannot advance to real payments while the app implies that a card already exists without a real add/select/validate/manage flow. A payment method is part of user consent, security, auditability, and support. Until a provider and tokenization strategy are approved, the app may only use an explicitly labeled mock/dev method for internal validation without real money.

## Current Gap

Current UI locations:

- `mobile/src/screens/services/ServiceDetailScreen.tsx` showed a selected demo card and a "Nueva tarjeta" row.
- `mobile/src/components/PaymentSummaryCard.tsx` defaulted to `Tarjeta demo **** 9021`.

What was missing:

- No add payment method flow.
- No select/change method flow.
- No tokenization.
- No provider vault.
- No validation state.
- No fallback for non-banked users.
- No audit events or backend model for payment methods.

Risks:

- UX: users may believe a real card is stored or selected.
- Security: card capture without tokenization would create PCI and data exposure risk.
- Operations: support cannot verify method status safely.
- Compliance: storing PAN/CVV or implying card controls without implementation is unacceptable.

## User Segment Considerations

FondixPay targets Mexican users paying domestic services. The product should expect:

- Users aged 30-65 who may prefer clear, low-risk payment instructions.
- Partially banked or non-banked users.
- Anxiety around entering cards into new apps.
- Familiarity with SPEI, cash/store payments, and service-payment references.
- Need for clear confirmation and proof after payment.

The MVP should avoid forcing card entry as the only path.

## Payment Method Options

### Card Tokenization

Pros:

- Familiar for banked users.
- Fast confirmation when provider supports it.
- Good mobile UX if tokenized provider SDK/hosted fields are mature.

Cons:

- PCI scope if handled incorrectly.
- User trust barrier.
- Requires provider decision and tokenization.

Risks:

- Never store PAN/CVV.
- Provider vault required.
- Must support failure and card removal states.

Recommendation:

- Future option only after provider selection and security review.

### SPEI

Pros:

- Common in Mexico.
- Avoids card storage.
- Can serve users without credit card.

Cons:

- Confirmation timing can be asynchronous.
- Requires reconciliation and clear pending state.
- UX must explain reference/CLABE and whether the payment is confirmed.

Recommendation:

- Strong candidate for future real-money MVP if provider capability and reconciliation are defined.

### CoDi

Pros:

- Bank-backed push payment model.
- Avoids card storage.

Cons:

- Adoption and user familiarity may be lower.
- Requires exact UX guidance and provider/bank capability.

Recommendation:

- Evaluate later, not primary MVP assumption.

### OXXO / Cash-In / Store Payment

Pros:

- Strong fit for non-banked users.
- Familiar in Mexico for service payments.
- Avoids card capture.

Cons:

- Confirmation can be delayed.
- Operational reconciliation is required.
- User must leave the app.

Recommendation:

- Strong candidate for non-banked segment, especially as fallback or second supported method.

### Wallet / Stored Balance

Pros:

- Faster repeat payments.

Cons:

- Higher regulatory/compliance burden.
- KYC/AML implications.
- Balance ledger, cash-in/cash-out, and custody concerns.

Recommendation:

- Out of scope for current MVP.

### Mock Payment Method

Use:

- Development.
- Internal validation.
- Closed beta without real money.

Label:

- "Método demo - pago simulado sin cargo real".

Must not promise:

- Real charge.
- Provider confirmation.
- Tokenization.
- PCI compliance.

## MVP Recommendation

- Internal/dev MVP: explicit mock payment method only.
- Closed beta without money: mock method with disclosure.
- Future real-money beta: choose between SPEI/OXXO-like flow or tokenized card provider based on provider evaluation, target-user validation, and compliance review.
- Card tokenization should not be the default until provider, vault, UX, security, and legal/compliance decisions are approved.

## UX Flow

1. No payment method: show empty state and "Agregar método de pago".
2. Add payment method: explain method type and what data is handled.
3. Select payment method: show safe display label only.
4. Confirm payment method: show selected method, fee, total, and change action.
5. Payment method unavailable: block real payment and show alternative method/retry.
6. Change method before paying: available from confirmation.
7. Remove method: soft delete or detach token in provider vault.
8. Mock method in dev: clearly labeled as no real charge.

## Security Rules

- Do not store full PAN.
- Do not store CVV.
- Tokenization is mandatory for future cards.
- Use provider vault for card data.
- Mobile Secure Store must not store card numbers or CVV.
- Logs must redact payment method payloads.
- Audit events must record safe display labels and method IDs, never sensitive card data.
- Deletion should be soft delete internally plus provider detach/delete when supported.

## Audit Events

- `payment_method.add_started`
- `payment_method.add_completed`
- `payment_method.add_failed`
- `payment_method.selected`
- `payment_method.changed`
- `payment_method.removed`
- `payment_method.validation_failed`
- `payment_method.mock_selected`

## Data Model Proposal

### `payment_methods`

- `id`
- `user_id`
- `type`
- `provider_name`
- `provider_token_reference`
- `display_label`
- `last4` nullable
- `brand` nullable
- `status`
- `is_default`
- `is_mock`
- `created_at`
- `updated_at`
- `deleted_at`

### `payment_method_events`

- `id`
- `payment_method_id`
- `user_id`
- `event_type`
- `result`
- `metadata_json`
- `request_id`
- `correlation_id`
- `created_at`

### `user_payment_preferences`

- `id`
- `user_id`
- `default_payment_method_id`
- `created_at`
- `updated_at`

## API Proposal

### GET `/payment-methods`

- Purpose: list user's safe payment methods.
- Auth required: yes.
- Role: `USER`.
- Response: method IDs, type, display label, status, default flag, mock flag.
- Audit events: optional `payment_method.list_viewed`.
- Security: no PAN/CVV.

### POST `/payment-methods`

- Purpose: start or complete adding a real tokenized method in future.
- Auth required: yes.
- Role: `USER`.
- Request: method type and provider token/reference, never raw PAN/CVV.
- Audit events: `payment_method.add_started`, `payment_method.add_completed`, `payment_method.add_failed`.
- Security: provider tokenization required.

### POST `/payment-methods/mock`

- Purpose: create/select dev-only mock method.
- Auth required: yes.
- Role: `USER`.
- Request: optional label.
- Audit events: `payment_method.mock_selected`.
- Security: only development/internal validation.

### PATCH `/payment-methods/{id}/default`

- Purpose: set default payment method.
- Auth required: yes.
- Role: `USER`.
- Audit events: `payment_method.selected` or `payment_method.changed`.
- Security: ownership check required.

### DELETE `/payment-methods/{id}`

- Purpose: soft delete/detach payment method.
- Auth required: yes.
- Role: `USER`.
- Audit events: `payment_method.removed`.
- Security: provider detach/delete if real token exists.

### GET `/payment-methods/{id}`

- Purpose: retrieve safe method detail.
- Auth required: yes.
- Role: `USER`.
- Security: ownership check and safe fields only.

### POST `/payment-methods/{id}/validate`

- Purpose: validate method availability before payment.
- Auth required: yes.
- Role: `USER`.
- Audit events: `payment_method.validation_failed` when invalid.
- Security: never expose provider secrets.

## Production Gates

- Provider defined.
- Tokenization strategy defined.
- Legal/compliance review complete.
- Security review complete.
- UX add/select/change flow implemented.
- Tests implemented.
- Audit logs implemented.
- No secrets in repo.
- No raw card data.
- User can change method before paying.
- Error/recovery path exists.
