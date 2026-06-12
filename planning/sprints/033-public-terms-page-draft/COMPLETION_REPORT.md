# Sprint 033 — Public Terms Page Draft: Completion Report

Date: 2026-06-11
Commit: d9bbc16

## Status: COMPLETED

## Files Changed

| File | Action |
|------|--------|
| `landing/index.html` | Modified (footer Legal link updated) |
| `landing/terminos.html` | Created |
| `planning/STATE.md` | Modified |

## Implementation Notes

- `terminos.html`: 20-section Spanish T&C draft at `/terminos` (Vercel cleanUrls).
- Same design tokens, nav, footer as index.html. Dark-mode IIFE included.
- Pending placeholder styling with amber `.pend` markers throughout.
- Internal-only pre-launch checklist block clearly marked for removal before production.
- No legal placeholders filled. Document requires qualified Mexican attorney review before public release.
- footer link in index.html: "Términos pendientes" → `href="terminos"`.

## Decision Boundary

- Landing HTML only. No backend, mobile, payment, provider, migration, or deployment changes.
- No legal entity values (name, RFC, domicile, emails) committed.
