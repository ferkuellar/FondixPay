# Environment Strategy Pointer

Status: Sprint 018 pointer. The canonical DEV / STAGING / PROD environment strategy now lives in `docs/ENVIRONMENTS.md`.

Use `docs/ENVIRONMENTS.md` for:

- DEV / STAGING / PROD definitions.
- Component matrix.
- Data, secrets, Tekae, and Vercel rules.
- Promotion path, release gates, rollback expectations, and open questions.

This file remains only to preserve older links from Sprint 012/013 documentation. Older language that treated this file as canonical is superseded by Sprint 018.

Current boundary remains unchanged:

- FONDIXPAY is mock/dev and not production-ready.
- Tekae remains disabled/blocked.
- Prontipagos remains removed.
- Vercel is approved only for the public landing page.
- No runtime, provider, payment, infrastructure, workflow, deployment, endpoint, webhook, migration, or secret behavior is changed by Sprint 018 documentation.
