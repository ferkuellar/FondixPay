# Risks

Updated: 2026-05-20

| Risk | Impact | Current Mitigation | Next Action |
| --- | --- | --- | --- |
| Mock payment flow may be confused with real payment | High | README and docs mark mock/dev status | Keep visible disclaimers in app before any pilot |
| No formal financial ledger | High | Real payments are out of scope | Design ledger in Phase 7 before money movement |
| No audit logs for financial actions | High | Audit requirements documented | Implement audit foundation before real payments |
| No documented/implemented permission matrix | High | Preliminary roles documented | Implement RBAC in hardening phase |
| OTP auth is dev/mock | High | `OTP_DEV_CODE` marked development | Harden auth in Phase 4 |
| No payment provider selected | High | Provider integration blocked | Run provider selection in Phase 9 |
| KYC/AML strategy undefined | High | KYC out of scope | Decide whether product needs wallet or regulated flows |
| Automated tests missing | Medium | Validation strategy documented | Add tests in Phase 2 and Phase 13 |
| CI/CD missing | Medium | Deployment doc marks pending | Add pipelines in Phase 14 |
| Observability missing | Medium | Operations doc marks pending | Add logs, metrics, alerts |
| App Store / Play Store readiness missing | Medium | Roadmap includes Phase 15 | Define store checklist later |
| Regulatory risk if product becomes fintech wallet | High | Wallet not approved | Keep scope to service payments until legal review |
| Scope creep across wallet, KYC, admin, and real payments | High | AXON-AI sprint boundaries | Require decisions before expanding scope |
| Development OTP is returned in API response | High | Mock/dev status documented | Gate or remove `otp_dev` outside development |
| JWT secret has insecure default fallback | High | `.env.example` uses placeholder | Fail startup outside development without strong secret |
| Auth brute force risk | High | OTP TTL exists; no rate limit yet | Add rate limiting and lockout/backoff before pilot |
| Device/session theft risk | High | Token stored in Secure Store | Add session inventory, revocation, refresh rotation, and device trust |
| Lack of refresh/revocation | High | Access-token-only model documented | Design server-side token lifecycle after Phase 4A |
| Lack of auth audit logs | High | Audit contract documented | Implement auth audit events before production-like pilot |
| Lack of formal RBAC enforcement | High | Permissions doc exists | Implement backend RBAC before admin/support workflows |
| `Base.metadata.create_all` runs at startup | High | Alembic scaffold exists | Replace with migration discipline before production |
| No rate limiting on OTP or sensitive endpoints | High | Documented in security docs | Add rate limiting before any pilot |
| Mobile dependency audit reports high vulnerabilities | High | No forced breaking upgrade applied | Plan Expo/dependency upgrade path |
| Backend tests are missing | Medium | Manual/TestClient checks documented | Add auth/API/ownership/payment mock tests |
| CI validation is missing | Medium | Commands documented | Add CI for backend and mobile typecheck |
| Backend regression risk in auth and protected routes | High | Phase 4B pytest suite covers auth and protected endpoints | Add CI gate so tests run on every change |
| Data leakage between users | High | User-scoped list tests added for services, payments, receipts, notifications | Expand ownership tests for detail/mutation endpoints in domain hardening |
| Schema drift from `create_all` | High | Risk documented; tests isolate schema in SQLite | Move production-like schema management to Alembic before staging |
| Inconsistent API errors | Medium | Invalid token and auth error behavior tested | Define full API error contract in backend safety follow-up |
| Payments mock lacks idempotency | High | Protected endpoint coverage exists; real payments remain blocked | Address in Payments Mock Hardening before provider work |
| Fee not visible before payment confirmation | SEV-1 / Production Blocker | Real payments remain blocked | Add fee disclosure before confirmation, on confirmation, and on receipt in Phase 5B |
| Missing payment recovery path | SEV-1 / Production Blocker | Mock flow only; production blocked | Design failure, retry, change-method, support, and charged/not-charged paths in Phase 5D |
| Missing payment method flow | SEV-1 / Production Blocker | Current method UI is demo/static | Design add/select/manage payment method flow in Phase 5C before real payments |
| Audit and ledger absent before money movement | SEV-1 / Production Blocker | Real payments blocked by ADRs | Design ledger, audit events, idempotency, and traceability in Phase 5A |
| Trust signals insufficient for target users | SEV-2 / High | Product remains mock/dev | Add real trust requirements to onboarding/payment UX in Phase 5B |
| 4-digit OTP mockup obsolete | SEV-2 / High | ADR-012 and ADR-026 keep implementation at 6 digits | Remove or supersede 4-digit OTP references in future design work |
| Support and reclamation path undefined | SEV-2 / High | Support scope remains future work | Define support/reclamation UX in Phase 5E |
| Surprise fee can trigger chargeback or complaints | SEV-2 / High | Real payments blocked | Validate fee comprehension before provider integration |
| Payment method setup abandonment risk | SEV-2 / High | No real method setup exists yet | Design low-friction method setup with clear copy and error states |
| Double payment attempt risk after failure | SEV-2 / High | Payment is mock/dev | Add idempotency and recovery UX before real payments |
| Add service flow lacks explicit stepper | SEV-3 / Medium | Current flow works as MVP | Add progress clarity during user-services hardening |
| Service list lacks search or other path | SEV-3 / Medium | Current catalog is small | Add catalog search/other path when provider list grows |
| History lacks filters | SEV-3 / Medium | Mock history is small | Add filters before scaled receipt/history use |
| Financial microcopy can be ambiguous | SEV-3 / Medium | Product remains mock/dev | Tighten copy around certainty, totals, and next actions |
| Receipt download/share proof is not clear enough | SEV-3 / Medium | Receipt is mock/dev | Define receipt proof, download, share, and verification semantics in Phase 5E |
| No ledger before real payments | SEV-1 / Production Blocker | Real payments remain blocked | Implement ledger accounts and ledger entries in Phase 5B |
| No audit logs before real payments | SEV-1 / Production Blocker | Audit catalog documented | Implement audit event persistence and writer in Phase 5B |
| Double payment risk without idempotency | SEV-1 / Production Blocker | Real payments blocked; mock protected by tests only | Implement idempotency keys before provider submission |
| False success risk without provider confirmation | SEV-1 / Production Blocker | Mock/dev status documented | Separate provider confirmation from user-facing success |
| Reconciliation mismatch risk | SEV-2 / High | Reconciliation design documented | Implement reconciliation records and review queue before production |
| Receipt inconsistency risk | SEV-2 / High | Receipt remains mock/dev | Tie receipt state to payment/provider/ledger state |
| Provider timeout ambiguity | SEV-2 / High | Timeout not used in current mock flow | Design timeout as pending/ambiguous, not success |
| Raw provider payload sensitive data risk | SEV-2 / High | No real provider payloads yet | Store hashes/redacted payloads only unless approved |
| Admin audit abuse risk | SEV-2 / High | Admin endpoints not implemented | Require RBAC and audit access logging |
| Lack of immutable financial trail | SEV-1 / Production Blocker | Ledger/audit design created in 5A | Implement append-only ledger and audit records in Phase 5B |
| Audit log implementation is partial | SEV-2 / High | Phase 5B implements central audit writer and events for auth/user-service/payment/receipt paths | Expand audit coverage to provider, admin, support, and all financial state changes before production |
| Idempotency implementation is mock/dev only | SEV-2 / High | Phase 5B blocks duplicate mock payments by user/idempotency key | Extend idempotency to provider submission, retry windows, and conflicting payload detection before sandbox |
| Double payment risk is partially mitigated | SEV-2 / High | Duplicate mock payment attempts with same key return the existing payment | Add UI idempotency key generation, payment recovery UX, and provider-grade guarantees |
| Schema drift remains while `create_all` is active | SEV-2 / High | Alembic migration exists for ledger/audit tables | Remove production reliance on `create_all` before staging |
| Reconciliation remains design-only | SEV-2 / High | `ReconciliationRecord` model exists | Implement reconciliation job, import, mismatch classification, and review queue later |
| Provider timeout handling remains pending | SEV-2 / High | State machine includes timeout attempt state | Implement timeout handling with provider adapter and pending/ambiguous UX |
| False success risk remains until provider mapping | SEV-2 / High | Mock traces are marked as mock; real payments remain blocked | Separate provider confirmation from user-facing final success in real-provider phase |
