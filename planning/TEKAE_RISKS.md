# Tekae Integration — Risk Register

**Status:** ACTIVE
**Last updated:** 2026-06-02

---

## Risk Format

Each risk is rated by **Likelihood** (L/M/H) and **Impact** (L/M/H).
**Priority** = combined severity. Risks marked **BLOCKING** halt implementation until mitigated.

---

## Active Risks

### RISK-T001 — No Official Tekae Documentation Available
| Field | Value |
|---|---|
| Likelihood | H |
| Impact | H |
| Priority | CRITICAL — BLOCKING |
| Status | Open |

**Description:** FONDIXPAY does not yet have official Tekae API documentation. All integration assumptions are unconfirmed.

**Consequence:** Building against incorrect assumptions causes rework, security gaps, and incorrect PCI scope decisions.

**Mitigation:** Implementation is fully blocked until documentation is received. Assigned: integration lead to obtain docs before sprint 008b-tekae closes.

---

### RISK-T002 — Integration Architecture Mismatch
| Field | Value |
|---|---|
| Likelihood | M |
| Impact | H |
| Priority | HIGH — BLOCKING |
| Status | Open |

**Description:** FONDIXPAY assumes `Mobile App → Tekae`. If Tekae requires a different integration pattern (backend-proxied, redirect, WebView), mobile and backend architecture must change.

**Consequence:** Potential full rework of the payment flow, PCI scope change, credential model change.

**Mitigation:** Do not finalize any architecture until Q-001 is resolved. See `planning/TEKAE_OPEN_QUESTIONS.md`.

---

### RISK-T003 — No Sandbox Environment
| Field | Value |
|---|---|
| Likelihood | M |
| Impact | H |
| Priority | HIGH |
| Status | Open |

**Description:** Tekae may not provide a sandbox or test environment, forcing development against production.

**Consequence:** No safe development environment. Integration testing blocked. Sprint timeline impact.

**Mitigation:** Confirm sandbox availability early (Q-003). If unavailable, define a mock adapter strategy before proceeding. Do not use production credentials in development.

---

### RISK-T004 — PCI Scope Expansion
| Field | Value |
|---|---|
| Likelihood | M |
| Impact | H |
| Priority | HIGH |
| Status | Open |

**Description:** If Tekae does not offer client-side tokenization and requires card data to pass through FONDIXPAY backend, FONDIXPAY becomes PCI in-scope at a level requiring significant compliance work.

**Consequence:** Compliance cost, timeline impact, architectural redesign.

**Mitigation:** Confirm PCI model early (Q-007). Prefer an integration model that eliminates card data from FONDIXPAY systems. Do not store card data under any circumstances.

---

### RISK-T005 — Tekae Commercial Agreement Not Signed
| Field | Value |
|---|---|
| Likelihood | M |
| Impact | H |
| Priority | HIGH — BLOCKING |
| Status | Open |

**Description:** If FONDIXPAY does not have a signed commercial agreement with Tekae, production credentials and API access cannot be obtained.

**Consequence:** All integration work is theoretical until the agreement is in place.

**Mitigation:** Confirm agreement status (Q-013) before committing engineering resources to implementation.

---

### RISK-T006 — Duplicate or Lost Payments Without Idempotency
| Field | Value |
|---|---|
| Likelihood | L |
| Impact | H |
| Priority | MEDIUM |
| Status | Open (pending Q-012) |

**Description:** If Tekae does not support idempotency keys, network retries on mobile or backend may result in duplicate charges.

**Consequence:** User overcharged, dispute volume, reputational risk.

**Mitigation:** Confirm idempotency support (Q-012). Design retry logic only after confirmation. If not supported, implement deduplication at FONDIXPAY layer with explicit engineering approval.

---

### RISK-T007 — Webhook Spoofing
| Field | Value |
|---|---|
| Likelihood | L |
| Impact | H |
| Priority | MEDIUM |
| Status | Open (pending Q-006) |

**Description:** If FONDIXPAY does not verify Tekae webhook signatures, malicious actors could send fake payment success callbacks.

**Consequence:** Fraudulent payment confirmations, financial loss.

**Mitigation:** Implement webhook signature verification before any callback endpoint goes live. Do not process Tekae webhooks without confirmed signature verification (see `docs/integrations/TEKAE_SECURITY.md`).

---

### RISK-T008 — Prontipagos Code Confusion
| Field | Value |
|---|---|
| Likelihood | M |
| Impact | M |
| Priority | MEDIUM |
| Status | Open |

**Description:** The existing Prontipagos adapter (`backend/app/modules/providers/prontipagos/`) is still in the codebase. Developers unfamiliar with the provider switch may reference or extend it for Tekae work.

**Consequence:** Wrong provider used in production, incorrect error mapping, wasted work.

**Mitigation:** Add a `SUPERSEDED` notice to the Prontipagos adapter files (documentation only, no code removal). Ensure sprint handoffs clearly communicate the provider change.

---

### RISK-T009 — FONDIXPAY Scope Creep into Payment Processing
| Field | Value |
|---|---|
| Likelihood | M |
| Impact | H |
| Priority | HIGH |
| Status | Monitored |

**Description:** Under pressure to deliver MVP features quickly, FONDIXPAY may build payment logic that belongs in Tekae (ledger, balance, processing).

**Consequence:** Technical debt, regulatory exposure, integration complexity.

**Mitigation:** DEC-T003 explicitly prohibits this. Any sprint requesting payment processor features requires explicit product leadership approval before engineering begins.

---

### RISK-T010 — Production Readiness Not Documented
| Field | Value |
|---|---|
| Likelihood | H |
| Impact | M |
| Priority | HIGH |
| Status | Mitigated this sprint |

**Description:** Without a formal production readiness checklist, release gates, rollback procedures, and environment strategy, FONDIXPAY could be deployed prematurely or without verifiable evidence that critical safety conditions are met.

**Consequence:** Production deployment with incomplete security, auth, or provider integration. Financial and reputational risk.

**Mitigation (applied):** Created `docs/PRODUCTION_READINESS.md`, `docs/ENVIRONMENTS.md`, `docs/RELEASE_CHECKLIST.md`, `docs/ROLLBACK.md`, `docs/OBSERVABILITY.md`, and `docs/SUPPORT_RUNBOOK.md` in sprint 8B.1. All production gates are now tracked and signed-off.

---

## Resolved Risks

> *(None yet.)*
