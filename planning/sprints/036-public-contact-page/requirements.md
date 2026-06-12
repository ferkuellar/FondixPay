# Sprint 036 — Public Contact Page Draft: Requirements

## Goal

Create a public-facing `/contacto` page on the FONDIXPAY landing site. The page must provide a contact form (stub, no backend), a sidebar with channel information and legal placeholders, an antifraud block, and an internal pending checklist. No production submission must be implied.

## Scope

- Create `landing/contacto.html` (maps to `/contacto` via Vercel `cleanUrls: true`).
- Wire footer contact links in `index.html`, `terminos.html`, `privacidad.html`, and `soporte.html`.
- Update `planning/RISKS.md` with Phase 036 contact risks.
- Update `planning/STATE.md` with Phase 036 completion record.

## Out of Scope

- Do not implement backend contact endpoint.
- Do not implement Formspree, Netlify Forms, Resend, SendGrid, SMTP, CRM, ticketing, or chat integration.
- Do not invent support email, privacy email, legal email, legal entity name, RFC, legal domicile, or support hours.
- Do not claim 24/7 support or guaranteed response times.
- No changes to `mobile/` or `backend/`.
- No new provider integrations.
- No deployment or infrastructure changes.

## Form Fields

1. Tipo de consulta (select): soporte_pago, aclaracion_reembolso, reporte_fraude, arco_privacidad, consulta_legal, otro
2. Nombre (text, required)
3. Teléfono (tel, required)
4. Correo electrónico (email, optional)
5. Folio (text, conditional: visible only for soporte_pago / aclaracion_reembolso)
6. Mensaje (textarea, required)
7. Consent checkbox (links to `privacidad`)

## Placeholder Values

All unresolved values use `.pend` amber style marker:

- `[FORM_ACTION]` — form submission endpoint
- `[CORREO_SOPORTE]` — support email
- `[CORREO_PRIVACIDAD]` — ARCO/privacy email
- `[CORREO_LEGAL]` — legal email
- `[NOMBRE_LEGAL]` — legal entity name
- `[DOMICILIO_LEGAL]` — registered address
- `[RFC]` — entity RFC
- `[HORARIO]` — support hours

## Acceptance Criteria

- Page renders at `/contacto` with no broken links.
- Form intercepts submit with JS `e.preventDefault()`, shows stub notice — no production submission claimed.
- Folio field shows/hides correctly per tipo selection.
- Contextual hint box updates per tipo selection.
- All placeholder values use `.pend` amber style.
- Internal pending checklist uses `.internal-block` red-bordered style.
- Cookie consent banner present.
- Dark mode CSS coverage complete.
- Footer navigation consistent with all other landing pages.
- No invented emails, hours, or legal data.
