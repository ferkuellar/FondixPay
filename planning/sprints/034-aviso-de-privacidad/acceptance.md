# Sprint 034 — Acceptance Criteria

1. `landing/privacidad.html` exists and is valid HTML with `lang="es"`.
2. Page title is "Aviso de Privacidad — FONDIX PAY".
3. Page links to `colors_and_type.css` and `assets/logo-fondix-pay.png` correctly.
4. Draft warning banner is present with amber styling.
5. Document header shows title, status, and pending date/entity placeholders.
6. All 11 LFPDPPP sections are present and non-empty.
7. Sections include: Identidad del responsable, Datos que recabamos, Finalidades, Datos sensibles, Opciones de limitación, Derechos ARCO, Revocación, Transferencias, Cookies, Cambios, Contacto.
8. Pending placeholders use the `.pend` amber style — no invented legal entities, emails, or jurisdictions.
9. `Tekae` does not appear in user-facing body text.
10. `Prontipagos` does not appear anywhere.
11. Dark mode IIFE (`fp-theme`) is present and works.
12. Nav bar includes back-to-home link and theme toggle.
13. Footer includes link to `terminos` and link to `/`.
14. Internal-only warning block is clearly marked with red border and `⚠ USO INTERNO — ELIMINAR ANTES DE PUBLICAR` heading.
15. Internal pending-items table lists at least 8 pre-launch blockers.
16. Page is mobile-responsive (640px breakpoint).
17. `landing/index.html` footer privacy link points to `privacidad` (no longer `#`).
18. `landing/terminos.html` footer privacy link points to `privacidad` (no longer `link-pending`).
19. `landing/terminos.html` internal table row 3 reflects that the draft now exists.
20. No backend, mobile, admin, migration, endpoint, Tekae runtime, infrastructure, or deployment files were changed.
