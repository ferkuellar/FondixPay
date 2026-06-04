# Risks

Updated: 2026-05-20

| Risk | Impact | Current Mitigation | Next Action |
| --- | --- | --- | --- |
| Tekae SSO launch or token generation could be mistaken for payment success | High / SEV-2 | Sprint 010 separates launch/session states from payment states | Implement pending/manual-review states before any runtime launch |
| Tekae credentials, tokens, or full launch URLs could leak to frontend, logs, commits, or support views | High / SEV-2 | Backend-only SSO generation and redaction are required | Define secret management, log redaction, support-view redaction, and audit controls before implementation |
| Tekae webhook specification is missing | High / SEV-2 | Sprint 010 captures webhook gaps | Obtain Tekae webhook/callback contract before payment success or receipt confirmation logic |
| Tekae reconciliation specification is missing | High / SEV-2 | Sprint 010 captures reconciliation gaps | Obtain Tekae reconciliation or settlement mechanism before production readiness |
| Tekae transaction query API is missing | High / SEV-2 | Sprint 010 records unknown outcome handling | Obtain status/query API details before implementing recovery, receipt, or manual-review evidence |
| Tekae production VPN/VPC or allowlist details are unclear | High / SEV-2 | Sprint 010 records production connectivity as blocker | Confirm VPN/VPC topology, allowlists, and environment boundaries before any production connectivity |
| FONDIXPAY could drift into fintech/payment-processor scope | High / SEV-2 | AGENTS/HARNESS/provider boundaries prohibit card vault, wallet, ledger balance, tokenization, acquiring, SPEI processor, and banking core | Reject implementation requests that duplicate Tekae capabilities |
| Historical Prontipagos/card-processor references could mislead future builders | Medium / SEV-3 | Sprint 010 marks Prontipagos permanently removed and records documentation debt | Create a future documentation cleanup sprint to archive or remove stale historical references |
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
| Fee not visible before payment confirmation | SEV-1 / Production Blocker | Phase 5C shows fee and final total in mock/dev payment detail, confirmation, CTA, success, and receipt/history | Validate with users and replace mock fee with approved commercial model before real payments |
| Surprise fee risk | SEV-2 / High | CTA and receipt now include total final for mock/dev flow | Run UX validation and legal copy review before pilot |
| Total transparency legal/commercial risk | SEV-2 / High | Backend response includes amount/fee/total minor fields and mobile uses consistent breakdown | Define final commercial fee policy before production |
| Backend/mobile fee inconsistency risk | SEV-2 / High | Backend exposes fee fields; mobile uses matching mock constant while local mock store is offline | Move mobile to backend fee source when real API flow replaces local mock store |
| Unsupported trust claims risk | SEV-2 / High | Removed "Pago 100% seguro" from payment detail and added specific trust copy | Legal/security review all trust copy before production |
| Receipt breakdown incomplete | SEV-2 / High | Receipt/history card shows service amount, fee, and total for mock/dev payments | Add downloadable/shareable proof in support/receipt phase |
| Mock fee confused with production fee | SEV-2 / High | `FONDIX_FEE_MINOR` and docs mark fee as mock/dev | Require approved commercial fee model before real payments |
| Phantom card shown in UI | SEV-1 / Production Blocker | Phase 5D relabels current method as mock/dev and documents no real method flow | Implement add/select/change method UX in Phase 5E |
| PCI risk from card capture without tokenization | SEV-1 / Production Blocker | No real card form or storage exists | Require provider vault/tokenization before card support |
| Card-only payment adoption friction | SEV-2 / High | Card-only decision is explicit and real card flow remains blocked | Validate card trust/onboarding copy with target users before beta |
| Sensitive payment method data in logs | SEV-1 / Production Blocker | Docs require redaction and safe labels only | Enforce in future API/tests |
| Payment method unavailable without fallback | SEV-2 / High | Strategy documents unavailable state | Implement fallback UX before real payments |
| Real payment confirmed without clear method | SEV-1 / Production Blocker | Real payments remain blocked | Require selected method in future confirmation flow |
| Support cannot inspect method safely | SEV-2 / High | Operations docs require safe display label only | Add support/admin views with RBAC later |
# Phase 5E Payment Method UX Risks

| Severity | Risk | Status | Notes |
|---|---|---|---|
| SEV-1 | Phantom card or payment method shown before user action | Mitigated for mock UX | ConfirmPayment now requires a selected method from local state. |
| SEV-1 | Real card data captured without tokenization | Reduced | Mock flow does not request PAN, CVV, CLABE, or real credentials. |
| SEV-2 | User confusion between demo and real charge | Reduced | Demo/no-charge copy is shown in method screens and confirmation. |
| SEV-2 | No real payment provider or tokenization | Pending | Must be resolved before real payments. |
| SEV-2 | No complete payment recovery path | Pending | Recommended next phase: Phase 5F. |

