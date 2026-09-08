# Phases 5–9 — Task Contracts (data layer, rules, tractors, trips, money)

## Phase 5 — Firestore data layer
P5T1 Repositories (org/users/tractors/trips/attendance/closures/notifications/messages/audit) per DATABASE.md. Accept: repo contracts compile; emulator read/write.
P5T2 DTOs + integer-paise Money + server-authoritative field guards. Accept: no float for money.
P5T3 Revision concurrency + idempotency helpers. Accept: conflict surfaced; idempotent ops.
P5T4 Pagination/query helpers matching indexes/rules (rules are not filters).

## Phase 6 — Backend / security rules
P6T1 Firestore Security Rules per roles-access/SECURITY. Accept: rules tests green (escalation, cross-org, forge, expiry, storage, idempotency).
P6T2 Cloud Functions ops (register/approve/status; trip create/number/void; rate & distribution; closure; leaderboard; attendance; temp assignment; alert/message; export; profile-photo). Accept: emulator function tests per API.md.
P6T3 App Check + emulator security suite. 
Blockers: real Firebase + Blaze for CF/Storage.

## Phase 7 — Tractor management (OWNER)
P7T1 Tractor list/add/edit/deactivate/reactivate + validation/duplicate. Accept: owner CRUD; duplicate rejected.
P7T2 Tractor detail: per-tractor totals + history. Accept: derived from trips; inactive keeps history.

## Phase 8 — Trip management
P8T1 Add/Edit trip (driver own / owner any): date/time/tractor/labourers/rate snapshot/total. Accept: driver own + owner any; labourer no write.
P8T2 Backend number + validation + duplicate/conflict. Accept: number collision-safe; duplicate rejected; conflict surfaced.
P8T3 Trip history + filters. Accept: search/filter/sort per spec; paginated.

## Phase 9 — Money / accrual engine
P9T1 Money domain unit tests: integer paise, distribution (equal default + config), rounding remainder (Σ==pool), snapshot immutability. Accept: property/examples pass.
P9T2 Daily accrued-money closure idempotent (org,date) via function; honest fallback. Accept: re-run → no double count; wording accrued.
P9T3 Accrual overview + person detail. Owner; own-scope for D/L. Accept: no cross-user money.
