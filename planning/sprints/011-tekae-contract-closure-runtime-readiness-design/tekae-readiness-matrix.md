# Sprint 011 - Tekae Readiness Matrix

## Scope

This matrix records what the current official Tekae documents prove, what remains unresolved, and whether FONDIXPAY can start Tekae runtime implementation.

Decision: Tekae runtime implementation remains blocked until official contract readiness passes.

This document does not authorize code, migrations, credentials, backend runtime changes, mobile runtime changes, webhook endpoints, or payment execution.

## Sources Reviewed

- `Brochure benefits 2.0.pdf`
- `Catalogo Productos_tekae2026.xlsx`
- `Guia de personalizacion tekae business.pdf`
- `Manual integracion tekae business V3_1.pdf`

## Core Findings

The provided Tekae material confirms an SSO launch model into Tekae's responsive platform. FONDIXPAY backend must act as a secure Tekae session broker, and the mobile app may only launch the Tekae URL after receiving it from the backend.

The provided material does not yet provide enough official evidence to implement runtime payment handling, transaction state synchronization, reconciliation, webhook processing, or production connectivity.

FONDIXPAY is not a fintech and must not implement card vaults, wallets, ledger balances, tokenization, acquiring, SPEI processing, or banking core behavior.

## Readiness Matrix

| Area | Status | Official evidence found | Still missing | Decision |
| --- | --- | --- | --- | --- |
| Approved provider | Confirmed | Sprint decisions identify Tekae as the approved provider. | None for provider selection. | Use Tekae as the payment capability provider only. |
| Integration model | Confirmed | Tekae manual describes launching Tekae responsive platform through a generated URL containing UID and access token. | None for SSO launch design. | Current confirmed model is SSO launch only. |
| Backend token broker | Confirmed | Tekae manual requires token generation from backend and warns that frontend must not expose token-forming credentials. | Concrete backend implementation contract remains blocked until sandbox/API access is received. | Backend may be designed as secure session broker only. |
| Mobile responsibility | Confirmed | Tekae manual supports browser redirect, iframe, or embedded web launch of the responsive URL. | Mobile implementation details remain blocked until runtime sprint is approved. | Mobile must launch Tekae URL only and must not generate tokens. |
| Tekae token lifetime | Confirmed | Tekae manual states token access is active for 20 minutes. | No retry/refresh contract for expired sessions beyond requesting a new token. | A new token must be requested each time the user enters Tekae. |
| Token uniqueness | Confirmed | Tekae manual states each token is unique per user. | No session replay or revocation details. | Do not reuse Tekae tokens across sessions. |
| Payment success assumption | Confirmed as prohibited by architecture | Tekae token generation only grants access to Tekae responsive platform. | No official success callback, status query, or webhook evidence. | FONDIXPAY must not assume payment success after token generation or URL launch. |
| Sandbox URL | Blocked | Tekae manual says Tekae will provide development environment URL. | Actual sandbox URL is not present in provided documents. | Runtime implementation blocked. |
| Swagger / API docs | Blocked | Tekae manual says Tekae will provide test Swagger. | Actual Swagger/OpenAPI document is not present. | Runtime implementation blocked. |
| Test credentials | Blocked | Tekae manual says Tekae will provide test credentials to authorized staff. | Actual credentials are not present and must not be committed. | Runtime implementation blocked. |
| Token API endpoints | Partial | Tekae manual describes `/tokens/cipherData` and `/tokens/generateTokenCiphered`. | Base URL, full schema, error taxonomy, auth model, rate limits, timeout/retry rules, and official Swagger are missing. | Design only; do not implement runtime calls yet. |
| Webhook model | Blocked | No webhook specification found in provided documents. | Need official webhook spec or official confirmation of no-webhook model. | Runtime implementation blocked. |
| Transaction status/query model | Blocked | No transaction query API found in provided documents. | Need endpoint, states, request/response schema, polling rules, and error states. | Runtime implementation blocked. |
| Reconciliation model | Blocked | No reconciliation mechanism found in provided documents. | Need settlement/reporting process, report format, timing, mismatch handling, and operational owner. | Runtime implementation blocked. |
| Production connectivity | Partial / Blocked | Tekae manual says VPN or VPC is required for production token generation. | Need topology, allowlist, DNS, ports, firewall rules, ownership, environments, and acceptance test process. | Production readiness blocked. |
| Provider transaction/reference fields | Blocked | Catalog contains product references, but not transaction reference mapping. | Need folio/reference/payment identifiers, idempotency key rules, and mapping to FONDIXPAY records. | Runtime implementation blocked. |
| Receipt/comprobante handling | Partial / Blocked | Personalization guide says the user can download a personalized HTML receipt after transaction completion in Tekae. | Need official retrieval rules, API availability, retention, evidence fields, and support workflow. | Do not build receipt retrieval until contract is confirmed. |
| Product catalog | Confirmed for catalog discovery only | Tekae catalog lists service, airtime, and entertainment products. | No runtime product API, pricing sync, availability SLA, or payment execution contract. | Use as reference only; not enough for runtime integration. |
| Support/escalation | Partial | Tekae manual lists support email contacts. | Need SLA, escalation path, incident severity, business hours, and production support owner. | Operational readiness incomplete. |
| Security requirements | Partial | Tekae manual confirms backend-only token generation, encrypted data step, JWT access token, 20-minute token window, and production VPN/VPC requirement. | Need secret rotation, IP allowlist details, logging/redaction policy, audit requirements, webhook security if applicable, and credential handling contract. | Security readiness incomplete. |

