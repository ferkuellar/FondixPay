# FONDIX PAY

**FONDIX PAY** is a mobile-first service payment platform for households in Mexico.

The product goal is simple:

> Open the app, see pending household services, pay safely, receive proof of payment, and move on.

FONDIX PAY is being built as a disciplined, auditable financial-product MVP using the **AXON-AI Architect / Builder** methodology. The current repository contains an initial mobile/backend/admin/landing implementation aligned to phased delivery, security hardening, technical documentation, and controlled product evolution.

---

## Current Project Status

**Status:** MVP mock/dev
**Production readiness:** Not ready for financial production
**Real money movement:** Disabled
**Real provider payments:** Disabled
**Real card processing:** Disabled
**Customer-facing launch:** Not approved yet

The current implementation is intended for product validation, UX flow testing, backend/API structure, admin console development, and architecture hardening.

It must **not** be used with real customers, real cards, real service references, real payment settlement, or production financial workflows until the required payment, provider, reconciliation, audit, security, and operational gates are completed.

---

## What FONDIX PAY Does

FONDIX PAY is designed to let users pay common household services in Mexico from a simple mobile experience.

Target payment categories include:

* Electricity
* Water
* Internet
* Mobile top-ups
* Gas
* Other supported domestic services, depending on aggregator coverage

The intended user experience is intentionally boring, in the best possible way:

1. Log in with phone number.
2. Verify OTP.
3. Add a service.
4. See pending amount.
5. Confirm payment.
6. Receive receipt.
7. Review payment history.

No casino UX. No financial mystery meat. No “AI magic” hiding payment state. Just a clean operational flow.

---

## Repository Structure

```txt
fondix-pay/
  admin/                  # Internal CRM/Admin console
  backend/                # FastAPI backend
  mobile/                 # Expo / React Native mobile app
  landing/                # Public commercial landing page
  docs/                   # Durable technical documentation
  planning/               # Roadmap, state, decisions, risks, sprints
  docker-compose.yml      # Local service orchestration
  README.md               # Project entry point
  .env.example            # Example environment variables only
```

---

## Main Documentation

Read these files before changing the system:

| File                                                                     | Purpose                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)                                                 | Canonical operating instructions for Builders and coding agents |
| [`planning/ROADMAP.md`](planning/ROADMAP.md)                             | Official project phases and sequencing                          |
| [`planning/STATE.md`](planning/STATE.md)                                 | Current project state                                           |
| [`planning/DECISIONS.md`](planning/DECISIONS.md)                         | Durable decisions future work must respect                      |
| [`planning/RISKS.md`](planning/RISKS.md)                                 | Known technical, product, operational, and financial risks      |
| [`planning/QUESTIONS.md`](planning/QUESTIONS.md)                         | Open questions blocking future work                             |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)                           | Current documented architecture                                 |
| [`docs/API.md`](docs/API.md)                                             | API surface and contract notes                                  |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)                               | Data model and entity definitions                               |
| [`docs/SECURITY.md`](docs/SECURITY.md)                                   | Security rules, risks, and environment requirements             |
| [`docs/AUDIT.md`](docs/AUDIT.md)                                         | Audit and traceability model                                    |
| [`docs/OPERATIONS.md`](docs/OPERATIONS.md)                               | Operational notes and runbook direction                         |
| [`docs/TECHNICAL_HARDENING_AUDIT.md`](docs/TECHNICAL_HARDENING_AUDIT.md) | Phase 2 technical audit                                         |

---

## Operating Model

This repository follows the **AXON-AI Architect / Builder** delivery model.

The principle is straightforward:

> The source of truth is the project folder, not the chat history.

### Architect Layer

The Architect defines:

* Product scope
* Business rules
* User flows
* Architecture
* Data model
* Security rules
* Risks
* Acceptance criteria
* Sprint blueprint
* Builder handoff prompt

### Builder Layer

The Builder implements only what has been approved in the project files.

The Builder must not:

* Invent business rules
* Redefine payment behavior
* Bypass security rules
* Add production financial behavior without approval
* Remove audit logic
* Hardcode secrets
* Mark incomplete work as complete

---

## Approved Product Boundaries

### In Scope for Current MVP

