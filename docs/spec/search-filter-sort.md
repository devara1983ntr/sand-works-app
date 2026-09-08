# Search, Filter & Sort — SAND WORKS

Status: **SPECIFIED.** Search/filter/sort is defined wherever it is useful (users, tractors, trips, dates, driver, labourer, status, working/absent, leaderboard period, money/accrual history). Not every screen needs every control — each is applied only where it adds value.

## 1. General behaviour (applies to all)
- **Input:** text fields trimmed; search typically begins after debounce (~300 ms) or explicit submit for large queries; case-insensitive for text match.
- **Filter controls:** chips / dropdown / segmented per screen; combined filters are AND-ed.
- **Sort:** pick from a documented set per screen; default sort is documented (usually newest first by date/time).
- **Empty result state:** clear, actionable "no matches — clear filters" (reset) with no fabrication.
- **Reset:** one-tap clear of all filters/sort back to default.
- **Sort stability:** tie-break by a deterministic secondary key (e.g. id or timestamp) so ordering is stable across refreshes.
- **Pagination:** paginated Firestore queries where result sets can grow (trips, history); infinite scroll or load-more with loading state; no silent truncation.
- **Loading/error:** skeleton during load; error with retry; network-offline message.
- **Permissions:** only data the role may read is ever returned/scoped by backend; filters never expose data the user may not see.
- **Backend query implications:** filters map to Firestore where()/orderBy with required composite indexes documented in DATABASE.md; range filters (date) bounded; text search implemented as documented (Firestore limitations respected — no fake full-text).

## 2. Per-screen search/filter/sort
| Screen | Filters | Sort | Notes |
|---|---|---|---|
| Trips (owner/driver) | date range, driver, labourer, tractor, status | newest first | paginated |
| Users (owner) | role, status(active/inactive/pending), search by name | name | approval queue separate |
| Tractors (owner) | active/inactive | name | — |
| Labourers working/absent | date range | date | derived |
| Leaderboard | period (weekly/monthly) | rank | top-3 only + own rank |
| Attendance | date, labourer, working/absent | date | — |
| Accrual/money history | date range, person (owner) | date | own-scope for D/L |
| Notifications | read/unread | newest | — |
| Export history | date range | newest | owner only |

## 3. Definitions
- Text match: contains, case-insensitive, on name fields.
- Date filter: uses Asia/Kolkata day boundaries.
- Debounce: 300 ms default for live text search.
