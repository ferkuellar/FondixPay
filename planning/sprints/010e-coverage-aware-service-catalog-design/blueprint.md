# Phase 10E Blueprint

## Approach

1. Treat the existing coverage map and Excel workbook as reference inputs, not payment authority.
2. Design a normalized service catalog with state-level coverage and provider capabilities.
3. Define visibility gates for landing, mobile, and CRM/Admin.
4. Define future APIs and operational workflows for coverage changes.
5. Keep Phase 10E documentation-only.

## Architecture Boundary

```text
Landing coverage -> commercial/public reference
Mobile service catalog -> backend-filtered payable services only
CRM catalog -> all services/statuses/capabilities for operations
Prontipagos -> future provider capability source, never assumed
```

## MVP Rule

If a service is not confirmed as `available` with required provider capability, it is not shown as payable in mobile.

## Future Implementation Candidate

Phase 10F should implement backend catalog tables and APIs first, then update mobile to consume backend-filtered services by selected state.