# Phase 5F Payment Recovery Risks

| Severity | Risk | Status | Notes |
|---|---|---|---|
| SEV-1 | User pays twice | Design mitigated | Future implementation requires idempotency on retry and provider submission. |
| SEV-1 | Payment marked successful without confirmation | Design mitigated | `paid` requires sufficient confirmation; timeout is not success. |
| SEV-1 | Payment charged but no receipt | Open | Requires receipt recovery task and support/operations workflow. |
| SEV-2 | Provider timeout misinterpreted | Design mitigated | Timeout maps to `provider_timeout` or `pending_confirmation`, not final success. |
| SEV-1 | Missing idempotency in real provider retries | Open | Mock idempotency exists; provider-grade idempotency remains required. |
| SEV-2 | Missing reconciliation | Open | Reconciliation remains future work. |
| SEV-2 | Support lacks evidence | Open | Future recovery cases need audit/correlation IDs and safe provider references. |
| SEV-2 | Ambiguous user messages reduce trust | Design mitigated | User-facing copy rules defined in `docs/PAYMENT_RECOVERY_PATHS.md`. |
| SEV-2 | Fraud or abuse through retries | Open | Future retry limits and lockouts required. |
| SEV-1 | Uncontrolled reversals/refunds | Open | Reversals are explicitly future/out of scope. |

## Phase 5F Mock UX Implementation Update

| Severity | Risk | Status | Notes |
|---|---|---|---|
| SEV-1 | Missing recovery path in mock flow | Mitigated for mock/dev | Failed, pending, timeout, duplicate-blocked, retry, change-method, and help placeholder are now represented in mobile. |
| SEV-2 | Double tap during mock confirmation | Reduced | ConfirmPayment disables processing path and has duplicate-blocked mock scenario. |
| SEV-1 | False success for pending state | Reduced | Pending/timeout route to PaymentPending, not PaymentSuccess. |
| SEV-2 | Support without real context | Pending | Support placeholder only shows safe mock references until backend/support workflows exist. |
| SEV-2 | Provider outage/reconciliation/reversal behavior | Pending | Requires real provider mapping and operations work. |

# Phase 6A Account and Balance Risks

| Severity | Risk | Status | Notes |
|---|---|---|---|
| SEV-1 | Simulated balance confused with real money | Design mitigated | Required demo labels and no-real-money rules documented. |
| SEV-1 | Editable/inconsistent balance field | Design mitigated | Balance must derive from ledger/snapshot rules. |
| SEV-2 | Available incorrectly includes pending | Design mitigated | Available, pending, held are separated by ADR-062. |
| SEV-2 | Held/pending semantics not visible | Design mitigated | UX and validation rules added. |
| SEV-1 | Regulatory risk from wallet claims | Open | Real wallet remains blocked pending legal/provider model. |
| SEV-2 | User claims non-real funds | Open | Demo UX and terms need validation before 6B. |
| SEV-2 | Movements not traceable | Open | Phase 6B must map movements to ledger/payment facts. |
| SEV-2 | Account state changes not audited | Open | Audit contract defined; implementation pending. |
| SEV-2 | Balance mismatch | Open | Calculation tests and investigation runbooks pending. |

# Phase 6B Simulated Balance Implementation Risks

| Severity | Risk | Status | Notes |
|---|---|---|---|
| SEV-1 | Simulated balance confused with real money | Mitigated for demo UX/API | API and mobile label balance as demo and not real money. |
| SEV-2 | User claims demo balance as real funds | Reduced | Disclaimer is visible; legal/terms review remains future. |
| SEV-2 | Balance inconsistent with real ledger | Pending | Phase 6B uses demo snapshots and seed movement, not production ledger posting rules. |
| SEV-2 | Ledger incomplete for wallet semantics | Pending | Ledger baseline remains mock/payment audit foundation only. |
| SEV-2 | Movements not traceable | Reduced | Demo movement seed is persisted and linked to demo account. |
| SEV-1 | Regulatory wallet claims | Blocked | No wallet real claim or real funding rail was added. |
| SEV-1 | Cross-user account access | Mitigated | Endpoint scope comes from current authenticated user and tests cover distinct accounts. |

# Phase 7 History And Receipt Risks

