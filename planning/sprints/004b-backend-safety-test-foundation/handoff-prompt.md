# Sprint 004B Handoff Prompt

Act as Senior Backend Engineer, FastAPI Architect, Python Test Engineer, DevSecOps Engineer, Database Engineer, and Software Quality Auditor.

Read first:

1. `AGENTS.md`
2. `planning/STATE.md`
3. `planning/DECISIONS.md`
4. `planning/RISKS.md`
5. `docs/TECHNICAL_HARDENING_AUDIT.md`
6. `docs/VALIDATION.md`
7. `docs/SECURITY.md`
8. `docs/API.md`
9. `docs/OPERATIONS.md`
10. `planning/sprints/004b-backend-safety-test-foundation/COMPLETION_REPORT.md`

Use the existing pytest fixture structure. Do not integrate real payment providers, implement wallet/KYC, or change financial semantics.

Validation commands:

```powershell
cd backend
python -m compileall app
python -m pytest

cd ../mobile
npm run typecheck
```
