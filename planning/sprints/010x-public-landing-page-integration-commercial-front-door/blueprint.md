# Phase 10X Blueprint

## Implementation Shape

Use the static HTML web kit from the design system ZIP instead of migrating to React. The landing is content-first, SEO-friendly, and does not need runtime state or backend integration.

## Files

- `landing/index.html`: static public landing.
- `landing/assets/`: copied visual assets.
- `landing/fonts/`: copied brand font.
- `landing/colors_and_type.css`: design tokens.
- `landing/vercel.json`: static hosting headers.
- `landing/.env.example`: public placeholders only.
- `docs/PUBLIC_LANDING_PAGE.md`: operational and security boundary.

## Copy Controls

Remove or replace claims that imply:

- live payments,
- live app store availability,
- official support,
- WhatsApp receipt delivery,
- zero fees,
- CNBV/IFPE/regulatory status,
- SPEI/CoDi payment rails,
- production reviews/users.

## Separation Controls

The landing must not import from or reference:

- `mobile/`,
- `backend/`,
- `admin/`,
- `/admin/*`,
- payment APIs,
- user account APIs,
- receipt APIs,
- provider APIs.