| Severity | Risk | Status | Notes |
|---|---|---|---|
| SEV-2 | History hides pending or failed payment attempts | Mitigated for mobile mock/dev | Recovery attempts now enter local history with explicit payment and receipt status. |
| SEV-2 | Receipt implies false provider success | Reduced | Receipt detail and status badges label mock/dev certainty and receipt availability. |
| SEV-2 | Receipt lacks fee breakdown | Mitigated | Detail keeps service amount, fee, total, currency, and method label visible. |
| SEV-2 | Support lacks safe reference | Reduced | Local receipt detail shows mock reference and correlation reference when available. |
| SEV-2 | Movements remain non-orchestrated with history | Pending | Phase 8 must align mock payment, receipt, movement, and balance events. |
| SEV-2 | Mock states confused with provider states | Pending | Real provider confirmation mapping remains blocked until provider work. |

# Hotfix Card-Only Payment Strategy Risks

## Risk — Card-only payment security and PCI exposure

Because FondixPay is card-only for user payments, real payment implementation introduces card security, tokenization, PCI scope, fraud, chargeback, declined authorization, expired card, invalid CVV, 3DS/auth, and processor outage risks.

Severity: SEV-1 Production Blocker.

Mitigation:
- No PAN/CVV storage.
- Use approved tokenized card processor.
- Keep card flow mock-only until provider selection.
- Preserve fee transparency, recovery paths, audit logs, idempotency, and backend tests.
- Complete security review before production.

SPEI, CoDi, OXXO/store payment, cash-in, wallet balance, stored balance, cash, and bank transfer remain out of scope as user-facing payment methods in the current roadmap.

# Phase 8A Card Processor Sandbox Risks

| Severity | Risk | Current Mitigation | Next Action |
|---|---|---|---|
| SEV-1 | Card processor not selected | Real card work remains blocked | Evaluate candidates with evidence-backed matrix. |
| SEV-1 | PCI exposure from card capture | Prefer tokenized provider-controlled capture | Select hosted/SDK tokenization path. |
| SEV-1 | PAN/CVV accidental storage | Existing docs prohibit sensitive storage | Add implementation tests and log redaction checks. |
| SEV-1 | Card charge success but service payment failure | Card and Prontipagos legs separated | Design Prontipagos recovery/reconciliation in Phase 8B. |
| SEV-1 | Service payment success but card charge failure | Service execution gate documented | Enforce approved card state before service submission. |
| SEV-2 | Processor timeout ambiguity | Pending/recovery semantics documented | Add sandbox status lookup/webhook strategy. |
| SEV-1 | Duplicate charge | Idempotency required | Bind card attempts and processor key to intent/operation. |
| SEV-2 | Chargeback/dispute workflow missing | Production blocked | Document support/finance workflow before launch. |
| SEV-2 | 3DS/auth challenge failure | Future auth-required state documented | Validate selected processor UX and callback model. |
| SEV-1 | Webhook spoofing | Signature/replay strategy documented | Implement verification before trusting events. |
| SEV-2 | Card processor outage | Operations gap documented | Build outage runbook and metrics. |
| SEV-1 | Reconciliation mismatch card vs Prontipagos | Separate reconciliation legs defined | Build daily reconciliation and SEV-1 mismatch policy. |

# Phase 8B Prontipagos Sandbox Risks

| Severity | Risk | Current Mitigation | Next Action |
|---|---|---|---|
| SEV-1 | Prontipagos API not confirmed | Design uses `TO_CONFIRM` contracts only | Obtain sandbox docs and credentials. |
| SEV-1 | Provider timeout ambiguity | Timeout is not success | Implement status/review path before retry. |
| SEV-2 | Invalid reference | Validation flow documented | Confirm validation API and UX. |
| SEV-1 | Amount mismatch | Amount lookup and mismatch states documented | Confirm amount rules and comparison tests. |
| SEV-1 | Duplicate provider payment | Service-payment idempotency required | Implement duplicate blocking and evidence lookup. |
| SEV-1 | Card charge success but service payment failure | Recovery/reconciliation path documented | Implement orchestrator and manual review. |
| SEV-1 | Service payment success but card charge missing | Marked SEV-1 impossible state | Enforce card prerequisite and reconcile. |
| SEV-1 | Provider reconciliation mismatch | Future reconciliation model documented | Add report/status reconciliation. |
| SEV-2 | Receipt unavailable | Receipt confirmation gate documented | Build recovery/support runbook. |
| SEV-2 | Provider outage | Operations runbooks planned | Add metrics and outage policy. |
| SEV-1 | Secrets leakage | Env/secret-manager policy documented | Keep credentials out of repo/logs. |
| SEV-1 | Raw provider payload exposure | Hash/redaction policy documented | Add sanitizer/tests. |
| SEV-1 | Manual review missing | Production gate blocks launch | Build queue/admin workflow. |

# Phase 8C Sandbox Integration Implementation Risks

