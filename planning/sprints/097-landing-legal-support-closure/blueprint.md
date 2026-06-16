# Sprint 097 — Blueprint

## Files to Change

### landing/terminos.html
- Replace all `<span class="pend">...</span>` with confirmed values
- Update effective date
- Remove internal `⚠ USO INTERNO` warning block at bottom of file

### landing/privacidad.html
- Replace all `<span class="pend">...</span>` with confirmed values
- Add legal entity name, RFC, domicile, ARCO email, privacy email, effective date
- Remove internal `⚠ USO INTERNO` warning block

### landing/soporte.html
- Replace `[CORREO_SOPORTE]` and `[HORARIO]` placeholders
- Remove internal pending checklist block

### landing/contacto.html
- Replace `form action="#"` with real form submission URL (per ADR-198)
- Replace all `.pend` email, entity, RFC, domicile, hours placeholders
- Remove internal pending checklist block
- If using Formspree: `action="https://formspree.io/f/{form_id}" method="POST"`
- If using backend: `action="/api/public/contact" method="POST"` (requires backend endpoint sprint)

## Contact Form Backend (if backend endpoint chosen):

### backend/app/modules/public/contact_routes.py (new)
- `POST /api/public/contact` — rate limited, validates fields, sends email via Resend/SMTP
- Fields: tipo, nombre, telefono, correo, folio (optional), mensaje
- Rate limit: 5 submissions per IP per hour
- Returns 200 on success, 429 on rate limit, 422 on validation error

## Deployment

Landing deploys to Vercel on push to `main`. No special CI action needed — Vercel auto-deploys.

After deploy:
```bash
curl -s https://fondixpay.com/terminos | grep -c "pend"
# must return 0
curl -s https://fondixpay.com/privacidad | grep -c "pend"  
# must return 0
```

## What Product/Legal Must Provide Before Implementation

| Item | Owner | Required For |
|------|-------|--------------|
| Legal entity name | Product/Legal | All 4 pages |
| RFC | Product/Legal | terminos + privacidad |
| Domicilio legal | Product/Legal | terminos + privacidad + contacto |
| soporte@ email | Product | soporte + contacto |
| privacidad@ email | Legal | privacidad + contacto |
| legal@ email | Legal | contacto |
| Support hours | Product | soporte + contacto |
| Effective date | Legal | terminos + privacidad |
| Attorney approval | Legal | Required before publish |
| Form action URL | Product/Tech | contacto |
