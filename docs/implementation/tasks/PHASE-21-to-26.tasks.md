# Phases 21–26 — Task Contracts (resilience, observability, security, perf, testing, release)

## Phase 21 — Error / network resilience
P21T1 Global error/offline/retry/connection-state layers per ERROR-STATES.md + SCREEN-STATE.md. Accept: no fake success; failed writes handled; recovery after reconnect.
P21T2 Retry w/ exponential backoff where appropriate; duplicate prevention on reconnect.

## Phase 22 — Observability
P22T1 Crashlytics integration (when provisioned). Optional minimal no-PII analytics only if justified.
Blockers: project/credentials (deploy-time).

## Phase 23 — Security hardening
P23T1 Attack-suite tests (escalation, cross-org, forge, expiry, deep-link, storage, idempotency) + secrets hygiene audit + App Check verification. Accept: all cases denied.

## Phase 24 — Performance
P24T1 Apply PERFORMANCE targets (pagination, image downsampling, LazyColumn, no unbounded reads); measure cold-start/scroll; APK size 15–25MB/≤50MB.

## Phase 25 — Complete testing
P25T1 Full test matrix per TESTING.md (unit/VM/repo/rules/functions/UI/a11y/network/concurrency/retry/e2e/security/perf). Accept: criteria met; no test disabled to pass.

## Phase 26 — Release preparation
P26T1 Build/sign release with dedicated SAND WORKS keystore (CI secrets; never committed). 
P26T2 Release validation checklist (security retest on release candidate; a11y; money-idempotency; audit integrity); APK integrity.
P26T3 Private distribution + release notes + handover.
Blockers: release keystore (owner), Firebase project/plan.
