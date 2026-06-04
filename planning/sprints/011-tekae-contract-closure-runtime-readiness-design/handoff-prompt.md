# Sprint 011 - Tekae Contract Closure & Runtime Readiness Design Builder Handoff Prompt

You are the Builder for the FONDIXPAY project.

This is a documentation and architecture sprint only.

Sprint name:

Sprint 011 - Tekae Contract Closure & Runtime Readiness Design

## Read First

Read these files before making changes:

1. `AGENTS.md`
2. `planning/STATE.md`
3. `planning/DECISIONS.md`
4. `planning/DOMAIN.md`
5. `planning/RISKS.md`
6. `planning/QUESTIONS.md`
7. `docs/ARCHITECTURE.md`
8. `docs/API.md`
9. `docs/DATA_MODEL.md`
10. `docs/SECURITY.md`
11. `docs/TRANSACTION_STATES.md`
12. `docs/TEKAE_DISCOVERY.md`
13. `docs/RECONCILIATION.md`
14. `docs/PROVIDER_BOUNDARIES.md`
15. `docs/HARNESS.md`
16. `planning/sprints/010-tekae-discovery/requirements.md`
17. `planning/sprints/010-tekae-discovery/blueprint.md`
18. `planning/sprints/010-tekae-discovery/acceptance.md`
19. `planning/sprints/011-tekae-contract-closure-runtime-readiness-design/requirements.md`
20. `planning/sprints/011-tekae-contract-closure-runtime-readiness-design/blueprint.md`
21. `planning/sprints/011-tekae-contract-closure-runtime-readiness-design/acceptance.md`
22. Official Tekae material supplied by the Founder.

## Task

Document Sprint 011 without touching runtime code.

Close or explicitly keep blocked the Tekae contract and runtime-readiness items required before implementation:

- Sandbox URL.
- Swagger/API docs.
- Test credentials status.
- SSO token generation contract.
- SSO launch contract.
- Token TTL, uniqueness, renewal, and expiration.
- Webhook/callback contract.
- Transaction query/status API.
- Reconciliation/settlement mechanism.
- Provider transaction/reference fields.
- Receipt/comprobante retrieval rules.
- Error taxonomy.
- Rate limits, timeout, retry, and idempotency expectations.
- Production VPN/VPC or allowlist details.
- Support escalation path.

## Rules

- Do not implement code.
- Do not create migrations.
- Do not configure credentials.
- Do not touch backend runtime.
- Do not touch mobile runtime.
- Do not create webhook endpoints.
- Do not execute real payments.
- Do not assume Tekae capabilities not documented by official Tekae material.
- Do not expose Tekae credentials, tokens, private URLs, or secrets.
- Do not claim payment success from token generation.
- Do not claim payment success from URL launch.
- Preserve that FONDIXPAY is not fintech.
- Preserve that FONDIXPAY backend is the secure Tekae session broker.
- Preserve that mobile launches Tekae URL only.

## Expected Documentation Updates

Update documentation only, as needed:

- `docs/TEKAE_DISCOVERY.md`
- `docs/API.md`
- `docs/DATA_MODEL.md`
- `docs/SECURITY.md`
- `docs/TRANSACTION_STATES.md`
- `docs/RECONCILIATION.md`
- `planning/DECISIONS.md`
- `planning/RISKS.md`
- `planning/QUESTIONS.md`
- `planning/STATE.md`

Create new docs only if useful:

- `docs/TEKAE_CONTRACT.md`
- `docs/TEKAE_RUNTIME_READINESS.md`

## Required Output

After changes, report:

1. Files changed.
2. Official Tekae materials reviewed.
3. Contract items confirmed.
4. Contract items unresolved.
5. Readiness gates created.
6. Risks updated.
7. Decisions added.
8. Status updates added.
9. Whether runtime implementation is permitted or still blocked.
10. Recommended next sprint.
