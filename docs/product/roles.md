# Roles — SAND WORKS

SAND WORKS has exactly **three roles**. There is **no** ADMIN/delegate role and exactly **one OWNER**.

## People
- **OWNER: Ramesh Sahu** — the single operator and ultimate authority.
- **DRIVER: Mansingh Rana** — the primary/authorized driver, plus any additional approved drivers.
- **LABOURER** — daily workers, approved by the owner.

> **Important:** Mansingh Rana is a **DRIVER**. He is *not* an admin and SAND WORKS never creates a second administrative role. The architecture must not silently elevate him. As DRIVER he can perform the driver operations below; the OWNER remains the ultimate authority for approvals, configuration, money rules, exports and messaging.

## OWNER
Full visibility and control within the documented product boundary (no arbitrary undocumented powers — every capability has validation, authorization, error handling and audit):
- Dashboard, daily/historical summaries.
- Register/approve/reject/disable/suspend drivers & labourers; manage temporary access.
- Tractor registry (add/edit/deactivate/reactivate).
- Trips and trip corrections.
- Rate configuration and distribution-rule configuration.
- Money/accrual overview; per-person accrual detail; daily closure.
- Attendance (with reason for corrections).
- Leaderboards; notifications; emergency warnings; messages (owner-only broadcast).
- Exports (PDF/CSV, owner-only).
- Profile, application settings, security/account settings, audit/activity history.

## DRIVER
An authorized driver (e.g. Mansingh Rana) can:
- Sign in; view dashboard and today's trips.
- View assigned/available tractors per authorization; select tractor; add trips; edit trips within allowed scope/window; select participating labourers.
- View relevant trip history; own accrued totals; operational summaries.
- Share the current day's total trip count (Android/WhatsApp share, real values).
- Manage profile; perform temporary-assignment operations only when authorized.

**What a DRIVER cannot do:** approve/reject users, configure rate or distribution, disable/suspend, export, send broadcasts, read another user's private financial information, or act as an admin. The DRIVER never becomes an OWNER or ADMIN.

## LABOURER
Operationally **read-only**. Sees only their own data:
- Total trips, accrued money, remaining/accrued outstanding (as defined), working days, absent days, working dates, absent dates.
- Weekly leaderboard and monthly top-3 (honest), own rank, relevant trip participation.
- Profile, notifications, account/access status.

**What a LABOURER cannot do:** create/edit trips, change records, approve, configure, export, or see others' private money.

## Approval model
- New DRIVER/LABOURER accounts are created as **pending** and gain **no privileged access** until the OWNER approves them (backend-enforced, never a fake local-only approval).
- Rejected/blocked, suspended, and disabled states all prevent operational access.

## Temporary assignment
A LABOURER may, only while under a valid owner/authorized-driver temporary assignment, perform the assigned driver duties; the assignment has explicit start/expiry, is backend-enforced, expires automatically, never permanently changes role, and is revocable by the owner. See `docs/spec/temporary-access.md`.
