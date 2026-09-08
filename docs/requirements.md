# Requirements Index & Traceability — SAND WORKS

Status: **SPECIFIED.** Bidirectional mapping: every requirement → feature → screen → data → backend → security → test → implementation task. See `docs/implementation/TRACEABILITY-MATRIX.md` for the full matrix. This index lists feature → screen source of truth.

| Feature | Screens | Spec source |
|---|---|---|
| SWF-01 Sign in / Sign up | SC-AUTH-WELCOME/SIGNIN/SIGNUP | docs/screens/AUTH.md |
| SWF-02 Registration + owner approval | SC-AUTH-SIGNUP, PENDING, SC-OWN-APPROVALS | docs/screens/AUTH.md, OWNER.md; roles-access.md |
| SWF-03 Session handling | SC-AUTH-* | AUTH.md; ERROR-STATES.md |
| SWF-04 Password reset | SC-AUTH-FORGOT | AUTH.md |
| SWF-10 Owner dashboard | SC-OWN-DASH (Home) | OWNER.md |
| SWF-11 Approvals | SC-OWN-APPROVALS/PENDING | OWNER.md |
| SWF-12 Manage users | SC-OWN-USERS (Driver/Labourer list/detail) | OWNER.md |
| SWF-13 Tractor registry | SC-OWN-TRACTORS | OWNER.md; tractors.md |
| SWF-14 Labourer registry + attendance | SC-OWN-LABOUR/ATTENDANCE | OWNER.md; attendance.md |
| SWF-15 Rates & distribution | SC-OWN-RATES | OWNER.md; money-engine.md |
| SWF-16 General settings | SC-OWN-SETTINGS | OWNER.md |
| SWF-17 Reports & export | SC-OWN-EXPORT | OWNER.md; exports.md |
| SWF-18 Audit viewer | SC-OWN-AUDIT | OWNER.md; SECURITY.md |
| SWF-19 Emergency warning / message | SC-OWN-ALERT/MESSAGE | OWNER.md; notifications.md |
| SWF-30 Driver dashboard | SC-DRV-DASH | DRIVER.md |
| SWF-31 Add/edit trip | SC-DRV-TRIP | DRIVER.md; money-engine.md; API.md |
| SWF-32 Driver my-totals | SC-DRV-TOTALS | DRIVER.md |
| SWF-33 Share today's trips | SC-DRV-SHARE | DRIVER.md |
| SWF-34 Driver profile+notifications | SC-DRV-PROFILE | DRIVER.md |
| SWF-40 Labourer metrics | SC-LAB-DASH | LABOURER.md |
| SWF-41 Weekly+monthly leaderboard | SC-LAB-LEADERBOARD | LABOURER.md; leaderboards.md |
| SWF-42 Working/absent history | SC-LAB-DAYS/DATE | LABOURER.md; attendance.md |
| SWF-43 Labourer profile+notifications | SC-LAB-PROFILE | LABOURER.md |
| SWF-50 Daily accrued-money summary/closure | closure → notification A | money-engine.md; DATABASE.md; API.md |
| SWF-51 Notifications | SC-NOTIFICATIONS | SHARED.md; notifications.md |
| SWF-52 Money engine | rate/trip/closure | money-engine.md |
| SWF-53 Trip numbering | SC-DRV-TRIP | API.md; DATABASE.md |
| SWF-54 Security foundation | all | SECURITY.md; roles-access.md |
| SWF-55 Profile photo | SC-*PROFILE | profile-photo.md |

## Coverage statement
Every feature listed in `docs/product/features.md` and `PRD2.md` appears here mapped to screens and spec docs; every screen in `docs/screens/SCREEN-CATALOG.md` maps to ≥1 requirement. Full requirement→task mapping lives in `docs/implementation/TRACEABILITY-MATRIX.md`. No orphan requirements, no orphan screens.
