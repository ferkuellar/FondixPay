# FONDIXPAY CRM DESIGN LOCK

The CRM design handoff located at:

`docs/design-reference/crm/design_handoff_crm/`

is the frozen visual source of truth for the FONDIXPAY CRM/admin interface.

## Rule

This design must be implemented faithfully.

Do not redesign, reinterpret, modernize, simplify, beautify, or replace the design language.

## Source of truth

Visual references:

- `design_handoff_crm/screenshots/`

Implementation references:

- `design_handoff_crm/source/colors_and_type.css`
- `design_handoff_crm/source/crm-app.jsx`
- `design_handoff_crm/source/crm-atoms.jsx`
- `design_handoff_crm/source/crm-data.js`
- `design_handoff_crm/source/crm-views-1.jsx`
- `design_handoff_crm/source/crm-views-2.jsx`
- `design_handoff_crm/source/crm-views-3.jsx`
- `design_handoff_crm/source/tweaks-panel.jsx`

## Allowed

- Convert the provided source into the current frontend structure.
- Create reusable React components.
- Separate mock data from UI components.
- Fix technical integration issues.
- Preserve responsive behavior.
- Preserve light/dark theme behavior.

## Not allowed

- New color palette.
- New typography.
- New icon style.
- Different spacing.
- Different cards.
- Different shadows.
- Different border radius.
- Different navigation.
- Different table design.
- New UX decisions not present in the handoff.
- Real payment execution.
- Real Prontipagos integration.
- Real KYC execution.
- Production auth changes.
- Secrets or credentials.

## Priority

If screenshots and code conflict, screenshots win.

If the current app style and the CRM handoff conflict, the CRM handoff wins.

If something is ambiguous, preserve the closest visual behavior from the handoff.
