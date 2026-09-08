# Phase 1 — Project Foundation — Task Contracts

Status: SPECIFIED. Tasks buildable now (no Firebase needed). Blockers: none for local build (release signing is Phase 26).

## P1T1 Scaffold project
Objective: buildable Kotlin/Compose/M3 Gradle project, applicationId `com.roshan.sandworks`.
Requirements: app module, version catalog, Material3, min/target SDK per plan; package never `com.roshan.labourparty`.
Affected screens: none (scaffold). Data: none. Backend: none. Security: no secrets; signing later.
Acceptance: `assembleDebug` builds; package correct. Tests: build. Evidence: build log. Next: P1T2.

## P1T2 Hilt DI foundation
Objective: DI graph (app/domain/data). Acceptance: compile + DI unit. Next: P1T3.

## P1T3 Navigation skeleton + Auth gate
Objective: Navigation Compose graph, auth gate, role-route stubs (real in P3/P4). Acceptance: routes compile; back deterministic. Next: P1T4.

## P1T4 Config & secrets scaffold
Objective: secrets/config from env/ignored (google-services dropped in later); nothing committed. Next: P1T5.

## P1T5 Logging + typed errors
Objective: logger + sealed typed errors → message mapping (SCREEN-STATE). Next: Phase 2.
