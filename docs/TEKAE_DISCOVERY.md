# Tekae Discovery

Status: Sprint 010 documentation and architecture record.

This document captures the current Tekae discovery baseline for FONDIXPAY. It does not authorize production code, migrations, credentials, real payment execution, webhook endpoints, WebView implementation, or production deployment.

## Position

- FONDIXPAY is not a fintech.
- FONDIXPAY is not a bank, wallet, card processor, acquirer, SPEI processor, tokenization service, or banking core.
- Tekae is the approved provider for payment and service capabilities.
- FONDIXPAY embeds Tekae capabilities through an approved integration boundary.
- FONDIXPAY must not duplicate Tekae payment infrastructure.

## Current Tekae Model

The current Tekae documentation reviewed for Sprint 010 describes an SSO launch model into the Tekae Business responsive platform.

The intended architecture is:

```text
FONDIXPAY Mobile App -> FONDIXPAY Backend -> Tekae SSO URL -> Tekae Business
```

The backend is the only component allowed to generate Tekae SSO sessions. The mobile app must request a launch session from the backend and must never receive Tekae credentials such as `uid` or `password`.

Opening Tekae only proves that a provider experience was launched. It does not prove payment success.

## Backend Responsibility

The backend may:

- Authenticate the FONDIXPAY user before creating a Tekae session.
- Authorize access to a Tekae launch action.
- Generate or request a Tekae SSO token using backend-held credentials.
- Create an internal Tekae session reference before token generation.
- Return a minimum mobile launch payload.
- Record audit events and safe operational metadata.
- Redact Tekae tokens, credentials, full launch URLs, and private provider values from logs.

The backend must not:

- Store PAN, CVV, raw card data, card tokens, or raw payment credentials.
- Implement a card vault.
- Implement tokenization.
- Implement acquiring.
- Implement a wallet.
- Expose a ledger balance.
- Implement a SPEI processor.
- Implement a banking core.
- Treat Tekae launch as payment confirmation.

## Tekae SSO Parameters

Sprint 010 requirements identify these Tekae SSO parameters as documentation-derived inputs:

- `UserCustomer`
- `uid`
- `password`
- `redirect`
- `menu`
- `categoria`
- `carrier`
- `blockview`

These values must be handled as provider integration details. Credentials and sensitive values must remain backend-only and secret-managed.

## Token Expiration Behavior

Current Tekae documentation states that the Tekae SSO access token is valid for 20 minutes.

Sprint 010 records the following token rules:

- The Tekae SSO access token is unique per user/session.
- A new Tekae token must be requested each time the user enters Tekae.
- FONDIXPAY must not reuse expired Tekae tokens.
- FONDIXPAY must not assume payment success after token generation.
- FONDIXPAY must not assume payment success after URL launch.
- Mobile and support views must treat token generation and URL launch as session-handoff evidence only.

## Menu Mapping

Current documented menu mapping:

| FONDIXPAY intent | Tekae menu |
|---|---|
| Home | `null` |
| Tiempo Aire | `"1"` |
| Pago de Servicios | `"2"` |
| Entretenimiento | `"3"` |

This mapping is a Sprint 010 architecture contract until Tekae documentation or Tekae support changes it.

## Mobile Launch Payload

The mobile app should receive only:

- Internal session ID.
- Tekae launch URL.
- Expiration timestamp.
- Launch mode.

The mobile app must not receive Tekae credentials, secret keys, raw provider configuration, or internal reconciliation details.

## Open Provider Gaps

The following remain blockers to implementation beyond discovery:

- Tekae sandbox URL.
- Tekae Swagger or official API documentation.
- Tekae test credentials.
- Tekae webhook specification.
- Tekae transaction query API.
- Tekae reconciliation or settlement report format.
- Production VPN/VPC details.
- Sandbox Swagger and credentials.
- Confirmed error/status taxonomy.
- Signature, replay protection, and idempotency requirements for callbacks or webhooks.
- Provider transaction/reference fields.
- Receipt or comprobante retrieval rules.

## Documentation Debt

Historical Prontipagos and card-processor references still exist in older planning and design documents. Sprint 010 preserves the durable decision that Prontipagos is permanently removed, but it does not clean every historical reference unless directly touched by Tekae Discovery.

A future documentation cleanup sprint should remove or clearly archive stale Prontipagos/card-processor assumptions across old sprint records, backlogs, and historical sections.

## Sprint 010 Output Boundary

Sprint 010 may update architecture, API, data model, security, reconciliation, transaction state, planning, risks, and questions documentation.

Sprint 010 must not change application runtime behavior.
