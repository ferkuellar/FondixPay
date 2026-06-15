# Tekae Integration Overview

**Status:** PENDING — Runtime implementation blocked. SSO model confirmed from Manual v3.1; sandbox URL/credentials/Swagger still pending from Tekae.
**Provider:** Tekae Business
**Supersedes:** Prontipagos (see `docs/PRONTIPAGOS_SANDBOX_INTEGRATION_DESIGN.md` — historical, preserved)
**Last updated:** 2026-06-15 (updated with Sprint 011 readiness matrix findings from Manual de integración Tekae Business v3.1)

---

## Strategic Context

FONDIXPAY has changed its transactional provider from Prontipagos to Tekae Business.

Tekae Business will be the primary transactional provider during MVP.

FONDIXPAY's role in this architecture:
- Mobile app bridge
- UX layer
- Brand layer
- Support layer
- CRM / operations layer
- Minimal traceability layer

FONDIXPAY must **not** build a payment processor, wallet, bill payment aggregator, internal ledger, or complex reconciliation engine for MVP unless explicitly approved.

---

## Confirmed Integration Flow (Manual v3.1 — Sprint 011)

```
Mobile App → FondixPay Backend → Tekae /tokens/cipherData → Tekae /tokens/generateTokenCiphered
→ Backend builds URL → Mobile opens https://tekae.com.mx/responsive/user/{uid}/token/{accessToken}
```

The integration model is **SSO responsivo** (browser/WebView/embed). Mobile never calls Tekae directly.
Backend is the only component authorized to generate tokens and construct the launch URL.

---

## Known vs Unknown (updated 2026-06-15 from Manual de integración Tekae Business v3.1)

| Item | Status | Source |
|---|---|---|
| Provider name | **Confirmed**: Tekae Business | ADRs, Sprint 011 |
| Provider role | **Confirmed**: SSO launch into Tekae responsive platform (not a direct payment API) | Manual v3.1 |
| Integration method | **Confirmed**: Backend-brokered SSO. Backend calls `/tokens/cipherData` + `/tokens/generateTokenCiphered`, builds URL, returns only the URL to mobile. | Manual v3.1 §Token Generation |
| Token endpoint 1 | **Confirmed**: `POST /tokens/cipherData` | Manual v3.1 |
| Token endpoint 2 | **Confirmed**: `POST /tokens/generateTokenCiphered` | Manual v3.1 |
| Responsive URL format | **Confirmed**: `https://tekae.com.mx/responsive/user/{uid}/token/{accessToken}` | Manual v3.1 |
| Token lifetime | **Confirmed**: 20 minutes | Manual v3.1 |
| Token uniqueness | **Confirmed**: Unique per user/session; a new token must be requested each time | Manual v3.1 |
| Authentication method | **Confirmed**: uid + password (backend credentials). Exact header/scheme pending Swagger. | Manual v3.1 |
| Production network requirement | **Confirmed**: VPN or VPC required for token generation in production | Manual v3.1 |
| Optional launch params | **Confirmed**: `redirect`, `menu`, `categoria`, `carrier`, `blockview` | Manual v3.1 |
| Menu values | **Confirmed**: `null`=Home, `"1"`=Tiempo Aire, `"2"`=Pago de Servicios, `"3"`=Entretenimiento | Manual v3.1 |
| Mobile SDK | **Confirmed as not required**: Integration is URL-based, no native SDK needed | Manual v3.1 |
| API base URL (sandbox) | **PENDING** — Tekae will provide sandbox URL separately | Sprint 011 matrix |
| API base URL (production) | **PENDING** — Tekae will provide through approved secure channel | Sprint 011 matrix |
| Swagger / OpenAPI | **PENDING** — Tekae will provide test Swagger | Sprint 011 matrix |
| Test credentials | **PENDING** — Tekae will provide to authorized staff | Sprint 011 matrix |
| Webhook support | **UNKNOWN** — No webhook specification in provided documents | Sprint 011 matrix |
| Transaction status/query API | **UNKNOWN** — No status query API in provided documents | Sprint 011 matrix |
| Error / status codes | **UNKNOWN** — Full error taxonomy pending Swagger | Sprint 011 matrix |
| PCI scope / card handling | **N/A for SSO model** — Card handling is entirely within Tekae's platform | Manual v3.1 |
| Settlement / reconciliation model | **UNKNOWN** — No reconciliation mechanism in provided documents | Sprint 011 matrix |
| Receipt / comprobante | **Partial** — Tekae allows HTML receipt download within their platform; API retrieval pending | Personalization guide |

