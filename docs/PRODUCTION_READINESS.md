# Production Readiness

**Status:** NOT READY — Local/dev only. See checklist below for all gates.
**Last updated:** 2026-06-02

---

## Purpose

This document is the single source of truth for what must be true before FONDIXPAY accepts real money from real users. It is not aspirational — each item is a hard gate.

No item may be marked complete without evidence.

---

## Gate 1 — Authentication & Session

| Item | Status | Evidence Required |
|---|---|---|
| Real SMS/OTP provider integrated | NOT DONE | Provider confirmed, test receipts |
| `OTP_DEV_RESPONSE_ENABLED=false` in staging/prod | NOT DONE | Env config review |
| JWT secret is strong and rotated | NOT DONE | Secret manager record |
| Session expiration enforced | NOT DONE | Code review + test |
| Session revocation on logout | NOT DONE | Code review + test |
| Token refresh strategy defined | NOT DONE | Doc + implementation |

---

## Gate 2 — Authorization

| Item | Status | Evidence Required |
|---|---|---|
| RBAC enforced on all private endpoints | NOT DONE | Backend auth test suite |
| Ownership checks on all user data endpoints | NOT DONE | Code review |
| Admin endpoints require ADMIN role | NOT DONE | Role test coverage |
| SUPPORT role cannot access raw provider data | NOT DONE | Role test coverage |

---

## Gate 3 — Payment Provider Integration

| Item | Status | Evidence Required |
|---|---|---|
| Tekae commercial agreement signed | BLOCKED | Contract signed |
| Official Tekae docs reviewed | BLOCKED | Q-001 to Q-014 resolved |
| Tekae sandbox tested | BLOCKED | Sandbox test report |
| Tekae production credentials in secret manager | BLOCKED | AWS Secrets Manager entry |
| TEKAE_ENABLED=true approved by product + security | BLOCKED | Approval record |
| Payment idempotency confirmed | BLOCKED | Q-012 resolved |
| Webhook signature verification implemented | BLOCKED | Q-006 resolved + code review |
| No card data in FONDIXPAY systems | BLOCKED | PCI scope confirmed (Q-007) |
| Mock payment scenario removed or gated | NOT DONE | Feature flag review |

---

## Gate 4 — Security

| Item | Status | Evidence Required |
|---|---|---|
| No secrets in git history | NOT DONE | `git log` secret scan |
| CORS restricted per environment | NOT DONE | Env config review |
| Rate limiting on OTP endpoint | NOT DONE | Backend implementation |
| Rate limiting on payment endpoint | NOT DONE | Backend implementation |
| Security headers at edge | NOT DONE | Deployment review |
| Input validation on all write endpoints | NOT DONE | Code review |
| User-facing errors sanitized (no stack traces) | NOT DONE | Test suite |
| Expo SecureStore used for session tokens | NOT DONE | Mobile code review |

---

## Gate 5 — Observability

| Item | Status | Evidence Required |
|---|---|---|
| Structured app event logging defined | NOT DONE | See `docs/OBSERVABILITY.md` |
| Payment event audit trail | NOT DONE | Audit log implementation |
| Error categories defined and mapped | NOT DONE | See `docs/OBSERVABILITY.md` |
| Support event contract defined | NOT DONE | See `docs/OBSERVABILITY.md` |
| Alert on payment provider failure | BLOCKED | Depends on Tekae integration |

---

## Gate 6 — Compliance

| Item | Status | Evidence Required |
|---|---|---|
| PCI scope confirmed with Tekae | BLOCKED | Q-007 resolved |
| Privacy policy published | NOT DONE | Legal review |
| Terms of service published | NOT DONE | Legal review |
| Data retention policy defined | NOT DONE | Policy doc |
| No unnecessary PII stored | NOT DONE | Data model review |

---

## Gate 7 — Operations

| Item | Status | Evidence Required |
|---|---|---|
| Environment strategy documented | DONE | `docs/ENVIRONMENTS.md` |
| Release checklist exists | DONE | `docs/RELEASE_CHECKLIST.md` |
| Rollback procedure documented | DONE | `docs/ROLLBACK.md` |
| Support runbook exists | DONE | `docs/SUPPORT_RUNBOOK.md` |
| Tekae runbook populated | BLOCKED | `docs/integrations/TEKAE_RUNBOOK.md` |
| On-call rotation defined | NOT DONE | Ops decision |
| Incident severity levels defined | NOT DONE | Ops decision |

---

## Gate 8 — QA

| Item | Status | Evidence Required |
|---|---|---|
| Backend test coverage ≥ threshold | NOT DONE | CI report |
| Mobile TypeScript compiles with 0 errors | DONE | `npx tsc --noEmit` |
| Payment flow E2E test in staging | BLOCKED | Staging env required |
| Rollback tested in staging | BLOCKED | Staging env required |
| Feature flags verified off by default | DONE | constants.ts + .env.example |

---

## Summary

**Total gates:** 8
**Blocking on Tekae documentation:** Gates 3, 5 (partial), 6 (partial), 7 (partial), 8 (partial)
**Blocking on engineering work:** Gates 1, 2, 4, 5, 8
**DONE:** Gate 7 (partial — docs created this sprint)

Production deployment requires ALL gates to pass. No exceptions.

---

## Related Documents

- `docs/ENVIRONMENTS.md` — environment strategy
- `docs/RELEASE_CHECKLIST.md` — release gate checklist
- `docs/ROLLBACK.md` — rollback procedures
- `docs/OBSERVABILITY.md` — observability contract
- `docs/SUPPORT_RUNBOOK.md` — support runbook
- `docs/SECURITY.md` — security rules
- `docs/AUDIT.md` — audit event contract
- `docs/integrations/TEKAE.md` — Tekae provider overview
- `planning/TEKAE_OPEN_QUESTIONS.md` — 14 blocking questions
- `planning/TEKAE_RISKS.md` — risk register
