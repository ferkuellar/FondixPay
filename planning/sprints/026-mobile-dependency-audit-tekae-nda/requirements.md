# Sprint 026 — Mobile Dependency Audit + Tekae NDA Controls: Requirements

## Goal

Audit the mobile app's npm dependency tree for security and licensing risks, and document Tekae NDA-related controls governing what Tekae information can appear in the repo.

## Context

After several sprints adding expo-location and coverage utilities, a dependency audit ensures no risky packages were introduced. Separately, the Tekae NDA imposes constraints on how Tekae API details are documented; Sprint 026 formally records those controls.

## Scope

- Create docs/MOBILE_DEPENDENCY_AUDIT.md — dependency audit results, risk level per package, recommendations.
- Update docs/SECURITY.md with Tekae NDA control record.
- Update docs/TEKAE_CATALOG_NORMALIZATION_DESIGN.md and docs/TEKAE_INTEGRATION_READINESS.md to reflect NDA controls.
- Update .gitignore if needed to exclude Tekae-sensitive files.
- Update planning/FILE_INVENTORY.md, planning/DECISIONS.md, planning/QUESTIONS.md, planning/RISKS.md.

## Out of Scope

- No code changes, no dependency upgrades or removals.
- No Tekae implementation.

## Acceptance Criteria

- MOBILE_DEPENDENCY_AUDIT.md covers all direct dependencies, flagging any risks.
- Tekae NDA controls documented in SECURITY.md.
- No Tekae secrets or NDA-restricted content in any file.
