# Tekae Integration Overview

**Status:** PENDING — Implementation blocked until official Tekae documentation is reviewed.
**Provider:** Tekae Business
**Supersedes:** Prontipagos (see `docs/PRONTIPAGOS_SANDBOX_INTEGRATION_DESIGN.md` — historical, preserved)
**Last updated:** 2026-06-02

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

## Assumed Integration Flow

```
Mobile App → Tekae Business
```

This assumption is **unconfirmed** and remains pending until official Tekae documentation is reviewed.

---

## Known vs Unknown

| Item | Status |
|---|---|
| Provider name | Tekae Business |
| Provider role | Primary transactional layer (MVP) |
| Integration method | UNKNOWN — pending Tekae documentation |
| API base URL | UNKNOWN |
| Authentication method | UNKNOWN |
| Sandbox availability | UNKNOWN |
| Webhook support | UNKNOWN |
| Error / status codes | UNKNOWN |
| PCI scope / card handling | UNKNOWN |
| Settlement model | UNKNOWN |
| Supported payment methods | UNKNOWN |

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
