# Sprint 004A - Auth & Session Security P0 Acceptance

- `otp_dev` is not returned outside development/test when explicitly enabled.
- Weak JWT secrets are rejected in staging/production.
- Production-like environments require explicit CORS.
- `.env.example` documents development-only values.
- Mobile does not require `otp_dev` to continue the flow.
- `/auth/me` rejects invalid tokens cleanly.
- `/auth/me` accepts valid tokens.
- Local development OTP flow remains available.
- Security, API, audit, decisions, risks, and state docs are updated.
- Sprint 004A has requirements, blueprint, acceptance, handoff, and completion report.
- No real payments were implemented.
- No external OTP provider was integrated.
- No real secrets were added.
- Backend and mobile validations are executed or documented with reason.
