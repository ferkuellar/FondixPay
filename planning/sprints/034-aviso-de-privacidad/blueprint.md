# Sprint 034 — Blueprint

## Files to create

- `landing/privacidad.html` — full Aviso de Privacidad draft page.

## Files to modify

- `landing/index.html` — footer Legal column: `href="#">Privacidad pendiente` → `href="privacidad">Aviso de Privacidad`.
- `landing/terminos.html` — footer privacy link: remove `link-pending` class, replace `href="#"` with `href="privacidad"`, update label. Internal table row 3: update status.
- `planning/STATE.md` — Sprint 034 completion record.

## privacidad.html structure

Follows `terminos.html` exactly for layout, tokens, nav, dark mode IIFE, and footer. Sections follow LFPDPPP mandatory disclosure requirements:

1. Identidad y domicilio del responsable
2. Datos personales que recabamos
3. Finalidades del tratamiento
4. Datos personales sensibles
5. Opciones para limitar el uso o divulgación de tus datos
6. Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)
7. Revocación del consentimiento
8. Transferencia de datos personales
9. Uso de tecnologías de rastreo (cookies)
10. Cambios al Aviso de Privacidad
11. Contacto

## Design notes

- Same `.pend` amber placeholders for: legal entity name, domicile, effective date, contact email, ARCO email.
- Draft banner identical to `terminos.html`.
- Internal-only warning block with pending-items table (10 items) at page bottom.
- Mobile-responsive prose `max-width: 760px`.
- Dark mode via `data-theme` attribute IIFE.
- No external scripts, no analytics, no tracking.