| Severity | Risk | Status After 8C | Next Action |
|---|---|---|---|
| SEV-1 | Card processor not selected | Pending | Select provider and review tokenization contract. |
| SEV-1 | Prontipagos API not confirmed | Pending | Obtain official sandbox docs and credentials. |
| SEV-1 | Card success plus Prontipagos failure | Partially mitigated | Sandbox path enters manual review; build operations queue. |
| SEV-1 | Card failed but Prontipagos called | Mitigated in sandbox tests | Preserve gate in real adapter. |
| SEV-1 | Duplicate card/service execution | Partially mitigated | Sandbox idempotency tested; bind real provider keys later. |
| SEV-2 | Provider timeout ambiguity | Partially mitigated | Sandbox maps pending/manual review; add status checks/webhooks. |
| SEV-1 | Manual review missing | Production blocker | Build CRM/admin review path. |
| SEV-1 | Real credentials missing | Blocks real integration | Provision secrets only after contract review. |
| SEV-1 | Webhooks missing | Pending | Implement signed provider events when contracts exist. |
| SEV-1 | Reconciliation missing | Pending | Implement reports/status reconciliation and review records. |

# Phase 9 Notifications Receipt Proof Risks

| Severity | Risk | Status After 9 | Next Action |
|---|---|---|---|
| SEV-1 | False confirmed receipt | Mitigated in proof mapping | Preserve provider confirmation gate in real adapters. |
| SEV-1 | Pending shown as success | Mitigated | Keep notification and mobile status copy exact. |
| SEV-1 | Timeout shown as success | Mitigated | Resolve through status/review, never inferred success. |
| SEV-2 | User has no proof after payment state | Reduced | Proof surface and pending/unavailable states exist. |
| SEV-2 | Support lacks reference | Reduced | Proof includes payment, receipt, correlation, and safe provider references. |
| SEV-2 | Proof omits fee breakdown | Mitigated | Proof exposes amount, fee, total, and currency. |
| SEV-1 | Sensitive card data in proof | Mitigated for current path | Keep only safe method labels/last4 when approved. |
| SEV-2 | Misleading notification content | Reduced | Typed in-app notifications distinguish state. |
| SEV-1 | Mock/sandbox confused with production | Reduced | Proof and mobile disclaimer remain explicit. |

# Phase 10A CRM Admin Risks

| Severity | Risk | Current Mitigation | Next Action |
|---|---|---|---|
| SEV-1 / Production Blocker | No CRM/Admin Panel before production | Architecture and backlog defined | Implement protected admin backend and frontend phases. |
| SEV-1 | No RBAC | Permission design defined | Implement role/permission enforcement and tests. |
| SEV-1 | Admin data overexposure | Redaction contract defined | Verify responses, logs, notes, and exports. |
| SEV-1 | PAN/CVV exposure | Explicit CRM prohibition | Test admin APIs and UI contracts. |
| SEV-1 | Missing manual review queue | Workflow designed | Implement queue and case events before production. |
| SEV-1 | Missing reconciliation visibility | Card and Prontipagos views designed separately | Implement reconciliation read paths. |
| SEV-2 | Missing support workflow | Ticket/support workflow designed | Build ticket module and runbooks. |
| SEV-1 / SEV-2 | Missing admin audit logs | Admin event catalog defined | Emit events for privileged views and actions. |
| SEV-1 | Incorrect role permissions | RBAC matrix defined | Add route tests and denied-scenario tests. |
| SEV-2 | Export abuse | Export controls designed | Require permission, audit, and policy gating. |
| SEV-1 | Admin account compromise | Future MFA/session controls defined | Implement admin auth hardening. |
| SEV-1 | Ledger destructive edits from admin | Read-only CRM ledger rule | Never expose destructive ledger mutation endpoints. |

# Phase 10B CRM Admin Backend Risks

| Severity | Risk | Status After 10B | Next Action |
|---|---|---|---|
| SEV-1 | Admin endpoint without auth | Mitigated for implemented `/admin/*` routes | Preserve dependency tests for every new route. |
| SEV-1 | No admin RBAC | Partially mitigated | Roles and permissions exist; harden admin auth/session model before production. |
| SEV-1 | Incorrect role permissions | Reduced | RBAC tests cover USER deny, SUPPORT limits, FINANCE reconciliation, AUDITOR no writes. |
| SEV-1 | Admin overexposure | Reduced | Role redaction and sensitive-key stripping added; frontend and exports still need verification. |
| SEV-1 | PAN/CVV exposure | Mitigated for current admin response model | Keep sensitive-field regression checks. |
| SEV-2 | No support tickets | Mitigated for backend minimum | Build CRM frontend and support runbooks around ticket lifecycle. |
| SEV-1 | No manual review queue | Mitigated for backend minimum | Add queue operations and evidence UX. |
| SEV-1 / SEV-2 | No admin audit logs | Reduced | Implemented sensitive admin view/write events; expand coverage with future endpoints. |
| SEV-1 | No reconciliation visibility | Partially mitigated | Placeholders exist only; real card and Prontipagos reconciliation remain blockers. |

