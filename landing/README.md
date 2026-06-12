# FondixPay Public Landing

This folder contains the public commercial front door for FondixPay.

It is a static landing page copied from the delivered Claude Design system ZIP and adjusted for the current product state. It does not process payments, does not access user data, does not call the backend, and does not connect to CRM/Admin.

## Scope

- Public brand and product presentation.
- Public coverage by state, embedded directly in the landing page as static service data.
- Future mobile app download placeholders.
- Public launch/waitlist copy placeholders.
- Vercel-compatible static hosting.

## Out of Scope

- No real payments.
- No card handling.
- No login.
- No backend financial logic.
- No CRM/Admin access.
- No ledger, receipts, reconciliation, or card processor logic.
- No secrets or private environment variables.

## Coverage Data

Coverage data (state names, service counts, service areas) is embedded as a static JS object directly inside `index.html`. No external coverage file is loaded.

The coverage section is informational only. It does not enable real payments and does not call the backend.

## Chatbot

The floating chat bot calls `/api/public/chat` (POST). This endpoint is not yet implemented in the backend. Until it exists, the bot displays a safe fallback message. No real AI or support is connected.

## Local Preview

Open `landing/index.html` directly in a browser, or serve the folder with any static server.

Example:

```powershell
cd landing
python -m http.server 4175
```

Then open `http://127.0.0.1:4175`.

If that port is already in use, choose another local port, for example:

```powershell
python -m http.server 4185
```

## Vercel

Vercel is approved only for this public static landing page. It must not host the backend, admin panel, payment logic, CRM, reconciliation, secrets, or financial runtime.

Suggested Vercel settings:

- Project root: `landing`
- Framework preset: Other
- Build command: leave empty
- Output directory: `.`

## Pending Placeholders

All `[PENDING_*]` href values have been replaced with safe in-page anchors (`#descarga`, `#`, `/`). The following must be wired before public launch:

- App Store URL (store badge href)
- Google Play URL (store badge href)
- Official support/contact channel (social icons + footer)
- Privacy notice URL (footer Legal)
- Terms of service URL (footer Legal)

## Before Publishing

- Confirm app store URLs.
- Confirm privacy notice and terms URLs.
- Confirm official public support/contact channel.
- Confirm `assets/coverage-data.js` still matches the latest approved public coverage source.
- Review all claims for legal, security, and product accuracy.
- Confirm no payment/login/admin/backend links are exposed.
- Confirm no secrets exist in this folder.
