# Public Landing Page

## Purpose

The FondixPay public landing page is the commercial front door for the brand. It presents the product, explains the future mobile app, communicates the launch state, and provides placeholders for future download and public support URLs.

It is not part of the transactional product.

## Scope

- Public marketing and product education.
- Static HTML/CSS assets based on the delivered `FONDIX PAY Design System.zip`.
- Vercel-compatible public hosting.
- Future download and legal URL placeholders.
- Public launch/waitlist positioning.

## Out of Scope

- Payment processing.
- Card handling or tokenization.
- User login.
- Backend API access.
- CRM/Admin access.
- Prontipagos execution.
- Card processor integration.
- Ledger, audit, receipt, reconciliation, or wallet runtime.
- Secrets or private tokens.

## Hosting

Vercel is approved only for the public landing page under `landing/`.

Vercel must not host:

- backend financial APIs,
- payment provider logic,
- CRM/Admin,
- reconciliation,
- provider credentials,
- secrets,
- private user data,
- ledger or audit runtime.

## Folder Structure

```txt
landing/
  README.md
  index.html
  colors_and_type.css
  assets/
    coverage-data.js
  fonts/
  .env.example
  vercel.json
```

## Source Design

The visual source is `FONDIX PAY Design System.zip`. The ZIP remains external and unmodified. The landing copies the static web kit and required assets into `landing/` as a standalone commercial front door.

Technical adjustments are limited to:

- local asset path correction,
- unsupported claim removal,
- pending URL placeholders,
- copy alignment with mock/dev product status.
- official public coverage data wiring from `FONDIXPAY_Cobertura_Por_Estado.xlsx`.

The source README/SKILL files from the ZIP are not published in `landing/` because they contain internal design-system guidance and source copy that may not match the current launch constraints.

## Public Coverage Source

The landing includes official public coverage by state from `FONDIXPAY_Cobertura_Por_Estado.xlsx`, confirmed by the product owner as original coverage approved and consulted with Prontipagos.

The generated public file is `landing/assets/coverage-data.js`.

Public fields included:

- state name and state code,
- total services by state,
- national service count,
- state-specific service count,
- service area,
- service name,
- coverage type.

Fields intentionally excluded from the public landing:

- internal utility/margin,
- provider payloads,
- user data,
- transaction data,
- PAN/CVV,
- tokens,
- secrets.

This coverage is public commercial information only. It does not enable real payments, does not call Prontipagos, and does not replace the future coverage-aware service catalog inside the transactional app.

## Required Placeholders

- `[PENDING_PUBLIC_LANDING_URL]`
- `[PENDING_APP_STORE_URL]`
- `[PENDING_PLAY_STORE_URL]`
- `[PENDING_SUPPORT_CHANNEL]`
- `[PENDING_PRIVACY_NOTICE_URL]`
- `[PENDING_TERMS_URL]`

## Content Rules

Allowed:

- FondixPay product overview.
- Mobile app launch preparation.
- Card-only payment strategy.
- Future app downloads as placeholders.
- Public launch status.
- General benefit copy that does not imply production availability.

Prohibited until approved:

- "Paga ahora".
- Login or account access.
- Real transaction access.
- CRM/Admin links.
- Production payment claims.
- CNBV, IFPE, PCI, tokenization, or "100% secure" claims unless implemented and approved.
- WhatsApp/support channels as official unless confirmed.
- Final app store, terms, privacy, or support URLs without confirmation.

## Security Rules

- No secrets.
- No private environment variables.
- No backend tokens.
- No payment APIs.
- No PAN/CVV.
- No provider payloads.
- No user data.
- No admin links.
- No analytics that require secrets until approved.

## Publication Checklist

- Static page loads from `landing/index.html`.
- Asset paths are local and resolve.
- Coverage data loads from `landing/assets/coverage-data.js`.
- Public coverage excludes internal utility, charges, user data, tokens, and provider payloads.
- No links point to unconfirmed final channels.
- Required placeholders are visible in source/config.
- No payment, login, CRM, or backend action exists.
- Vercel deployment root is `landing`.
- Production commercial status remains blocked in docs.

## Risks

- Marketing copy can imply production readiness before controls exist.
- App store/support/legal URLs may be published before confirmation.
- Vercel may be misused for sensitive runtime.
- Landing may drift into payment or account flows if boundaries are not enforced.
## Coverage Map And Catalog Boundary

The public coverage map is allowed as a commercial/reference layer for the landing page. It is not a payment availability guarantee and must not decide which services are payable in the mobile app.

Rules:

- The map can show public coverage by state and category.
- The map must include disclaimer language when coverage is broader than payable mobile catalog.
- The map must not expose transactional backend, CRM, admin data, provider credentials, raw provider payloads, or user data.
- Future map data should come from the validated coverage-aware service catalog.
- Mobile payable services must remain stricter than public coverage display.

Required disclaimer:

`Cobertura referencial sujeta a disponibilidad del proveedor. Servicios disponibles para pago se habilitaran conforme a validacion operativa.`
