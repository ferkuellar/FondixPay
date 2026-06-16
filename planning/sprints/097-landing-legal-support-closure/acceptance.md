# Sprint 097 — Acceptance Criteria

## Placeholder Resolution

- [ ] Zero `.pend`-styled amber spans remain in any published landing page
- [ ] `[NOMBRE_LEGAL]` replaced with confirmed legal entity name
- [ ] `[RFC]` replaced with confirmed RFC
- [ ] `[DOMICILIO_LEGAL]` replaced with confirmed address
- [ ] `[CORREO_SOPORTE]`, `[CORREO_PRIVACIDAD]`, `[CORREO_LEGAL]` all replaced with real emails
- [ ] `[HORARIO]` replaced with confirmed support hours
- [ ] Effective dates filled in both `terminos.html` and `privacidad.html`

## Legal Review

- [ ] Attorney has reviewed `landing/terminos.html` — sign-off documented in sprint completion notes
- [ ] Attorney has reviewed `landing/privacidad.html` — sign-off documented
- [ ] Any attorney-requested changes implemented before removing warning blocks

## Contact Form

- [ ] `landing/contacto.html` form action points to a real submission endpoint (not `#`)
- [ ] Form submission returns success message (not a browser navigation error)
- [ ] ADR-198 recorded: which form submission mechanism was chosen

## Warning Block Removal

- [ ] No `⚠ USO INTERNO` warning blocks in any published HTML (terminos, privacidad, soporte, contacto)
- [ ] Internal pending-items tables removed from all pages

## Landing Smoke Tests

- [ ] `curl https://fondixpay.com/terminos` → HTTP 200, body contains legal entity name, no `.pend` text
- [ ] `curl https://fondixpay.com/privacidad` → HTTP 200, body contains legal entity name, no `.pend` text
- [ ] `curl https://fondixpay.com/soporte` → HTTP 200, support email visible
- [ ] `curl https://fondixpay.com/contacto` → HTTP 200, form present

## Store Readiness Gate

- [ ] `https://fondixpay.com/privacidad` resolves publicly — this URL will be used in store listings (Sprint 098)
- [ ] `https://fondixpay.com/terminos` resolves publicly
