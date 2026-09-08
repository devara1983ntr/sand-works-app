# Phases 10–13 — Task Contracts (attendance, OWNER, DRIVER, LABOURER experience)

## Phase 10 — Attendance
P10T1 Attendance mark/correct (owner, reason), derived working/absent, revision conflict. Accept: corrections audited; no silent overwrite.
P10T2 Working/absent days & dates surfaced (labourer + owner). Accept: counts correct per attendance.md.

## Phase 11 — OWNER experience (per OWNER.md; screens must satisfy SCREEN-STATE, a11y, responsive, tests)
P11T1 Shell + bottom nav (Home/Trips/People/More) + drawer. 
P11T2 Dashboard, Daily Summary, Trip management (add/edit/detail/history/search).
P11T3 Users list/detail; Approvals/Pending; Temporary Access.
P11T4 Tractors; Rates; Money/Accrual overview + person detail; Daily closure; Weekly/Monthly summaries.
P11T5 Attendance; Leaderboards; Emergency warning; Messages.
P11T6 Export center; Audit; Owner profile; Settings; Security/account.
Security: every capability owner-only + validation/authz/audit (no arbitrary powers).

## Phase 12 — DRIVER experience (per DRIVER.md)
P12T1 Shell + bottom nav (Home/My Trips/My Totals/More).
P12T2 Dashboard (+ADD TRIP), tractor/labourer selection.
P12T3 Add/Edit trip (own), backend number, own history. 
P12T4 Today's trips, daily total, accrued money, share today's trips (real values).
P12T5 Driver profile/settings/notifications; temporary-assignment status.
Security: own scope; driver never admin; no access to others' money.

## Phase 13 — LABOURER experience (per LABOURER.md; read-only)
P13T1 Shell + bottom nav (Home/My Days/Leaderboard/More).
P13T2 Dashboard metrics (trips, accrued, remaining, working/absent days & dates).
P13T3 My days/history/date detail; accrued money; read-only trip history.
P13T4 Weekly/monthly top-3 + own rank (honest). 
P13T5 Profile/settings/notifications/account-status.
Security: read-only enforced; no write actions exposed/authorised.
