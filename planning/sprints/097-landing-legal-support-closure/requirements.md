# Sprint 097 — Landing Legal & Support Closure

## Why This Sprint Exists

Blocks B-07 (SEV-2). The public landing (`fondixpay.com`) has four legal/support pages (`terminos.html`, `privacidad.html`, `soporte.html`, `contacto.html`) with unresolved `.pend` placeholders. App Store and Google Play both require a live, functional privacy policy URL. No landing page can go public while placeholders remain. Legal review is a prerequisite for both production launch and store submission.

## Blockers Closed

- B-07: Landing legal pages have unresolved placeholders (SEV-2)

## Scope

1. **Resolve all `.pend` placeholders** across all four landing pages:
   - `[NOMBRE_LEGAL]` — Legal entity name
   - `[RFC]` — Fiscal registration number
   - `[DOMICILIO_LEGAL]` — Registered legal/fiscal address
   - `[CORREO_SOPORTE]` — Support email (e.g., soporte@fondixpay.com)
   - `[CORREO_PRIVACIDAD]` — ARCO/privacy rights email
   - `[CORREO_LEGAL]` — Legal contact email
   - `[HORARIO]` — Support hours
   - `[FORMA_EFECTIVA]` / `[FECHA_EFECTIVA]` — Effective date of terms/privacy
   - `[FORM_ACTION]` — Contact form submission endpoint

2. **Legal review sign-off:** A qualified Mexican attorney specializing in LFPDPPP must review and approve:
   - `landing/terminos.html` — Términos y Condiciones
   - `landing/privacidad.html` — Aviso de Privacidad
   - Both must be approved before removing internal pending warning blocks

3. **Contact form wiring:**
   - Replace `form action="#"` in `landing/contacto.html` with a real submission endpoint
   - Options (requires decision ADR-198): Formspree, Resend, backend `POST /api/public/contact`, or similar
   - On successful submission, show confirmation message (already has JS stub in place)
   - Failure: show error message with fallback email address

4. **Remove internal pending warning blocks:**
   - All `⚠ USO INTERNO — ELIMINAR ANTES DE PUBLICAR` warning blocks in all four pages must be removed after placeholders are resolved and legal review is complete

5. **Landing smoke test:**
   - `curl https://fondixpay.com/terminos` must return 200 with no `.pend` text in body
   - `curl https://fondixpay.com/privacidad` must return 200 with no `.pend` text
   - Contact form submission returns 200 and shows confirmation message

## Out of Scope

- New landing pages
- Mobile code changes
- CRM changes
- Backend payment logic

## External Dependencies (Both Required)

- Human/legal: Attorney must review and approve legal pages before this sprint can be marked complete
- Human/product: Legal entity name, RFC, domicile, support email, ARCO email, support hours must be confirmed

## Constraint

This sprint MUST complete before Sprint 098 (store submission) — Apple and Google both require a live privacy policy URL in the store listing.
