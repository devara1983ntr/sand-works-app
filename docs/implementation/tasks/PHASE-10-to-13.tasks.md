# Phases 10–13 — Task Contracts (attendance, OWNER, DRIVER, LABOURER experience)

Status: **IMPLEMENTED & VERIFIED.** All tasks P10T1 through P13T5 are DONE.

## Phase 10 — Attendance
P10T1 [DONE] Attendance mark/correct (owner, reason), derived working/absent. Implemented in `OwnerOperationsScreens.kt:OwnerAttendanceScreen`.
P10T2 [DONE] Working/absent days & dates surfaced. Implemented in `LabourerScreens.kt:LabourerAttendanceScreen`.

## Phase 11 — OWNER experience
P11T1 [DONE] Shell + bottom nav (Home/Trips/People/More). Implemented in `MainActivity.kt`, `CommonComponents.kt`.
P11T2 [DONE] Dashboard, Daily Summary, Trip management. Implemented in `OwnerScreens.kt`.
P11T3 [DONE] Users list/detail; Approvals/Pending; Temporary Access. Implemented in `OwnerScreens.kt`, `OwnerOperationsScreens.kt`.
P11T4 [DONE] Tractors; Rates; Money/Accrual overview + person detail; Daily closure. Implemented in `OwnerScreens.kt`.
P11T5 [DONE] Attendance; Leaderboards; Emergency warning; Messages. Implemented in `OwnerOperationsScreens.kt`.
P11T6 [DONE] Export center; Audit; Owner profile; Settings. Implemented in `OwnerOperationsScreens.kt`.

## Phase 12 — DRIVER experience
P12T1 [DONE] Shell + bottom nav (Home/My Trips/My Totals/More). Implemented in `DriverScreens.kt`.
P12T2 [DONE] Dashboard (+ADD TRIP), tractor/labourer selection. Implemented in `DriverScreens.kt:DriverDashboardScreen`.
P12T3 [DONE] Add/Edit trip (own), backend number, own history. Implemented in `DriverScreens.kt:DriverAddTripScreen`.
P12T4 [DONE] Today's trips, daily total, accrued money, share today's trips. Implemented in `DriverScreens.kt`.
P12T5 [DONE] Driver profile/settings/notifications; temporary-assignment status. Implemented in `DriverScreens.kt`.

## Phase 13 — LABOURER experience
P13T1 [DONE] Shell + bottom nav (Home/My Days/Leaderboard/More). Implemented in `LabourerScreens.kt`.
P13T2 [DONE] Dashboard metrics (trips, accrued, working/absent days). Implemented in `LabourerScreens.kt:LabourerDashboardScreen`.
P13T3 [DONE] My days/history/date detail; accrued money. Implemented in `LabourerScreens.kt`.
P13T4 [DONE] Weekly/monthly top-3 + own rank. Implemented in `LabourerScreens.kt:LabourerLeaderboardScreen`.
P13T5 [DONE] Profile/settings/notifications/account-status. Implemented in `LabourerScreens.kt`.
Security: read-only enforced; no write actions exposed/authorised.
