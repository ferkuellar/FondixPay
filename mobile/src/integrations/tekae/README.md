# Tekae Integration Shell

**Status:** SHELL ONLY — No implementation. Blocked pending official Tekae documentation.
**Last updated:** 2026-06-02

---

## Purpose

This directory is a safe structural placeholder for the future Tekae Business integration. It contains:

- TypeScript type stubs (no API calls)
- Feature flag constants (`TEKAE_ENABLED=false`)
- Error class stubs
- A status mapper placeholder that throws if called

**None of these files make network calls. None contain Tekae API endpoints. None contain credentials.**

---

## Implementation Gate

No file in this directory may be changed from placeholder to real implementation until:

1. All 14 open questions in `planning/TEKAE_OPEN_QUESTIONS.md` are resolved.
2. `docs/integrations/TEKAE_API_CONTRACT.md` is populated with official Tekae documentation.
3. `docs/integrations/TEKAE_SECURITY.md` is signed off.
4. Sprint `008b-tekae-integration-discovery` acceptance criteria are met.
5. A new implementation sprint is created and approved.
6. `TEKAE_ENABLED` is explicitly approved and set to `true`.

---

## Files

| File | Purpose |
|---|---|
| `constants.ts` | Feature flags — `TEKAE_ENABLED=false`, `TEKAE_MODE='disabled'` |
| `types.ts` | TypeScript type stubs — shapes TBD from official docs |
| `errors.ts` | Error class stubs — `TekaeIntegrationDisabledError`, etc. |
| `statusMapper.ts` | Placeholder status mapper — throws if called while disabled |

---

## Hard Rules

- Do not add `fetch()`, `axios`, or any HTTP client call to any file here.
- Do not invent Tekae API endpoints.
- Do not store API keys, tokens, or credentials here.
- Do not import from this directory in payment-critical paths until the gate above is passed.
- Do not remove the `TekaeIntegrationDisabledError` guard from `statusMapper.ts`.

---

## Related Documents

- `docs/integrations/TEKAE.md` — provider overview
- `docs/integrations/TEKAE_API_CONTRACT.md` — API contract (placeholder)
- `docs/integrations/TEKAE_SECURITY.md` — security requirements
- `planning/TEKAE_OPEN_QUESTIONS.md` — 14 blocking questions
- `planning/TEKAE_RISKS.md` — risk register
- `planning/TEKAE_HARNESS.md` — integration harness