# Phase 10C CRM Admin Frontend Risks

| Severity | Risk | Status After 10C | Next Action |
|---|---|---|---|
| SEV-1 | Admin frontend exposes sensitive data | Reduced | UI uses safe schemas, redaction display, and sensitive-key audit metadata block. |
| SEV-1 | UI permission mismatch | Reduced | Role navigation/rendering mirrors Phase 10B permissions; backend stays authority. |
| SEV-1 | Admin action without backend authorization | Mitigated | Frontend uses protected `/admin/*`; backend rejects invalid token/permission. |
| SEV-1 | Support role overexposure | Reduced | Support navigation excludes audit and reconciliation; backend data remains masked. |
| SEV-2 | Audit logs not visible | Reduced | Audit list page exists for authorized roles. |
| SEV-1 | Manual review not usable | Reduced | Queue/detail/update UI exists for authorized backend roles. |
| SEV-1 | Reconciliation placeholder misunderstood as real | Reduced | UI states placeholder and provider dependency explicitly. |
| SEV-1 | Frontend not connected to backend admin APIs | Reduced | Shared API client consumes Phase 10B endpoints. |
| SEV-2 | No frontend tests/typecheck | Partially mitigated | Typecheck/build are required; browser/runtime test automation remains future. |

## Risk — Coverage catalog mismatch

| Risk | Likelihood | Impact | Mitigation | Status |
|---|---:|---:|---|---|
| Service coverage shown in the mobile app may not match actual Prontipagos availability. | Medium | High | Validate coverage rules against Prontipagos service catalog before production release. Add support visibility to check service/state availability. | Open |
| Mobile app may accidentally hardcode service coverage. | Medium | High | Enforce backend-only catalog source. Add regression test to ensure services come from API response. | Open |
| User may need to pay a service for another state. | High | Medium | Allow manual state change. Manual state selection overrides GPS. | Open |
| Support agents may not know why a user cannot see a service. | High | Medium | Add read-only service coverage lookup in support console or support workflow documentation. | Open |
| WhatsApp coupling to payments | Medium | High | WhatsApp delivery must remain non-blocking and must never affect payment success, reconciliation, or Prontipagos execution. | Open |
## Phase 10D - CRM Support, Reconciliation & Manual Review Workflow Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Manual review missing or unusable | SEV-1 | mitigated for sandbox/admin baseline | Manual review cases, status updates, resolution requirement, and event log are implemented. |
| Support workflow incomplete | SEV-2 | mitigated for minimum operations | Tickets can link to user/payment/receipt/manual review/correlation, accept notes, and require resolution to close. |
| Reconciliation ambiguity | SEV-1 | mitigated by separation | Card processor and Prontipagos reconciliation endpoints/pages remain separate placeholders with `production_ready=false`. |
| Card success plus Prontipagos failure unresolved | SEV-1 | partially mitigated | Manual review case type and detection helper exist; real provider integration remains pending. |
| Receipt unavailable unresolved | SEV-1 | partially mitigated | Manual review case type, support ticket category, and operations runbook exist. |
| Duplicate suspected unresolved | SEV-1 | partially mitigated | Duplicate attempt/claim case types and support category exist; fraud/chargeback readiness remains pending. |
| Amount mismatch unresolved | SEV-1 | partially mitigated | Amount mismatch case type and detection helper exist; real reconciliation remains pending. |
| Admin closes case without audit | SEV-1 | mitigated | Tickets/manual review require resolution for close/resolved and emit admin/manual review events. |
| SUPPORT over-permissioned | SEV-1 | mitigated by RBAC tests | SUPPORT cannot view reconciliation or resolve manual review financial flows. |
| FINANCE destructive actions | SEV-1 | mitigated by scope | FINANCE can view reconciliation and update manual review, but cannot edit ledger or financial amounts. |
| Provider references exposed to wrong role | SEV-1 | mitigated by redaction | Backend redaction and frontend RedactedValue keep provider references role-limited. |
| No operational runbook | SEV-2 | mitigated | Phase 10D runbooks added for missing receipt, provider timeout, duplicate suspicion, and charged/not-paid claims. |