---

## Relationship to Prontipagos

Prontipagos is superseded as primary transactional provider. All historical Prontipagos artifacts are **preserved and must not be deleted**. They represent completed sprint work and serve as reference for integration patterns.

Key historical files:
- `docs/PRONTIPAGOS_SANDBOX_INTEGRATION_DESIGN.md`
- `docs/PRONTIPAGOS_ERROR_AND_STATUS_MAPPING.md`
- `planning/PRONTIPAGOS_BACKLOG.md`
- `planning/sprints/008b-prontipagos-sandbox-integration-design/`
- `backend/app/modules/providers/prontipagos/` (sandbox adapter — not for production use)

---

## Implementation Gate

**Implementation is blocked.** No production code may be written for Tekae until:

1. Official Tekae documentation has been reviewed and confirmed.
2. All open questions in `planning/TEKAE_OPEN_QUESTIONS.md` have been resolved.
3. Security review in `docs/integrations/TEKAE_SECURITY.md` has been approved.
4. Sprint `008b-tekae-integration-discovery` acceptance criteria are met.

---

## Feature Flag States

FONDIXPAY controls Tekae activation through two environment variables. These must progress in order — no skipping.

| State | `TEKAE_ENABLED` | `TEKAE_MODE` | Meaning |
|---|---|---|---|
| `disabled` | `false` | `disabled` | Default. No Tekae calls. Users see "Servicio en preparación." |
| `unavailable` | `false` | `unavailable` | Tekae known but not yet connectable (docs received, sandbox not ready). |
| `ready_for_sandbox` | `false` | `ready_for_sandbox` | Sandbox tested. Awaiting production approval. |
| `ready_for_production` | `true` | `ready_for_production` | Fully approved. Live payments active. |

**TEKAE_ENABLED must not be set to `true` without explicit product + security sign-off.**

The feature flag constants live in `mobile/src/integrations/tekae/constants.ts`.

---

## Mobile UX — Disabled State

While `TEKAE_ENABLED=false`, any screen that would offer a Tekae payment action must show:

> **"Servicio en preparación. Muy pronto podrás pagar desde FONDIXPAY."**

Rules:
- Do not reveal "Tekae" as a provider name to users without product approval.
- Do not show technical error codes or HTTP status codes.
- Do not show a broken payment button — replace with the informational message above.
- The support path must still be reachable from the payment failure screen.

---

## Mobile Provider-State Readiness

Sprint `008b4-mobile-provider-state-readiness` added mobile-only provider states and unavailable-state UX for the future Tekae era.

Implemented mobile states:
- `PROVIDER_DISABLED`
- `PROVIDER_UNAVAILABLE`
- `PROVIDER_PENDING`
- `PROVIDER_TIMEOUT`
- `PROVIDER_FAILED`
- `PROVIDER_SUCCEEDED`
- `PROVIDER_MANUAL_REVIEW`

Current rules:
- These states are local presentation states only.
- They do not map to Tekae status codes.
- They do not process provider payloads.
- They do not trigger provider HTTP calls.
- Demo payment methods are available only in development/internal mode.
- Outside development/internal mode, payment screens show provider-preparation messaging instead of payment actions.

Deep-link placeholder:

```text
fondixpay://provider/callback
```

This route opens a safe placeholder screen. It does not parse provider parameters, trust callback data, or update payment state. Callback handling remains blocked until official Tekae documentation defines the return URL, signed fields, webhook model, and transaction-state source of truth.

---

## Related Documents

- `docs/integrations/TEKAE_API_CONTRACT.md` — API contract placeholder (TBD)
- `docs/integrations/TEKAE_SECURITY.md` — Security requirements
- `docs/integrations/TEKAE_RUNBOOK.md` — Operational runbook placeholder (TBD)
- `docs/integrations/TEKAE_SUPPORT.md` — Support workflows placeholder (TBD)
- `planning/TEKAE_HARNESS.md` — Integration harness design
- `planning/TEKAE_DECISIONS.md` — Decision log
- `planning/TEKAE_OPEN_QUESTIONS.md` — Open questions register
- `planning/TEKAE_RISKS.md` — Risk register
- `planning/sprints/008b-tekae-integration-discovery/` — Discovery sprint
- `planning/sprints/008b4-mobile-provider-state-readiness/` — Mobile provider-state readiness sprint
