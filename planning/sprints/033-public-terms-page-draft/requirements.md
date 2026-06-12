# Sprint 033 — Public Terms Page Draft: Requirements

## Goal

Create a draft Spanish Terms & Conditions page at `/terminos` for the public landing, matching the design system of index.html, with all pending legal values marked with amber `.pend` placeholders.

## Context

The landing footer's "Términos" link was broken. Sprint 033 creates the terms page as a draft — not legally reviewed, not production-ready — with a visible pre-launch checklist block that must be removed before public release. Legal content requires qualified Mexican attorney review before publication.

## Scope

- Create `landing/terminos.html`:
  - 20-section Spanish T&C draft.
  - Same design tokens, nav, and footer as index.html.
  - Dark-mode IIFE.
  - Pending placeholder styling with amber `.pend` markers.
  - Internal-only pre-launch checklist block (clearly marked for removal before production).
- Update `landing/index.html` footer Legal link: `Términos pendientes → terminos`.
- Update planning/STATE.md.

## Out of Scope

- No legal placeholders filled (name, RFC, domicile, emails, etc.).
- No backend, mobile, or payment changes.
- This page must not be presented as legally reviewed or production-ready.

## Acceptance Criteria

- `terminos.html` exists and renders consistently with the rest of the landing.
- Footer link in index.html points to `terminos`.
- Pre-launch checklist block is present and marked internal-only.
- No legal placeholders filled with real values.
