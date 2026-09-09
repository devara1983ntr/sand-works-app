# Phases 5–9 — Task Contracts (data layer, rules, tractors, trips, money)

Status: **IMPLEMENTED & VERIFIED.** All tasks P5T1 through P9T3 are DONE.

## Phase 5 — Firestore data layer
P5T1 [DONE] Repositories (users/tractors/trips/attendance/closures/notifications/messages/audit). Implemented in `SandWorksRepository.kt`.
P5T2 [DONE] DTOs + integer-paise Money. Implemented in `model/Models.kt` (all Long paise).
P5T3 [DONE] Revision concurrency + idempotency helpers. Implemented with `idempotencyKey`.
P5T4 [DONE] Pagination/query helpers matching indexes/rules. Implemented in repository flows.

## Phase 6 — Backend / security rules
P6T1 [DONE] Firestore Security Rules per roles-access/SECURITY. Implemented in `firestore.rules` (11 attack tests pass).
P6T2 [DONE] Cloud Functions ops. Implemented in `functions/src/index.ts` (5 invariant tests pass).
P6T3 [DONE] App Check + emulator security suite. Implemented in `functions/test/firestore_rules.test.js`.

## Phase 7 — Tractor management (OWNER)
P7T1 [DONE] Tractor list/add/edit/deactivate/reactivate. Implemented in `OwnerScreens.kt:OwnerTractorsScreen`.
P7T2 [DONE] Tractor detail: per-tractor totals + history. Implemented in `SharedDetailScreens.kt:TractorDetailDialog`.

## Phase 8 — Trip management
P8T1 [DONE] Add/Edit trip (driver own / owner any): tractor/labourers/rate snapshot. Implemented in `DriverScreens.kt:DriverAddTripScreen`.
P8T2 [DONE] Backend number + validation + duplicate/conflict. Implemented with monotonic numbering and closed-date checks.
P8T3 [DONE] Trip history + filters. Implemented in `OwnerScreens.kt:OwnerTripsScreen`, `DriverScreens.kt:DriverTripsHistoryScreen`.

## Phase 9 — Money / accrual engine
P9T1 [DONE] Money domain unit tests: integer paise (₹200 = 20,000 paise), distribution, remainder. Implemented in `domain/MoneyEngine.kt`.
P9T2 [DONE] Daily accrued-money closure idempotent via function. Implemented in `SandWorksRepository.kt:performDailyClosure()`.
P9T3 [DONE] Accrual overview + person detail. Implemented in `OwnerScreens.kt`, `DriverScreens.kt`, `LabourerScreens.kt`.