## Runtime Readiness Gates

| Gate | Status | Required evidence before implementation |
| --- | --- | --- |
| Sandbox/API access gate | Failed | Actual sandbox URL, official Swagger/OpenAPI, and test credentials delivered through approved secure channel. |
| Token contract gate | Partial | Full token API schema, base URL, auth method, error taxonomy, timeout/retry rules, rate limits, and expiry behavior confirmed. |
| Webhook/status gate | Failed | Official webhook specification or official no-webhook model plus transaction status query process. |
| Reconciliation gate | Failed | Official reconciliation process, report format, cadence, ownership, and mismatch handling. |
| Production connectivity gate | Failed | Official VPN/VPC or allowlist design, environment mapping, network owner, and connectivity acceptance test. |
| Reference/folio gate | Failed | Official provider transaction identifiers and mapping rules. |
| Receipt/comprobante gate | Partial | Official rules for receipt availability, retrieval, retention, and support evidence. |
| Security gate | Partial | Credential storage, rotation, redaction, audit, support visibility, and network security requirements. |
| Runtime implementation gate | Failed | All required gates above must pass before backend/mobile runtime work starts. |

## Work Allowed Now

- Keep architecture and planning documents updated.
- Prepare a Tekae contract closure checklist.
- Prepare secure credential-handling requirements without storing credentials.
- Prepare AWS/dev infrastructure foundations that do not run Tekae payment runtime.
- Review product catalog coverage as non-payable reference data only.
- Draft operational questions for Tekae.

## Work Not Allowed Yet

- No backend Tekae runtime endpoints.
- No mobile Tekae launch implementation.
- No webhook endpoints.
- No transaction status synchronization.
- No reconciliation jobs.
- No credential configuration.
- No payment execution.
- No assumption that token generation means payment success.

## Questions To Close With Tekae

1. Provide sandbox URL, official Swagger/OpenAPI, and test credentials through an approved secure channel.
2. Confirm whether Tekae provides webhooks. If not, provide official no-webhook model and status polling process.
3. Provide transaction status/query API, status taxonomy, request/response schema, and polling rules.
4. Provide reconciliation mechanism, report format, settlement timing, and mismatch handling.
5. Provide provider transaction ID, reference, folio, and idempotency mapping rules.
6. Confirm receipt/comprobante retrieval model: UI-only, API-based, or both.
7. Provide production VPN/VPC or allowlist requirements, including ports, DNS, IPs, and environment separation.
8. Provide rate limits, timeout rules, retry policy, and error taxonomy.
9. Provide security requirements for credential storage, token handling, log redaction, and audit.
10. Provide production support process, SLA, escalation path, and incident severity model.

## Conclusion

The official Tekae documents are enough to continue contract closure and runtime readiness design. They are not enough to start runtime implementation.

Sprint 011 should remain focused on closing Tekae contract evidence and preparing implementation gates. Runtime implementation must wait until Tekae provides the missing official contract material.
