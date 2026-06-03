# Tekae API Contract

**Status:** EMPTY PLACEHOLDER — Do not populate until official Tekae documentation is received.
**Last updated:** 2026-06-02

---

## Purpose

This document will define the confirmed API contract between FONDIXPAY and Tekae Business once official documentation is provided by Tekae.

**No endpoints, payloads, status codes, or webhooks have been invented.** All sections below are structural placeholders only.

---

## Gate

This document must remain empty until:
- Official Tekae API documentation is obtained and reviewed.
- Open questions in `planning/TEKAE_OPEN_QUESTIONS.md` are resolved.

---

## Sections (To Be Populated)

### Authentication

> TBD — Authentication mechanism is unknown. Possible patterns include API key, OAuth 2.0, or mutual TLS. Do not assume.

### Base URL

> TBD — Sandbox and production base URLs are unknown.

### Endpoints

> TBD — No endpoints will be documented here until confirmed by Tekae.

### Request Format

> TBD — Request content type, envelope structure, and required headers are unknown.

### Response Format

> TBD — Response envelope structure, field names, and types are unknown.

### Status / Result Codes

> TBD — Tekae-specific status codes and their semantics are unknown.

### Error Codes

> TBD — Error code schema is unknown. Do not map to Prontipagos error codes without confirmation.

### Webhooks / Callbacks

> TBD — Whether Tekae supports webhooks, their payload shape, and signature verification method are unknown.

### Idempotency

> TBD — Whether Tekae supports idempotency keys is unknown.

### Rate Limits

> TBD — Rate limit policy is unknown.

### Versioning

> TBD — API versioning strategy is unknown.

---

## Notes

- Do not reuse Prontipagos field names or status mappings as assumptions for Tekae.
- Do not implement against this document until it contains confirmed, sourced content.
- When populated, every field must cite its source (Tekae documentation section or Tekae contact confirmation).
