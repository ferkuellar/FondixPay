# Sprint 004A Handoff Prompt

Act as Senior Backend Engineer, FastAPI Security Engineer, Mobile Security Engineer, React Native/Expo Architect, and Software Quality Auditor.

Work only within Sprint 004A scope: harden auth/session P0 risks without changing product flow or adding real payment/OTP providers.

Read first:

1. `AGENTS.md`
2. `planning/STATE.md`
3. `planning/DECISIONS.md`
4. `planning/RISKS.md`
5. `docs/TECHNICAL_HARDENING_AUDIT.md`
6. `docs/SECURITY.md`
7. `docs/API.md`
8. `docs/AUDIT.md`
9. `backend/app/core/config.py`
10. `backend/app/core/security.py`
11. `backend/app/modules/auth/`
12. `mobile/src/store/authStore.ts`
13. `mobile/src/services/authApi.ts`

Do not implement real SMS, refresh tokens, RBAC, audit persistence, payments, wallet, KYC, or ledger in this sprint.

Required validation:

```powershell
cd backend
python -m compileall app
python -m pytest

cd ../mobile
npm run typecheck
```