* Mobile-first service payment UX
* Mock login and OTP validation for development
* Mock service registration
* Mock pending service amounts
* Mock payment confirmation
* Mock receipt generation
* Transaction history views
* Backend API foundation
* Internal CRM/Admin foundation
* Landing page as commercial front door
* Documentation-first delivery
* Security and audit hardening by phases

### Out of Scope Until Explicitly Approved

* Real card charging
* Real Prontipagos execution
* Real settlement
* Real reconciliation
* Real KYC
* Production fraud workflows
* Production WhatsApp notifications
* Production App Store / Play Store release
* Autonomous agents modifying financial state
* Any flow that moves money without full audit and reconciliation

---

## Technology Stack

Current stack direction:

| Layer               | Technology                                                         |
| ------------------- | ------------------------------------------------------------------ |
| Mobile app          | Expo / React Native                                                |
| Backend             | Python / FastAPI                                                   |
| Admin console       | Web frontend consuming backend `/admin/*` APIs                     |
| Landing page        | Static commercial website                                          |
| Database            | PostgreSQL / Supabase direction pending final environment decision |
| Local orchestration | Docker Compose                                                     |
| Authentication      | JWT/session model with development OTP guardrails                  |
| Payments            | Card-only user-facing model, future processor TBD                  |
| Service aggregator  | Prontipagos planned as bill payment aggregator                     |
| Infrastructure      | AWS development environment, Terraform track planned               |
| Deployment          | Landing page planned for Vercel only                               |

---

## Backend

The backend lives in:

```txt
backend/
```

### Local Setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Local API

```txt
GET http://127.0.0.1:8000/health
```

Swagger:

```txt
http://127.0.0.1:8000/docs
```

### Backend Validation

```powershell
cd backend
python -m compileall app
python -m pytest
```

---

## Mobile App

The mobile app lives in:

```txt
mobile/
```

### Local Setup

```powershell
cd mobile
npm install
npm start
```

The real Expo app lives in `mobile/`.

Do **not** run Expo from the repository root.

The mobile start script pins Metro to port `8081`. Expo Go should open the URL printed by Metro, usually something like:

```txt
exp://192.168.1.136:8081
```

The exact IP depends on the current local network.

### Safe Root Scripts

From the repository root:

```powershell
npm run mobile:start
npm run mobile:doctor
npm run mobile:typecheck
```

---

## CRM Admin Console

The internal CRM/Admin console lives in:

```txt
admin/
```

It is intended for operational visibility, support workflows, reconciliation review, manual review, audit visibility, and internal platform administration.

### Local Setup

```powershell
cd admin
npm install
npm run dev
```

The Admin console consumes backend `/admin/*` endpoints from Phase 10B and later phases.

### Current Admin Auth Warning

Current admin access uses an existing backend token model and a clearly marked development frontend role when:

```txt
VITE_ENABLE_ADMIN_DEV_AUTH=true
```

This is for development only.

It does **not** replace hardened admin authentication, production RBAC, audit-safe access control, or production-grade session management.

---

## Public Landing Page

The public landing page lives in:

```txt
landing/
```

The landing page is a static commercial front door for FONDIX PAY.

It may be used for:

* Brand presentation
* App download links
* Waitlist
* Launch status
* Product explanation
* Public trust messaging

It must **not**:

* Process payments
* Authenticate users
* Access the backend financial system
* Access CRM/Admin data
* Store secrets
* Execute service payments
* Collect sensitive financial data

### Local Preview

```powershell
cd landing
python -m http.server 4175
```

The landing page is planned for **Vercel** only as a static public site.

Core backend, payments, reconciliation, admin workflows, secrets, and financial operations must not be hosted in Vercel.

### Pending Public URLs

The following URLs remain placeholders until officially confirmed:

* App Store URL
* Google Play URL
* Support channel
* Terms and conditions
* Privacy notice
* Public production landing URL

Until confirmed, use:

```txt
[PENDING_PUBLIC_LANDING_URL]
```

---

## Docker

From the repository root:

```powershell
docker compose up -d
```

Use Docker for local orchestration only unless a deployment phase explicitly approves production container strategy.

---

## Mock Development Flow

Current mock flow:

1. Open the mobile app.
2. Log in with phone number.
3. Use development OTP:

```txt
123456
```

4. Add a mock service such as CFE, Telmex, Telcel, water, internet, or gas.
5. Tap `Pagar ahora`.
6. Confirm the mock payment.
7. Review the generated mock receipt and transaction history.

### Mock Flow Warning

This flow is only for development and product validation.

It does not:

* Charge cards
* Move real money
* Validate real service references
* Execute Prontipagos payments
* Perform KYC
* Reconcile funds
* Generate tax-valid receipts
* Notify real providers
* Support final customers

---

## Payment Model

FONDIX PAY is **card-only** for user-facing service payments.

Users are expected to pay using:

* Debit card
* Credit card

Service payment execution is expected to use **Prontipagos** as the bill payment aggregator for supported services in Mexico.

Important distinction:

```txt
Card Processor != Bill Payment Aggregator
```

The future card processor charges the user’s card.

Prontipagos executes the service payment against the supported provider catalog.

Unless a future contract/API decision explicitly says otherwise, Prontipagos must be treated as separate from the card processor.

### Current Payment Status

The current implementation remains mock/dev.

No real card processing is enabled.

No real Prontipagos execution is enabled.

No production payment settlement is enabled.

---

## Prontipagos Integration Direction

Prontipagos is the planned bill payment aggregator for:

* Service catalog
* Provider coverage
* Reference validation
* Amount lookup, when supported
* Service payment execution
* Transaction confirmation
* Provider-side response handling

The Prontipagos integration must be built only after the appropriate sandbox design and implementation phases are approved.

Expected future requirements:

* Provider catalog sync
* Coverage-aware service display
* Reference validation
* Idempotent payment execution
* Provider timeout handling
* Pending/processing state handling
* Transaction reconciliation
* Manual review support
* Append-only audit trail

---

## Authentication and Session Security

Current development OTP:

```txt
123456
```

This OTP is allowed only for:

```txt
development
test
```

The backend must only return `otp_dev` when:

```txt
OTP_DEV_RESPONSE_ENABLED=true
```

and:

```txt
APP_ENV=development
```

or:

```txt
APP_ENV=test
```

For staging and production:

* `OTP_DEV_RESPONSE_ENABLED` must be disabled.
* `JWT_SECRET_KEY` must be strong.
* Development OTP must not be exposed.
* Dev auth must not be enabled.
* Admin dev auth must not be enabled.
* Secrets must not be committed.
* Logs must not expose OTPs, tokens, full phone numbers, card data, or provider secrets.

See:

```txt
docs/SECURITY.md
planning/sprints/004a-auth-session-security-p0/COMPLETION_REPORT.md
```

---

## Environment Variables

Use:

```txt
.env.example
```

as a reference only.

Never commit real secrets.

Do not commit:

* API keys
* JWT secrets
* Provider credentials
* Payment processor credentials
* Database passwords
* Webhook secrets
* Production URLs with sensitive tokens
* Private certificates
* Service account keys

Recommended local pattern:

```txt
.env
.env.local
.env.development
```

These files must remain ignored by Git.

---

## Security Rules

Minimum rules for all future work:

* No endpoint without an authorization rule.
* No financial state change without audit.
* No payment action without idempotency.
* No provider integration without timeout and failure handling.
* No real money movement in development mock flows.
* No production secrets in frontend code.
* No raw provider errors shown to users.
* No full phone numbers in logs.
* No card PAN/CVV storage.
* No autonomous agent may change financial state.
* No support workflow may expose sensitive data without role control.
* No release without rollback notes.

---

## Audit Rules

Any action that changes business or financial state must be auditable.

Audit events should answer:

| Question                     | Required        |
| ---------------------------- | --------------- |
| Who did it?                  | Yes             |
| What changed?                | Yes             |
| When did it happen?          | Yes             |
| What entity was affected?    | Yes             |
| What was the previous value? | When applicable |
| What is the new value?       | When applicable |
| Was it successful?           | Yes             |
| What request ID traces it?   | Yes             |
| Was human approval required? | When applicable |

No critical payment, reconciliation, support, or admin workflow should exist without traceability.

---

## Database Direction

The final database decision must be documented in:

```txt
planning/DECISIONS.md
docs/DATA_MODEL.md
docs/ARCHITECTURE.md
```

