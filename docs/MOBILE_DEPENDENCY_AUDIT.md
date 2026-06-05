# Mobile Dependency Audit

Status: Sprint 026 analysis and documentation only. No dependency versions were changed.

## Objective

Classify the mobile dependency vulnerabilities reported after the Expo Location and coverage-filtering sprints, identify practical runtime risk, and define a safe remediation path that preserves Expo and React Native compatibility.

## Scope

- `mobile/package.json`
- `mobile/package-lock.json`
- npm audit output for the mobile workspace
- Expo / React Native compatibility implications
- Documentation of safe remediation policy

## Out Of Scope

Sprint 026 does not run `npm audit fix`, `npm audit fix --force`, `npm update`, `npm install`, or `npx expo install`. It does not change Expo SDK, React Native, navigation, storage, auth, payments, GPS/location behavior, service filtering, backend runtime, API behavior, database schema, migrations, infrastructure, `.env`, secrets, or Tekae runtime.

## Current Dependency Snapshot

Installed direct dependencies from `npm --prefix mobile ls --depth=0`:

| Package | Installed |
|---|---:|
| `@react-navigation/native` | `6.1.18` |
| `@react-navigation/native-stack` | `6.11.0` |
| `@types/react` | `18.3.29` |
| `expo` | `52.0.49` |
| `expo-asset` | `11.0.5` |
| `expo-font` | `13.0.4` |
| `expo-location` | `18.0.10` |
| `expo-secure-store` | `14.0.1` |
| `expo-status-bar` | `2.0.1` |
| `react` | `18.3.1` |
| `react-native` | `0.76.9` |
| `react-native-safe-area-context` | `4.12.0` |
| `react-native-screens` | `4.4.0` |
| `typescript` | `5.9.3` |
| `zustand` | `5.0.13` |

Lockfile: npm lockfile v3, root package `fondix-pay-mobile@0.1.0`, 894 package entries.

## Audit Command Results Summary

`npm --prefix mobile audit` reported:

| Severity | Count |
|---|---:|
| Critical | 0 |
| High | 6 |
| Moderate | 11 |
| Low | 0 |
| Total | 17 |

The report suggests `npm audit fix --force` for most findings, which would install `expo@56.0.8` and is a breaking Expo SDK jump from the current Expo 52 line. Sprint 026 intentionally does not apply it.

## Vulnerability Table

| Severity | Vulnerable package | Direct or transitive | Parent dependency | Runtime impact | Exploitability in FONDIXPAY mobile context | Recommended action | Remediation risk |
|---|---|---|---|---|---|---|---|
| High | `@xmldom/xmldom <=0.8.12` | Transitive | `@expo/plist` | Dev/build tooling | Unlikely for normal mobile runtime; possible if untrusted XML/plist content is processed during config/prebuild tooling | Patch through Expo-compatible dependency update; avoid blind fix | Medium |
| Moderate | `postcss <8.5.10` | Transitive | `@expo/metro-config` | Dev/build tooling | Unlikely in native runtime; possible in build tooling if attacker-controlled CSS reaches stringify output | Wait for Expo-compatible update or planned SDK upgrade | High |
| High | `tar <=7.5.10` | Transitive | `cacache` -> `@expo/cli` | Dev/build tooling | Unlikely in app runtime; possible during package/cache/archive extraction in tooling paths | Dedicated remediation sprint; avoid force upgrade | High |
| Moderate | `uuid <11.1.1` | Transitive | `@expo/bunyan`, `@expo/rudder-sdk-node`, `xcode` | Dev/build tooling | Unlikely unless affected UUID APIs are called with attacker-controlled buffers | Wait for Expo-compatible update | High |
| High | `expo` | Direct umbrella finding | `expo` direct dependency via Expo CLI/config chain | Tooling plus framework | Audit severity is inherited from transitive Expo tooling packages, not evidence of exploitable app-screen runtime code | Plan Expo SDK upgrade and regression QA | High |
| Moderate | `expo-asset` | Direct package finding | `expo-asset` direct dependency via `expo-constants` chain | Runtime package with transitive config dependency | Practical risk unclear; finding is inherited through Expo config dependency chain | Wait for Expo-compatible package set | High |

