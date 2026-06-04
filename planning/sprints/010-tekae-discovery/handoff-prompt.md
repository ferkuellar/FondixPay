# Sprint 010 — Tekae Discovery Builder Handoff Prompt

You are a senior software architect, payment integration analyst, backend engineer, and software quality auditor working on FONDIXPAY.

This is a documentation and architecture sprint only.

Do not implement code.
Do not create database migrations.
Do not configure real credentials.
Do not build webhook endpoints yet.
Do not modify runtime payment behavior.

Read these files first:

1. AGENTS.md
2. planning/STATE.md
3. planning/DECISIONS.md
4. planning/DOMAIN.md
5. planning/RISKS.md
6. planning/QUESTIONS.md
7. docs/ARCHITECTURE.md
8. docs/API.md
9. docs/DATA_MODEL.md
10. docs/SECURITY.md
11. docs/TRANSACTION_STATES.md
12. Active sprint files under planning/sprints/010-tekae-discovery/

Then create or update only documentation files required for Sprint 010.

Required outputs:

1. docs/TEKAE_DISCOVERY.md
2. Updated docs/ARCHITECTURE.md
3. Updated docs/SECURITY.md
4. Updated docs/TRANSACTION_STATES.md
5. Updated docs/RECONCILIATION.md if it exists, otherwise create it
6. Updated docs/API.md with proposed future contracts only
7. Updated planning/DECISIONS.md
8. Updated planning/RISKS.md
9. Updated planning/QUESTIONS.md
10. Updated planning/STATE.md

Rules:

- Preserve the decision that Prontipagos is permanently removed.
- Preserve the decision that Tekae is the approved provider.
- Preserve the decision that FONDIXPAY is not fintech.
- Treat Tekae SSO as the current documented integration model.
- Clearly mark webhook, reconciliation, and transaction query capabilities as unresolved unless source documentation proves otherwise.
- Do not invent Tekae API behavior.
- Do not expose or request secrets in files.
- Redact token/URL examples where appropriate.
- Every payment-state statement must avoid overclaiming success without provider confirmation.

After changes, report:

1. Files changed.
2. Key architecture decisions recorded.
3. Open questions still blocking implementation.
4. Risks introduced or clarified.
5. Whether acceptance criteria are met.
6. Recommended next sprint.
