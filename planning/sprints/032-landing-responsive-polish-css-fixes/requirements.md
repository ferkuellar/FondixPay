# Sprint 032 — Landing Responsive Polish + Critical CSS Bug Fixes: Requirements

## Goal

Fix critical CSS rendering bugs in the public landing page and add mobile-responsive layout support — including hamburger nav, grid collapses, hero breakpoints, and correcting invalid placeholder values.

## Context

The public landing (index.html) had several categories of bugs surfaced during review:
1. CSS placeholder values (`Pend.px`) rendering as invalid sizes.
2. Duplicate CSS blocks inflating the stylesheet.
3. Undefined CSS variables causing visual gaps.
4. No mobile responsive collapse for key grid sections.
5. Misrepresented streaming logos using real operator SVGs recolored with CSS filters.
6. `[PENDING_*]` literal href values breaking navigation.

## Scope

- Fix five `Pend.px` placeholder values in CSS (float, phone-amt, phone-bubble, theme-toggle, tap-dot).
- Remove duplicate chatbot CSS block.
- Replace three undefined CSS variables with literal hex values from design tokens.
- Add mobile responsive collapse for `.scenes` and `.steps` grids at ≤640px.
- Add hero intermediate breakpoint at ≤900px.
- Add mobile hamburger nav with aria-expanded toggle and click-outside-to-close.
- Add brand logo mobile size override and hide-mobile utility class.
- Remove five misrepresented streaming logos (Netflix, Spotify, HBO Max, Disney+, Prime Video).
- Replace all `[PENDING_*]` literal href values with safe in-page anchors.
- Replace broken Prep. star-rating widget with amber status badge.
- Remove Prontipagos references from landing/README.md and coverage-data.js.
- Update planning/STATE.md.

## Out of Scope

- No backend, mobile, or payment changes.
- Legal placeholder values (`[NOMBRE_LEGAL]`, `[RFC]`, etc.) not resolved in this sprint.

## Acceptance Criteria

- No `Pend.px` or `[PENDING_*]` values remain in index.html.
- Page renders correctly on mobile viewport.
- Hamburger nav functional (aria-expanded toggle, click-outside close).
- Prontipagos fully removed from landing assets.
