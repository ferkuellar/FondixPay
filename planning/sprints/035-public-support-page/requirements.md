# Sprint 035 — Public Support Page Draft

## Objective

Create a public Soporte page for the FONDIXPAY landing at `/soporte`, wire footer support links, and keep all unresolved operational placeholders visibly marked.

## Scope

### In scope

- `landing/soporte.html` — Spanish support page with hero, channels, how-it-works, payment-state table, FAQ accordion, antifraud block, internal pending checklist, cookie banner, dark mode.
- Footer link update in `landing/index.html`: `Soporte pendiente` → `Soporte` (`href="soporte"`).
- Footer strip update in `landing/terminos.html` and `landing/privacidad.html`: add Soporte link.
- `planning/STATE.md` Sprint 035 completion record.

### Out of scope

- In-app support workflow, ticketing, email sending, chat, WhatsApp integration.
- Payment processing, refund engine, reconciliation, Tekae runtime.
- Backend code, endpoints, migrations, schemas, mobile code, admin/CRM code.
- Infrastructure, Terraform, deployment, workflow behavior.
- Invented support email, invented support hours, 24/7 claims, guaranteed SLAs.
- Fintech/wallet/banking claims.
- Prontipagos (permanently removed).

## Constraints

- Support email placeholder must use `.pend` amber style — no invented address.
- Support hours placeholder must use `.pend` — no invented hours, no 24/7.
- Product positioned as services/payments platform — not a bank, wallet, IFPE, fintech.
- No new dependencies (FAQ uses native `<details>`/`<summary>`).
- Internal pending checklist must be clearly marked for removal before public release.
- Design consistent with `terminos.html` and `privacidad.html`.
