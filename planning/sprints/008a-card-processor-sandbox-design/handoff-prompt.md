# Phase 8A Handoff Prompt

Continue from `planning/sprints/008a-card-processor-sandbox-design/`.

Phase 8A is architecture-only. The next recommended phase is:

```text
Phase 8B - Prontipagos Sandbox Integration Design
```

Preserve these constraints:

- User-facing payments are card-only.
- Card processor and Prontipagos are separate integrations.
- Do not store PAN or CVV.
- Do not add real provider secrets.
- Do not implement card processor adapter work until provider selection and sandbox implementation scope are approved.
- Do not mark production ready.
