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
