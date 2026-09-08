# PHASES & TASKS — SAND WORKS Implementation Control Plane

Status: **SPECIFIED.** Each phase lists its small tasks (P<n>T<m>). Every task is fully defined per the template in README.md. Dependencies, roadmap, traceability and status are in the sibling files. Task status is NOT-STARTED by default and flips only on completion evidence (see STATUS.md).

## Phase 1 — Project foundation
- P1T1 Scaffold Android project, applicationId `com.roshan.sandworks`, min/compile/target, Kotlin + Compose + Material 3, version catalogs. Blockers: none (buildable now).
- P1T2 Hilt DI foundation; Application; modules.
- P1T3 Navigation Compose skeleton + Auth gate + role routing stubs (real later).
- P1T4 Configuration & secrets handling scaffold (no secrets committed; env-injected).
- P1T5 Base logging + typed error infra.

## Phase 2 — Design system & assets
- P2T1 Apply locked brand assets (logo/app icon masters → launcher). No redraw/SVG.
- P2T2 Theme tokens (light+dark) per DESIGN-SYSTEM.md; typography, spacing.
- P2T3 Component library (buttons, cards, forms, dialogs, sheets, chips, badges, lists, avatars, loading/empty/error visuals).
- P2T4 Responsive + accessibility baseline (semantics, contrast, touch targets, reduced motion).

## Phase 3 — Authentication
- P3T1 Firebase Auth integration (email/password) behind repository; emulator/local.
- P3T2 Session management; token/credential; sign-out.
- P3T3 Auth screens (Welcome, Sign In, Sign Up, Forgot, reset) + validation + states.
- P3T4 Role-aware routing on auth state; deep-link re-validation foundation.
- Blockers: real Firebase project/App Check for production (emulator fine).

## Phase 4 — User / role / approval system
- P4T1 User model + pending/active states.
- P4T2 Registration (driver/labourer) → pending; owner provisioning path.
- P4T3 Approvals UI + Approve/Reject backend ops.
- P4T4 Disable/suspend/reactivate; account status screens (Approval Pending/Rejected/Suspended/Blocked).
- Security: owner-only; backend-enforced; audit. No admin role. Mansingh Rana = DRIVER.

## Phase 5 — Firestore data layer
- P5T1 Repositories (org, users, tractors, trips, attendance, closures, notifications, messages, audit).
- P5T2 DTOs/field mapping; integer paise money type; server-authoritative field guards.
- P5T3 Revision-based optimistic concurrency helpers; idempotency keys.
- P5T4 Pagination/query helpers per DATABASE.md indexes.

## Phase 6 — Backend / security rules
- P6T1 Firestore Security Rules (role × operation × org/own scope) per roles-access + SECURITY.
- P6T2 Cloud Functions: register/approve/status, trip create/number/void, rate & distribution config, closure, leaderboard, attendance, temp assignment, alert/message, export, profile-photo (plan-dependent).
- P6T3 App Check + rules test suite (emulator).
- Blockers: real Firebase + Blaze for CF/Storage where required.

## Phase 7 — Tractor management (OWNER)
- P7T1 Tractor list/add/edit/deactivate/reactivate + validation/duplicate.
- P7T2 Tractor detail: per-tractor totals + history.
- Security: owner write; active readable for trip use.

## Phase 8 — Trip management
- P8T1 Add/Edit trip (owner/driver own), rate snapshot, labourer select.
- P8T2 Backend trip number + validation; duplicate/conflict handling.
- P8T3 Trip history + filters (date, driver, labourer, tractor, status).
- Security: driver own / owner any; labourer read-only.

## Phase 9 — Money / accrual engine
- P9T1 Money domain (integer paise, distribution, rounding remainder, snapshot) unit tests.
- P9T2 Daily accrued-money closure (idempotent org+date) via function; honest fallback.
- P9T3 Accrual overview + person accrual detail; wording accrued-only.

## Phase 10 — Attendance
- P10T1 Attendance mark/correct (owner, reason); derived working/absent.
- P10T2 Working/absent days/dates surfacing (labourer + owner).

## Phase 11 — OWNER experience (shell + screens per OWNER.md)
- P11T1 Owner shell + bottom nav (Home/Trips/People/More) + drawer.
- P11T2 Dashboard, Daily Summary, Trip management.
- P11T3 Users/approvals/temp access screens.
- P11T4 Tractors, Rates, Money/Accrual, closure, summaries.
- P11T5 Attendance, leaderboards, emergency warning, messages.
- P11T6 Export center, audit, profile/settings.
Each: states/a11y/responsive/tests.

## Phase 12 — DRIVER experience (per DRIVER.md)
- P12T1 Driver shell + bottom nav; dashboard.
- P12T2 Add/Edit trip + tractor/labourer selection; own history.
- P12T3 Today's trips, daily total, accrued money, share today's trips.
- P12T4 Driver profile/settings/notifications; temporary-assignment status.

## Phase 13 — LABOURER experience (per LABOURER.md)
- P13T1 Labourer shell + bottom nav; dashboard (metrics).
- P13T2 My days/history, accrued money, remaining.
- P13T3 Leaderboards (weekly/monthly top-3 + own rank).
- P13T4 Labourer profile/settings/notifications/account status. Read-only enforced.

## Phase 14 — Notifications (centre + infra)
- P14T1 FCM token lifecycle + permission (rationale) + channels.
- P14T2 Notification centre + types A–F + deep links + read state.
- Security: per-user targeting; no cross-user money broadcast.
- Blockers: FCM project creds for real push.

## Phase 15 — Emergency warning
- P15T1 Owner warning composer + confirmation; strongest-compliant urgent delivery; delivery state/history/retry/duplicate prevention/audit/cancel where possible. Honest Android limits; no silent/DND-override claims.

## Phase 16 — Messaging (owner broadcast)
- P16T1 Owner message composer/history; targeted delivery; audit.

## Phase 17 — Leaderboards
- P17T1 Weekly + monthly top-3 backend computation + honest rank rule.
- P17T2 Leaderboard UI (owner/driver/labourer) per leaderboards.md.

## Phase 18 — Search / filter / sort
- P18T1 Filter/sort UI primitives (chips, date range, search w/ debounce) per search-filter-sort.md.
- P18T2 Apply to trips, users, tractors, notifications, exports, accrual.

## Phase 19 — Profile / photo
- P19T1 Profile + edit (own). 
- P19T2 Profile photo upload/replace/delete + validation/compression (plan-dependent; honest if unavailable).

## Phase 20 — Export
- P20T1 Owner export center (range/breakdown/format), server-side where plan supports, history, share. Honest fallback.

## Phase 21 — Error / network resilience
- P21T1 Global error/offline/retry layers per ERROR-STATES.md + SCREEN-STATE.md.
- P21T2 Failed-write handling + recovery; no fake success.

## Phase 22 — Observability
- P22T1 Crashlytics integration (when provisioned); minimal no-PII analytics (only if justified).

## Phase 23 — Security hardening
- P23T1 Attack-suite tests; rules/functions emulator security tests; secrets hygiene audit; App Check verify.

## Phase 24 — Performance
- P24T1 Apply PERFORMANCE targets; pagination, image downsampling, list recycling; measure.

## Phase 25 — Complete testing
- P25T1 Full matrix per TESTING.md; accessibility; e2e; security; concurrency; retry/idempotency. No test disabled to pass.

## Phase 26 — Release preparation
- P26T1 Build/sign release with dedicated keystore (from CI secrets).
- P26T2 Release validation checklist; APK integrity; private distribution.
- P26T3 Handover + release notes.
- Blockers: release keystore (owner), Firebase project/plan.