## Direct Vs Transitive Findings

Direct dependency findings:

- `expo`: direct dependency, reported high because its dependency graph includes vulnerable Expo CLI/config/tooling packages.
- `expo-asset`: direct dependency, reported moderate through the `expo-constants` / Expo config chain.

Transitive findings:

- `@xmldom/xmldom` through `@expo/plist`.
- `postcss` through `@expo/metro-config`.
- `tar` through `cacache` and `@expo/cli`.
- `uuid` through `@expo/bunyan`, `@expo/rudder-sdk-node`, and `xcode`.
- Expo internal packages: `@expo/cli`, `@expo/config`, `@expo/config-plugins`, `@expo/metro-config`, `@expo/prebuild-config`, `@expo/rudder-sdk-node`, `expo-constants`, `cacache`, `xcode`.

## Runtime Vs Dev Tooling Impact

Most reported findings sit in Expo CLI/config/build tooling rather than code paths that run inside the installed mobile app UI. The primary practical risk is developer/build environment exposure: malicious packages, poisoned archives, untrusted XML/plist/CSS/config inputs, or unsafe local build/prebuild workflows.

Current FONDIXPAY mobile runtime is still mock/dev and does not process arbitrary XML, plist, tar archives, or user-controlled CSS. That makes exploitability in current user-facing runtime unlikely, but the dependency audit is still important because tooling compromise can affect builds and release artifacts.

## Expo / React Native Compatibility Notes

The current project is on Expo SDK 52 and React Native `0.76.9`. `npm audit fix --force` points to Expo 56, which is a major SDK jump and should be treated as a dedicated upgrade project, not a patch.

Outdated snapshot:

- Expo latest reported: `56.0.8`.
- React latest reported: `19.2.7`.
- React Native latest reported: `0.85.3`.
- React Navigation latest major is v7 while the project uses v6.

These are not safe patch-only changes. Expo SDK upgrades can require native config, dependency alignment, emulator/device QA, Metro checks, and behavior validation for location, secure storage, navigation, and build scripts.

## Recommended Remediation Plan

1. Monitor npm advisories while Sprint 026 remains documentation-only.
2. Do not run blind `npm audit fix` or `npm audit fix --force`.
3. Create a dedicated Expo-compatible dependency remediation sprint.
4. In that sprint, use Expo-supported upgrade guidance and validate a single target SDK/package set.
5. Re-run:
   - `npm --prefix mobile audit`
   - `npm --prefix mobile run typecheck`
   - Expo start/build smoke test
   - Android/iOS device or emulator smoke test where available
6. Confirm GPS/manual state selector, Secure Store session, navigation, service filtering, payment mock flow, and receipt flow still work.
7. Only after QA, commit package and lockfile changes.

## Do Not Run Blind Fixes Policy

Do not run:

- `npm audit fix`
- `npm audit fix --force`
- `npm update`
- `npm install` for version changes
- `npx expo install` for upgrades
- manual version edits in `package.json`
- manual lockfile edits

These commands are blocked until a dedicated remediation sprint approves the target Expo SDK/package set and validation plan.

## Risks

- Tooling vulnerabilities could affect local or CI build pipelines if untrusted archives/config inputs enter the workflow.
- Forced audit remediation could break Expo/React Native compatibility.
- Staying on Expo 52 may continue to report advisories until an SDK-aligned update is planned.
- CI or developer machines could treat `npm audit` exit code 1 as a hard failure without contextual triage.

## Open Questions

- What Expo SDK version should be the next approved target?
- Should dependency audit become a CI warning, blocking gate, or manual release checklist item?
- Does the team need an Expo device QA checklist before dependency upgrades?
- Who approves dependency upgrade risk for mobile release candidates?

## Acceptance Criteria

- Vulnerabilities are classified by severity, direct/transitive path, runtime/tooling impact, exploitability, recommended action, and remediation risk.
- No dependency version changes are made.
- Expo/React Native compatibility risk is documented.
- Blind fixes are explicitly prohibited.
- A safe next remediation plan exists.

## Next Sprint Recommendation

Schedule a dedicated mobile dependency remediation sprint only when there is time for Expo-compatible upgrade planning, full TypeScript validation, and device/emulator smoke QA.
