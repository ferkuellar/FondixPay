# Sprint 036 — Public Contact Page Draft: Completion Report

Date: 2026-06-12

## Status: COMPLETED

## Files Changed

| File | Action |
|------|--------|
| `landing/contacto.html` | Created — full contact page |
| `landing/index.html` | Modified — footer contact link wired |
| `landing/terminos.html` | Modified — footer contact link added |
| `landing/privacidad.html` | Modified — footer contact link added |
| `landing/soporte.html` | Modified — footer contact link added |
| `planning/STATE.md` | Modified — Phase 036 completion record added |
| `planning/RISKS.md` | Modified — Phase 036 risks section added |
| `planning/sprints/036-public-contact-page/` | Created — requirements.md, COMPLETION_REPORT.md |

## Implementation Notes

- Layout: two-column CSS grid (`2fr 1fr`, collapses to single column at ≤768px), `max-width: 1000px` container.
- Form action is `#`; JS `e.preventDefault()` on submit shows a clearly-labeled stub notice.
- Folio field (`id="folioGroup"`) hidden by default; shown only for `soporte_pago` and `aclaracion_reembolso` tipos.
- Contextual hint box (`id="hintBox"`, `aria-live="polite"`) updates per tipo selection via vanilla JS.
- All unresolved values use `.pend` amber style — no invented data.
- Internal checklist uses `.internal-block` red-bordered style (10 items).
- Cookie consent banner added before `</body>`.
- Dark mode CSS coverage via `[data-theme="dark"]` selectors throughout.
- URL convention: all internal links use relative paths without leading slash (`privacidad`, `terminos`, `soporte`, `contacto`) per project convention.

## Decision Boundary Preserved

- No backend endpoint created.
- No third-party form service integrated.
- No invented contact data.
- No changes to `mobile/`, `backend/`, admin, infrastructure, or payment flows.
- Tekae remains disabled. Prontipagos not reintroduced.

## Publication Blockers (all marked `.pend`)

1. `[FORM_ACTION]` — form submission endpoint (requires approved sprint)
2. `[CORREO_SOPORTE]` — support email
3. `[CORREO_PRIVACIDAD]` — ARCO/privacy email
4. `[CORREO_LEGAL]` — legal email
5. `[NOMBRE_LEGAL]` — legal entity name
6. `[DOMICILIO_LEGAL]` — registered address
7. `[RFC]` — entity RFC
8. `[HORARIO]` — support hours

## Next Sprint Options

- Sprint 037: Resolve publication blockers (legal entity data, emails, support hours, form endpoint decision)
- Sprint 037: Tekae discovery / sandbox credential integration
- Sprint 037: Mobile OTP or receipt flow
