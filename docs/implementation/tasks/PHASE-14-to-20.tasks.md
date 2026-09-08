# Phases 14–20 — Task Contracts (notifications, warning, messaging, leaderboards, search, profile, export)

## Phase 14 — Notifications
P14T1 FCM token lifecycle + permission (rationale, in-app settings) + channels (Earnings/Summary, Alerts, System, Operational). 
P14T2 Notification centre + types A–F + deep links (re-validated) + read state.
Security: per-user; no cross-user money broadcast; backend send.
Blockers: real FCM creds for real push; in-app centre works regardless.

## Phase 15 — Emergency warning
P15T1 Owner warning composer + confirmation + optional message + recipients + strongest-compliant urgent delivery (high-importance channel, sound, vibration, heads-up where OS permits; never silent/DND override) + delivery state/history/retry/duplicate prevention/audit/cancel where possible. Accept: honest limits documented; no fabricated "full volume".

## Phase 16 — Messaging (owner broadcast)
P16T1 Owner message composer/history; targeted recipients; delivery + audit. Owner-only.

## Phase 17 — Leaderboards
P17T1 Weekly + monthly top-3 backend computation + honest rank (no fabricated ranks when <3 qualify). Accept: idempotent; deterministic tie; period Asia/Kolkata.
P17T2 Leaderboard UI (owner/org, driver own+top, labourer top-3+own).

## Phase 18 — Search / filter / sort
P18T1 UI primitives (chips, date range, search w/ debounce, sort, reset, empty state, pagination) per search-filter-sort.md.
P18T2 Apply to trips, users, tractors, notifications, accrual/export history. Accept: permissions-respecting; rules-compliant queries.

## Phase 19 — Profile / photo
P19T1 Profile + edit (own). Accept: own record only.
P19T2 Profile photo upload/replace/delete + validation/compression/crop + progress/failure/retry. Blockers: plan-dependent (Storage/Blaze) — mark unavailable honestly if plan lacks it.

## Phase 20 — Export
P20T1 Owner export center (range/breakdown/format PDF/CSV), server-side where plan supports, history, share; honest fallback. Security: owner-only.
