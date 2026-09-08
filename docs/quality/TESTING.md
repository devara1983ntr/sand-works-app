# TESTING — SAND WORKS

Status: **SPECIFIED.** Comprehensive. Covers unit → end-to-end. No test disabled to make CI green.

## Layers & what is tested
- Unit: money engine (integer paise, distribution, rounding remainder, rate snapshot immutability, duplicate detection), domain rules, time/day/timezone boundaries, tie-break determinism.
- ViewModel: state machine per screen, UDF action→reaction, no fake success, submission-guard.
- Repository/data: mapping, org/user scoping.
- Firestore Security Rules tests (emulator): role escalation, cross-org, forge role/approval/rate/number/closure/audit/timestamp, disabled/expired, deep-link authz, storage, idempotency/retry.
- Backend function tests (emulator): register/approve, create/void trip + numbering, configure rate/distribution, daily closure idempotency (run twice → no double count), leaderboard (top-3 honest), temp-assignment expiry, alert/message delivery, export, attendance correction.
- Notifications tests: permission, token lifecycle, deep-link re-validation, no cross-user money broadcast, honest Android limits.
- Navigation tests: role routing, bottom-nav, back/top-left arrow, session-expiry/assignment-expiry routing, deep-link authz.
- Compose UI tests: each screen + states (loading/empty/error/offline/submitting/conflict/forbidden), interactions real (no dead buttons).
- Accessibility tests: semantics, contrast, touch targets, reduced motion, colour-independent status, TalkBack core flows.
- Offline/network degradation: retry, no fake success, failed-write handling, recovery/re-sync, duplicate prevention.
- Concurrency: revision conflict surfaced (no silent overwrite).
- Retry/idempotency: closure, trip create.
- Temp-access expiry, export (authorization + correctness), profile-image (validation/storage), end-to-end (sign-up→approval→trip→closure→summary), regression, security suite, performance.

## Acceptance criteria (representative)
- Money: for given trips, computed accruals equal expected integer values (property tests + examples); Σ shares == pool.
- Closure: calling closure(org,date) twice yields identical single accrual; leaderboard never shows fabricated 3rd when <3 qualify.
- Security suite: all attack-posture cases denied.
- Rules: non-owner writes rejected; labourer writes rejected; cross-org reads rejected.
- Every role's core journey passes end-to-end on emulator.

## Tooling (recommended, not fabricated as running)
- JUnit/truth/mockito/mockk; Robolectric; Firebase Emulator Suite (rules + functions); Compose UI testing; Gradle managed devices/emulator where CI supports.