## Phase 10D.1 - WhatsApp Receipt Channel Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| WhatsApp sent without explicit consent | SEV-1 | open | Future consent must be explicit, granular, timestamped, and never pre-enabled. |
| Duplicate receipt delivery | SEV-2 | open | Future delivery uses idempotency key `receipt_id + channel + template_name + recipient_hash`. |
| WhatsApp failure blocks payment | SEV-1 | mitigated by design | WhatsApp delivery is non-blocking and cannot alter payment, receipt, ledger, or proof state. |
| Full phone number logged | SEV-1 | open | Future logs use recipient hash and masked display only. |
| Sensitive payload in message | SEV-1 | open | Safe payload excludes PAN, CVV, tokens, secrets, raw provider payloads, and raw provider errors. |
| User treats WhatsApp as only proof of payment | SEV-2 | open | Copy and docs state internal receipt/proof/audit remain source of truth. |
| WhatsApp provider not selected | SEV-2 | open | Provider selection and security review are future gates before runtime. |
| Template rejected by provider | SEV-2 | open | Template approval is a future backlog item and production gate. |
| Future webhook spoofing | SEV-1 | open | Webhook signature/replay verification required before accepting provider webhooks. |

## Phase 10X - Public Landing Page Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Landing page coupled to financial core | SEV-1 | mitigated for current phase | Landing lives under `landing/` as static HTML and does not import mobile/backend/admin code. |
| Vercel used for sensitive runtime | SEV-1 | mitigated by decision | Vercel is documented as landing-only; backend/CRM/payments remain separate. |
| Public copy promises production payments | SEV-1 | reduced | Landing copy was adjusted to launch-pending language and production blockers remain explicit. |
| Unsupported security/compliance claims | SEV-1 | reduced | CNBV/IFPE/SPEI/CoDi and unsupported security claims were removed from the landing. |
| Unconfirmed support or social channels published | SEV-2 | reduced | Public channels use `[PENDING_SUPPORT_CHANNEL]` until confirmed. |
| App store URLs published before approval | SEV-2 | reduced | Download links use `[PENDING_APP_STORE_URL]` and `[PENDING_PLAY_STORE_URL]`. |
| Privacy/terms URLs missing before launch | SEV-2 | open | Placeholders remain until legal/privacy pages are approved. |
| External map/CDN dependency breaks public landing | SEV-3 | mitigated | Coverage now renders from local static `coverage-data.js` without external map/CDN dependency. |
| Public coverage exposes internal commercial fields | SEV-1 | mitigated | Landing publishes only state/service/area/coverage type and excludes utility, margins, charges, user data, tokens, and provider payloads. |
| Accidental mobile/backend/admin modification | SEV-1 | mitigated | Phase 10X changes are limited to landing/docs/planning. |
## Phase 10E - Coverage-Aware Service Catalog Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Unconfirmed service shown as payable | SEV-1 | open | Mobile must require `payable_in_mobile=true` backed by confirmed provider capability. |
| Coverage map interpreted as payment availability | SEV-1 | open | Landing disclaimers and docs state the map is reference/commercial only. |
| Provider catalog mismatch | SEV-1 | open | Future sync must detect mismatches and create catalog/manual review events. |
| Unavailable service payment attempt | SEV-1 | open | Payment flow must reject non-payable services before confirmation. |
| Stale coverage data | SEV-2 | open | Catalog sources need versioning, imported_at, and review workflow. |
| Excel/map discrepancy | SEV-2 | open | Phase 10F must report discrepancies before import. |
| Hardcoded services diverge from provider catalog | SEV-1 | open | Replace hardcoded mobile/map data with validated catalog source. |
| Wrong provider service code | SEV-1 | open | Provider mapping requires admin review and audit trail. |
| No audit trail for coverage changes | SEV-1 | open | ADR-129 requires audit events for coverage and visibility changes. |
| User frustration from unavailable services | SEV-2 | open | MVP hides unavailable services and uses clear unavailable copy. |

## Phase 10F - Service Catalog Implementation Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Seed interpreted as provider confirmation | SEV-1 | mitigated/ongoing | Seeded items are `provider_pending`, non-payable, and have unconfirmed provider capability. |
| Mobile showing unavailable services | SEV-1 | mitigated | Mobile Add Service consumes `/service-catalog`, which returns only payable services by default. |
| Catalog hardcoded divergence | SEV-2 | ongoing | Backend catalog module is now source for mobile discovery; existing demo saved services remain mock only. |
| Excel/map inconsistency | SEV-2 | open | Seed is conservative; future import must report discrepancies before enablement. |
| Admin activating service without audit | SEV-1 | partially mitigated | Admin PATCH is RBAC-protected and emits audit; broader admin workflow remains pending. |
| User attempting payment without provider capability | SEV-1 | partially mitigated | Catalog validation exists; payment-flow enforcement is still required before real payments. |
| Landing map confused with payment availability | SEV-1 | mitigated/ongoing | `/coverage-map` returns reference-only flags and disclaimer. |
## Phase 10G WhatsApp Receipt Risks

Mitigated in MVP:

- Unconsented messaging: default disabled and explicit opt-in required.
- Payment disruption from notification failure: WhatsApp errors are non-blocking.
- Duplicate delivery: idempotency key blocks duplicate receipt/channel/template/recipient sends.
- Sensitive data leakage: delivery stores masked/hash recipient and minimal template payload.

Open production risks:

- Meta template approval and provider contract are not complete.
- Webhook signature verification is scaffolded by configuration only, not implemented.
- Delivery monitoring, retry policy, opt-out compliance, and incident runbook need a future phase.
- Legal/privacy approval is required before real user messaging.

## Phase AWS-2 Dev/Staging Deployment Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| AWS credentials are not configured, blocking plan/apply validation against a live account. | SEV-2 | open | Configure credentials for a confirmed non-production account, run `aws sts get-caller-identity`, then rerun `terraform plan`. |
| Staging is implied by phase name but not implemented in Terraform. | SEV-2 | open | Treat AWS-2 as dev-only until an approved sprint adds `infra/terraform/environments/staging`. |
| Public subnet dev compute could be overexposed if enabled with broad CIDRs. | SEV-1 | mitigated by default | Keep `enable_compute=false`; if enabled, restrict SSH/backend CIDRs and do not use `0.0.0.0/0`. |
| AWS Budgets do not stop spend. | SEV-2 | open | Monitor budget alerts and manually destroy unused dev resources after testing. |
| Terraform apply could target the wrong AWS account if identity is not checked. | SEV-1 | open | Require `aws sts get-caller-identity`, account review, plan review, and explicit approval before apply. |

## Phase AWS-3 CI/CD Pipeline Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| CI/CD could accidentally deploy infrastructure from pull requests. | SEV-1 | mitigated | Pull request workflows validate only; `deploy-dev.yml` is manual and environment-gated. |
| Terraform apply could run against the wrong AWS account. | SEV-1 | open | OIDC role, GitHub `dev` environment approval, and `aws sts get-caller-identity` are required before apply. |
| Long-lived AWS keys could leak through CI configuration. | SEV-1 | mitigated by design | Workflows use OIDC role assumption and do not require committed or long-lived access keys. |
| Terraform state or plan could be exposed as an artifact. | SEV-1 | mitigated | Workflows do not upload state or plan artifacts. |
| Dev apply could lose state if remote backend is not configured. | SEV-1 | mitigated | Manual plan/apply workflows require S3 state bucket and DynamoDB lock table secrets and generate an uncommitted backend override. |
| Staging could be implied without a real environment. | SEV-2 | open | AWS-3 documents dev only; staging requires a future Terraform environment. |
| Production deployment could be added prematurely. | SEV-1 | mitigated for AWS-3 | No production workflow exists; future production requires a separate approved phase. |
| Vercel could be misused for sensitive runtime. | SEV-1 | mitigated by documentation | CI/CD docs and security docs keep Vercel landing-only. |
| CI may fail because dependency installation depends on external registries. | SEV-2 | open | Use lockfiles and GitHub cache; investigate dependency or registry outages without bypassing validation. |

## Phase 11 Audit, Fraud & Chargeback Readiness Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Fraud signals may create false positives. | SEV-2 | open | Signals are review-only and require human resolution; no auto-blocking exists. |
| Fraud thresholds are not finalized. | SEV-2 | open | Signal catalog is documented; future phase must define thresholds/time windows. |
| Chargeback legal response policy is missing. | SEV-1 | open | Phase 11 stores internal evidence only; legal templates/deadlines remain future. |
| Evidence retention policy is missing. | SEV-1 | open | Avoid destructive deletion; define retention/legal hold before production. |
| Evidence notes could over-collect PII. | SEV-1 | open | Docs and security rules prohibit PAN/CVV/secrets/raw provider payloads/unnecessary PII. |
| Reconciliation execution is still placeholder-only. | SEV-1 | open | Link disputes to reconciliation evidence where available; implement real reconciliation later. |
| External chargeback submission could be added prematurely. | SEV-1 | mitigated for Phase 11 | No external integration exists; future submission requires approved phase. |
| SUPPORT may need dispute context but cannot update cases. | SEV-2 | accepted | SUPPORT uses support tickets and escalates to FINANCE/ADMIN for dispute updates. |

