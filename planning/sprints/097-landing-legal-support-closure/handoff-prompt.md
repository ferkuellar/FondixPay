# Sprint 097 — Builder Handoff Prompt

You are implementing Sprint 097: Landing Legal & Support Closure for FONDIXPAY.

## Context

FONDIXPAY has four public landing pages with placeholder values that block production launch and app store submission. The legal pages (`terminos.html`, `privacidad.html`) were drafted by Claude but require human/legal review and real entity data before publish. The contact and support pages need real emails, hours, and a working form endpoint.

**This sprint requires human input before code work begins:**
- Legal entity name, RFC, domicile, support email, ARCO email, legal email, support hours — all must be confirmed by product/legal owner
- Mexican attorney must review and approve `terminos.html` and `privacidad.html` before warning blocks are removed

**Sprint 097 blocks Sprint 098 (store submission)** — Apple and Google require a live privacy policy URL.

## What To Build

1. Replace all `<span class="pend">...</span>` content in all four landing pages with real confirmed values. Check for `.pend` class usage and `[PLACEHOLDER]` patterns.

2. Wire the contact form: replace `form action="#"` with a real submission URL.
   - Check if ADR-198 was recorded with the chosen mechanism. If not, decide and record it.
   - Simplest option: Formspree (no backend needed). Production option: backend endpoint.

3. Remove all `⚠ USO INTERNO — ELIMINAR ANTES DE PUBLICAR` warning blocks from all four pages.

4. After legal attorney has reviewed and approved both legal pages (documented in sprint completion notes), confirm all placeholders are gone.

## Files to Read First

- `landing/terminos.html` — find all `.pend` spans
- `landing/privacidad.html` — find all `.pend` spans
- `landing/soporte.html` — find placeholder patterns
- `landing/contacto.html` — find `form action="#"` and all `.pend` spans
- `planning/DECISIONS.md` — check if ADR-198 exists (contact form mechanism)

## Constraints

- Do not remove warning blocks until attorney has reviewed and approved both legal pages
- Do not publish placeholders — if entity data is not available, block and report
- No backend payment logic changes
- No mobile changes
- `TEKAE_ENABLED` remains false

## Validation

After all placeholders resolved and pages deployed:
```bash
curl -s https://fondixpay.com/terminos | grep -c "class=\"pend\""  # must be 0
curl -s https://fondixpay.com/privacidad | grep -c "class=\"pend\""  # must be 0
curl -s https://fondixpay.com/terminos | grep -c "USO INTERNO"  # must be 0
```

Report: files changed, placeholder count before/after per file, contact form mechanism chosen (ADR-198), attorney sign-off date, and sprint 098 readiness (yes/no).
