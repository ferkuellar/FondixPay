# Sprint 034 — Aviso de Privacidad Draft

## Objective

Create a public-facing Aviso de Privacidad draft for FondixPay under `landing/privacidad.html`, wire the footer privacy links in `landing/index.html` and `landing/terminos.html`, and mark the Aviso de Privacidad pending-item row in `terminos.html` as created.

## Scope

### In scope

- `landing/privacidad.html` — Spanish LFPDPPP-compliant privacy notice draft with the same design system as `terminos.html`.
- Footer link update in `landing/index.html`: replace `Privacidad pendiente` (`href="#"`) with `Aviso de Privacidad` (`href="privacidad"`).
- Footer link update in `landing/terminos.html`: replace `link-pending` privacy placeholder with `href="privacidad"`.
- Internal table row 3 in `terminos.html` updated to reflect that the Aviso de Privacidad draft now exists.
- `planning/STATE.md` updated with Sprint 034 completion record.

### Out of scope

- Backend code, endpoints, migrations, schemas, or runtime behavior.
- Mobile code or payment logic.
- Admin/CRM code.
- Infrastructure, Terraform, GitHub Actions, or deployment behavior.
- Real legal advice or final legal entity name.
- Aviso de Privacidad for cookies beyond draft notice.
- WhatsApp or email delivery of privacy notice.
- Real Tekae integration or provider behavior.
- Prontipagos (permanently removed).

## Constraints

- The document is a draft base for review by a qualified Mexican attorney and must include a clear internal-only warning block.
- Pending placeholders (legal entity name, contact email, effective date, DPA authority details) must use the `.pend` amber style — no invented legal entities or emails.
- Product must be positioned as a services/payments platform, not a bank, wallet, IFPE, fintech, lender, or investment entity.
- Design must be identical to `landing/terminos.html` (tokens, nav, dark mode, footer, draft banner, internal-only block).
- `Tekae` must not be named as a provider in the public privacy notice body.
- `Prontipagos` must not appear.
- No new dependencies introduced.