## Phase 10X.1 Public Landing Chatbot Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Public chatbot could be mistaken for authenticated support. | SEV-1 | mitigated/ongoing | Private payment/account/receipt/balance/OTP/card questions route to authenticated app/support flow. |
| User may type sensitive data into public chat. | SEV-1 | mitigated/ongoing | Backend masks likely card numbers, OTP-like codes, emails, phone numbers, tokens, secrets, and password-like values before storage. |
| Incorrect FAQ/intent content could make unsupported product claims. | SEV-2 | open | CRM/Admin response console is RBAC-protected and audited; content approval workflow remains a next-phase governance item. |
| Public endpoint abuse could create storage or support-review noise. | SEV-2 | open | Message length validation exists; rate limiting should be added when middleware is selected. |
| AI provider output could drift if enabled later. | SEV-2 | open | Current implementation works without AI provider; future AI integration requires provider-specific guardrails, evaluation, and logging policy. |
| Landing visual regression could occur during future edits. | SEV-2 | open | Approved design is documented; manual browser/screenshot validation is required after landing UI changes. |

## Phase 10X.2 Chat Operations Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| SEV-1/SEV-2 chat cases could be under-triaged. | SEV-1 | mitigated/ongoing | Deterministic classifier marks high-risk payment/fraud/receipt concerns and routes them to human review. |
| AI could be used to close sensitive cases prematurely. | SEV-1 | mitigated | No AI closure path exists; docs and code require human review for `SEV-1`/`SEV-2`. |
| Support notes could contain sensitive data. | SEV-1 | mitigated/ongoing | Notes are masked before storage and docs prohibit PAN, CVV, OTPs, secrets, raw provider payloads, and raw provider errors. |
| Chat Operations could expose payment/customer internals to the public chatbot. | SEV-1 | mitigated | Public chatbot does not receive ticket internals and still cannot query private payment, receipt, balance, account, or transaction data. |
| `Bot de Landing` could become an overloaded support desk. | SEV-2 | mitigated | `Bot de Landing` remains config/metrics; Chat Operations owns ticket and escalation workflows. |
| Sidebar navigation could drift from approved CRM module structure. | SEV-2 | mitigated | Chat Operations is reachable internally but `Chat console` was not restored to the sidebar. |
| Deterministic classification false positives/negatives. | SEV-2 | open | Classifier is explainable and manual override is available for authorized roles. Future tuning should use reviewed outcomes. |

## Sprint 012 Dev Readiness And App Cleanup Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Dev readiness could be mistaken for production readiness. | SEV-1 | open | Sprint 012 docs state readiness is documentation-only and does not authorize runtime provider execution or production launch. |
| Tekae runtime could be enabled before Sprint 011 contract readiness passes. | SEV-1 | open | Keep `TEKAE_ENABLED=false`, `TEKAE_MODE=disabled`, and require Sprint 011 evidence before implementation. |
| Mock payment success copy could be misread as provider-confirmed success. | SEV-1 | open | Document copy review as future cleanup; token generation, URL launch, and mock success must not equal real payment success. |
| Current AWS dev foundation could be mistaken for staging or production infrastructure. | SEV-1 | open | Docs state Terraform is dev-only, optional compute is disabled, staging is not implemented, and production remains blocked. |
| Historical Prontipagos/card processor references could confuse future implementation. | SEV-2 | open | Treat stale references as documentation debt; preserve durable decision that Prontipagos is permanently removed. |
| Environment placeholders could be filled with real secrets in source control. | SEV-1 | open | Secret hygiene rules require real values to live in environment-specific secret stores, never committed files. |
| CI passing could be mistaken for Tekae readiness. | SEV-2 | open | Docs state CI validates local code quality only and does not prove provider contract readiness. |
| Landing/Vercel boundary could drift into backend or payment runtime. | SEV-1 | open | Deployment/security docs keep Vercel landing-only and prohibit backend/API/payment/admin/provider credential runtime there. |

## Sprint 013 Environment Docs Alignment And Mock Payment Copy Risks

| Risk | Severity | Status | Mitigation |
|---|---|---|---|
| Environment documentation could imply deployed ECS/RDS, staging, or production infrastructure that does not exist. | SEV-2 | mitigated/ongoing | Sprint 013 aligns `docs/ENVIRONMENT.md` as canonical current-state strategy and updates `docs/ENVIRONMENTS.md` as a tier matrix only. |
| Mock payment copy could be misread as real provider-confirmed payment success. | SEV-1 | open | `docs/MOCK_PAYMENT_COPY_REVIEW.md` documents risky copy and future safer wording; runtime copy remains unchanged in this documentation-only sprint. |
| Service-card or history copy could imply an external utility account is current or paid. | SEV-1 | open | Future UI cleanup must separate demo/local state from provider-confirmed state before real runtime. |
| Historical Prontipagos labels in docs, README, or CRM/Admin copy could confuse future Tekae implementation. | SEV-2 | open | Preserve Prontipagos as permanently removed and schedule a future documentation/UI copy cleanup sprint. |
| Vercel public landing boundary could be weakened by environment terminology drift. | SEV-1 | mitigated/ongoing | Sprint 013 restates Vercel as landing/front-door only, not backend/API/payment/admin/provider runtime. |
