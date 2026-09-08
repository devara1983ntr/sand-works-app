# Feature Catalogue — SAND WORKS

Requirement identifiers (SWF). Every feature is mapped to the screens and rules elsewhere in this repository. Nothing listed here is invented backend behaviour.

## Identity & access
| ID | Feature | Roles |
|---|---|---|
| SWF-01 | **Sign in / Sign up** — online email/password auth with role-aware entry; new driver/labourer signup requires owner approval | O/D/L |
| SWF-02 | **Account registration + owner approval** for driver/labourer | O approves, D/L register |
| SWF-03 | **Session handling** — sign out, expired/disabled/suspended account handling, truthful state | O/D/L |
| SWF-04 | **Password reset** — secure reset flow | O/D/L |

## Owner operations
| ID | Feature | Roles |
|---|---|---|
| SWF-10 | **Owner dashboard** — operational overview of the day: trips, work, money; active drivers/labourers; pending approvals; alerts | O |
| SWF-11 | **Approvals screen** — approve/reject pending driver & labourer registrations | O |
| SWF-12 | **Manage users** — drivers & labourers (records, status, approval) | O |
| SWF-13 | **Tractor registry** — register/edit/soft-delete tractors (initial: Sonalika, John Deere) | O |
| SWF-14 | **Labourer registry + attendance** — work-day tracking (working/absent) with owner corrections + reason | O |
| SWF-15 | **Rates & money-rule settings** — trip rate (default ₹200) + distribution rule | O |
| SWF-16 | **General settings** — daily summary time (default 19:30), notification prefs, profile | O |
| SWF-17 | **Reports & export** — PDF + CSV, owner-only, date-range and breakdowns | O |
| SWF-18 | **Audit viewer** — owner read-only audit log | O |
| SWF-19 | **Owner alert send** — operational warning to drivers/labourers | O |

## Driver operations
| ID | Feature | Roles |
|---|---|---|
| SWF-30 | **Driver dashboard** — today's trips, selected tractor, assigned labourers, today's summary, prominent ADD TRIP | D |
| SWF-31 | **Add/edit trip** — date/time, tractor, labourers, rate snapshot, total, trip number (backend-authoritative) | D (own) / O |
| SWF-32 | **Driver my-totals** — own trip/work totals | D |
| SWF-33 | **Share today's trips** (WhatsApp/share-sheet, real values) | D |
| SWF-34 | **Driver profile + notifications** | D |

## Labourer operations
| ID | Feature | Roles |
|---|---|---|
| SWF-40 | **Labourer dashboard (read-only metrics)** — total trips, total accrued, remaining money, working days, absent days, working dates, absent dates | L |
| SWF-41 | **Weekly + monthly leaderboard** (top 3, real data) and own rank | L/all |
| SWF-42 | **Working/absent history** | L |
| SWF-43 | **Labourer profile + notifications** | L |

## Shared / cross-cutting
| ID | Feature | Roles |
|---|---|---|
| SWF-50 | **Daily summary / closure** — per (organisation,date), idempotent, server-authoritative, "accrued" wording | O/D/L (notify) |
| SWF-51 | **Notifications** — role/user-targeted types (daily earnings summary, alert, approval, assignment, expiry, operational) | all |
| SWF-52 | **Money engine** — per-trip rate snapshot, distribution (equal default; configurable), integer currency | engine |
| SWF-53 | **Trip numbering** — backend-authoritative, collision-safe | engine |
| SWF-54 | **Security foundation** — RBAC, org scoping, security rules, audit, approval/expiry enforcement | engine |
| SWF-55 | **Profile photo** (where storage is available) | O/D/L |

## Out of scope
- Public/Play-store consumer release.
- Admin/delegate role; multiple owners.
- Payment disbursement / "paid" ledger.
- Legacy data migration.
- Offline-first local-primary store.
