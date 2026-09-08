# ROADMAP — SAND WORKS Implementation

Status: SPECIFIED. Milestones vs phases.

## Milestone M1 — Foundations (Phases 1–2)
Project builds, design system + brand applied, DI/nav base. Non-cloud; buildable now. Exit: app compiles; brand + theme in place.

## Milestone M2 — Identity & data (Phases 3–6)
Auth, user/approval, Firestore data layer, backend/rules. Emulator-testable; production needs Firebase project. Exit: sign-up→approval→role routing works on emulator; rules/function tests green.

## Milestone M3 — Core domain (Phases 7–10)
Tractors, trips, money/accrual, attendance. Exit: trip→closure→accrual idempotent; money tests green.

## Milestone M4 — Role surfaces (Phases 11–13)
OWNER, DRIVER, LABOURER experiences. Exit: each role's screens per SCREEN-CATALOG satisfy state/a11y/tests.

## Milestone M5 — Engagement (Phases 14–20)
Notifications, emergency warning, messaging, leaderboards, search/filter/sort, profile/photo, export. Exit: owner can warn/message; leaderboards honest; notifications targeted.

## Milestone M6 — Quality & release (Phases 21–26)
Resilience, observability, security, performance, testing, release. Exit: full matrix green; security suite green; release APK signed/verified.

## Release readiness
Go-live (private APK) requires: Firebase project + plan (owner), release keystore (owner), approved copy/UX (owner) as applicable — recorded as blockers, not skipped.
