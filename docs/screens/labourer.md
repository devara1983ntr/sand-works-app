# LABOURER Screens

The labourer is a daily worker. Operationally the labourer is **read-only**: they see their own personal figures and nothing else. There is no write action available to a labourer, and none is authorised.

## SC-LAB-DASH — Labourer dashboard (personal metrics, read-only)
- **Shows**, all for the logged-in labourer only, derived from their real persisted trips:
  - Total trips
  - Total accrued (money)
  - Remaining money
  - Working days
  - Absent days
  - Working dates
  - Absent dates
  - Weekly + monthly rank
- **No actions that write.**
- **States:** loading / empty (no data yet — honest zeros, never fabricated) / error / offline.
- **Security:** own-scope reads only; the backend returns only this person's data.

## SC-LAB-HISTORY — My working / absent history & leaderboard
- **Shows:** the labourer's date-based working/absent history; the weekly and monthly leaderboard (top 3, real data) and the labourer's own position.
- **Leaderboard rule:** top 3 only, deterministic tie-break, built from real persisted trips. If fewer than 3 are eligible, only real ranks are shown — a 2nd/3rd place is never fabricated.
- **States:** loading / empty / error / offline.

## SC-LAB-PROFILE — Labourer profile & notifications
- **Shows:** own profile (name, role, phone, photo where storage is available, status) and the labourer's own targeted notifications (approval status, assignment/expiry, operational alerts, daily summary — wording is always **accrued**, never "payment").
- **Actions:** view; edit only allowed own contact/profile fields within owner-controlled bounds.
- **Security:** own scope; a labourer cannot alter status, role, or any record.

## Wording guardrail
Money figures for a labourer are always presented as **accrued / summary** values (e.g. "Today's earnings added", "Total accrued") and never as "payment completed". This applies across labourer screens, notifications and leaderboards.