Current direction:

```txt
PostgreSQL-compatible database
Supabase is a candidate
Managed PostgreSQL is also acceptable depending on deployment constraints
```

Do not treat the database choice as final unless recorded in `planning/DECISIONS.md`.

For financial-style workflows, PostgreSQL is the correct baseline. The important part is not the logo. The important part is schema discipline, migrations, constraints, auditability, backups, and operational ownership.

---

## CRM / Mobile / Backend Relationship

The system should be treated as three separate surfaces consuming a controlled backend:

```txt
Mobile App
  -> Backend API
    -> Database
    -> Payment Processor, future
    -> Prontipagos, future

CRM/Admin Console
  -> Backend Admin APIs
    -> Database
    -> Audit logs
    -> Support/reconciliation/manual review workflows

Landing Page
  -> Public static site only
  -> No financial backend coupling
```

The landing page is commercial.

The mobile app is customer-facing.

The admin console is internal.

The backend owns business rules.

The database owns durable state.

Audit owns accountability.

---

## Current Roadmap Position

The project is currently aligned around these major tracks:

```txt
Fase 0   — Product Definition
Fase 1   — AXON-AI Alignment & Project Operating Pack
Fase 2   — Technical Architecture Hardening
Fase 3   — UI/UX Production System

Fase 4A  — Auth & Session Security P0
Fase 4B  — Backend Safety & Test Foundation
Fase 4C  — UX/Product Risk Register

Fase 5A  — Ledger & Audit Foundation Design
Fase 5B  — Ledger & Audit Implementation
Fase 5C  — Payment Trust & Fee Transparency
Fase 5D  — Card Payment Method Strategy
Fase 5E  — Card Payment UX Mock Implementation
Fase 5F  — Payment Recovery Paths

Fase 6A  — Account & Balance Model Design
Fase 6B  — Simulated Balance Implementation

Fase 7   — Movements, Receipts & Transaction History Hardening

Fase 8A  — Card Processor Sandbox Design
Fase 8B  — Prontipagos Sandbox Integration Design
Fase 8C  — Sandbox Integration Implementation

Fase 9   — Notifications, Receipts & Proof of Payment

Fase 10A — CRM Admin Panel Architecture & RBAC Design
Fase 10B — CRM Admin Panel Backend APIs
Fase 10C — CRM Admin Panel Frontend Implementation
Fase 10D — Support, Reconciliation & Manual Review Workflows

Fase 10D.1 — WhatsApp Receipt Channel Alignment
Fase 10X   — Public Landing Page Integration & Commercial Front Door

Fase 10E — Coverage-Aware Service Catalog Design
Fase 10F — Coverage-Aware Service Catalog Implementation

Fase AWS-1 — Terraform Foundation
Fase AWS-2 — Dev/Staging Deployment
Fase AWS-3 — CI/CD Pipeline

Fase 10G — WhatsApp Payment Receipt MVP Implementation

Fase 11 — Audit, Fraud & Chargeback Readiness
Fase 12 — Integral QA & Regression Gate

Fase AWS-4 — Production Security Hardening
Fase AWS-5 — Production Readiness Review

Fase 13 — Controlled Production Launch
Fase 14 — Store Readiness & Release
Fase 15 — Operations, Monitoring & Support
Fase 16 — Continuous Improvement
Fase 17 — Growth / Optimization / Scale
```

AWS/Terraform is a parallel production-readiness track, not something left until the end.

---

## Recommended Next Phase

Current recommended next phase:

```txt
Fase 4B — Backend Safety & Test Foundation
```

Primary objective:

> Stabilize backend correctness before adding deeper financial behavior.

Recommended focus:

* Test structure
* Error handling
* Health checks
* Logging baseline
* Migration discipline
* API validation
* Backend service boundaries
* Audit foundation
* Safer development defaults

Do not jump into real payments before the backend has enough test, audit, and operational structure. That is how expensive messes are born.

---

## Validation Commands

Backend:

```powershell
cd backend
python -m compileall app
python -m pytest
```

Mobile:

```powershell
npm run mobile:doctor
npm run mobile:typecheck
```

Admin:

```powershell
cd admin
npm install
npm run dev
```

