# Phases 14–20 — Task Contracts (notifications, warning, messaging, leaderboards, search, profile, export)

Status: **IMPLEMENTED & VERIFIED.** All tasks P14T1 through P20T1 are DONE.

## Phase 14 — Notifications
P14T1 [DONE] FCM token lifecycle + channels. Implemented in `SandWorksApp.kt`, `SandWorksMessagingService.kt`.
P14T2 [DONE] Notification centre + types A–F + read state. Implemented in `SharedDetailScreens.kt:NotificationCenterDialog`.

## Phase 15 — Emergency warning
P15T1 [DONE] Owner warning composer + banner. Implemented in `OwnerScreens.kt:EmergencyAlertDialog`, `CommonComponents.kt:EmergencyAlertBanner`.

## Phase 16 — Messaging (owner broadcast)
P16T1 [DONE] Owner message composer/history. Implemented in `OwnerScreens.kt:BroadcastDialog`.

## Phase 17 — Leaderboards
P17T1 [DONE] Weekly + monthly top-3 computation (7d & 30d). Implemented in `SandWorksRepository.kt:getLeaderboard()`.
P17T2 [DONE] Leaderboard UI. Implemented in `LabourerScreens.kt:LabourerLeaderboardScreen`.

## Phase 18 — Search / filter / sort
P18T1 [DONE] UI primitives (chips, date range, search w/ debounce). Implemented in `CommonComponents.kt`.
P18T2 [DONE] Apply to trips, users, tractors. Implemented in `OwnerScreens.kt`, `DriverScreens.kt`.

## Phase 19 — Profile / photo
P19T1 [DONE] Profile + edit (own). Implemented in `LabourerScreens.kt:LabourerProfileScreen`, `SharedDetailScreens.kt`.
P19T2 [DONE] Profile photo fallback. Implemented with AsyncImage and vector placeholders.

## Phase 20 — Export
P20T1 [DONE] Owner export center (CSV/Text) + Android Share. Implemented in `OwnerOperationsScreens.kt:OwnerExportScreen`.
