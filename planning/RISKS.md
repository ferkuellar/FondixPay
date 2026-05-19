# Risks

Updated: 2026-05-19

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