Landing:

```powershell
cd landing
python -m http.server 4175
```

Docker:

```powershell
docker compose up -d
```

---

## First Commit Suggestion

If the latest work corresponds to Phase 4A authentication/session hardening:

```powershell
git add .
git commit -m "phase-4a: harden auth and session security baseline"
```

For README-only update:

```powershell
git add README.md
git commit -m "docs: improve project readme and operating status"
```

---

## Production Readiness Warning

Before any production financial launch, the following must be true:

* Real payment processor contract/API confirmed
* Prontipagos sandbox integration tested
* Payment state machine documented and implemented
* Idempotency implemented
* Ledger/audit model implemented
* Reconciliation workflow implemented
* Manual review workflow implemented
* Chargeback/fraud readiness documented
* Secrets managed outside repo
* Dev auth disabled
* Staging environment validated
* CI/CD pipeline stable
* Database backup/restore tested
* Monitoring and alerting active
* Rollback plan documented
* Legal, privacy, support, and operational ownership confirmed

Until then, this is a serious MVP under construction — not a financial production platform.

---
## License / Ownership

FONDIX PAY is a private software project developed for the FONDIX PAY business initiative.

Unless a separate written agreement states otherwise:

* All product concepts, brand assets, business workflows, payment flows, documentation, source code, UI designs, architecture decisions, and implementation artifacts belong to the FONDIX PAY project owner.
* This repository is private and must not be redistributed, sublicensed, copied, published, or transferred to third parties without explicit written authorization.
* No contributor, contractor, AI coding agent, external consultant, or implementation partner may reuse proprietary project materials outside this project without approval.
* Any third-party libraries, frameworks, SDKs, APIs, fonts, icons, illustrations, payment processors, cloud services, or provider integrations remain subject to their own licenses, contracts, terms of service, and commercial restrictions.
* Credentials, secrets, API keys, payment tokens, service-provider agreements, and customer data are confidential and must never be committed to the repository or shared outside approved operational channels.

### Client / Vendor Delivery Terms

Before external delivery, onboarding of vendors, investor review, production deployment, or handoff to a third-party engineering team, the following must be confirmed in writing:

* Legal owner of the software and intellectual property
* Authorized maintainers and administrators
* Contributor rights and restrictions
* Commercial licensing model, if any
* Confidentiality obligations
* Data protection responsibilities
* Payment processor and aggregator contractual responsibilities
* Support ownership
* Production operation responsibilities
* Termination and handoff conditions

---

## Maintainer Notes

FONDIX PAY must remain simple, auditable, and operationally controlled.

This project handles payment-adjacent workflows. That means the engineering standard is higher than a normal app. Every future change should favor clarity, traceability, and reversibility over speed or cleverness.

### Maintenance Principles

* Keep the system boring where money, identity, audit, and support workflows are involved.
* Prefer explicit state machines over hidden business logic.
* Prefer clear database constraints over assumptions in frontend code.
* Prefer documented decisions over tribal memory.
* Prefer small, reviewable changes over large speculative rewrites.
* Prefer operational safety over feature velocity.
* Do not introduce new services, frameworks, providers, or automation unless the need is documented and approved.
* Do not bypass audit, validation, idempotency, or authorization controls to “move faster.”
* Do not treat mock/dev behavior as production behavior.
* Do not allow AI agents, scripts, or background jobs to modify financial state without explicit rules, logs, and human approval where required.

### Engineering Rule

```txt
Payments punish improvisation.
```

Before adding real payment behavior, make sure the rails exist:

* Authentication
* Authorization
* Audit trail
* Payment state model
* Idempotency
* Ledger logic
* Reconciliation
* Manual review
* Error recovery
* Monitoring
* Rollback path

### Final Standard

Build the rails before driving the train.

FONDIX PAY should be built as a controlled financial operations platform, not as a demo that accidentally became production.

Copyright © 2026 FONDIX PAY.
All rights reserved.

This software, documentation, designs, workflows, and related materials are proprietary and confidential. Unauthorized copying, distribution, modification, public disclosure, or commercial use is strictly prohibited without prior written authorization from the project owner.

### Current License Status

Private / Proprietary
Not open source
All rights reserved
Final legal terms pending formal review


