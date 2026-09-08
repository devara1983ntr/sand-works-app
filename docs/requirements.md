# Requirements Index & Traceability — SAND WORKS

This index maps every feature (SWF) to its screen(s) so nothing is orphaned and every screen maps back to a requirement.

| Feature | Screens | Docs |
|---|---|---|
| SWF-01 Sign in / Sign up | SC-AUTH-SIGNIN, SC-AUTH-SIGNUP, SC-AUTH-WELCOME | screens/auth.md |
| SWF-02 Registration + owner approval | SC-AUTH-SIGNUP, SC-AUTH-PENDING, SC-OWN-APPROVALS | screens/auth.md, screens/owner.md, data/data-model.md |
| SWF-03 Session handling | SC-AUTH-SESSION-EXPIRED | screens/auth.md, security/security.md |
| SWF-04 Password reset | SC-AUTH-FORGOT | screens/auth.md |
| SWF-10 Owner dashboard | SC-OWN-DASH | screens/owner.md |
| SWF-11 Approvals | SC-OWN-APPROVALS | screens/owner.md |
| SWF-12 Manage users | SC-OWN-USERS | screens/owner.md |
| SWF-13 Tractor registry | SC-OWN-TRACTORS | screens/owner.md |
| SWF-14 Labourer registry + attendance | SC-OWN-LABOUR | screens/owner.md |
| SWF-15 Rates & money rule | SC-OWN-RATES | screens/owner.md, data/money-engine.md |
| SWF-16 General settings | SC-OWN-SETTINGS | screens/owner.md |
| SWF-17 Reports & export | SC-OWN-REPORTS | screens/owner.md |
| SWF-18 Audit viewer | SC-OWN-AUDIT | screens/owner.md |
| SWF-19 Owner alert | SC-OWN-ALERT | screens/owner.md, architecture/notifications.md |
| SWF-30 Driver dashboard | SC-DRV-DASH | screens/driver.md |
| SWF-31 Add/edit trip | SC-DRV-TRIP | screens/driver.md, data/money-engine.md |
| SWF-32 Driver my-totals | SC-DRV-TOTALS | screens/driver.md |
| SWF-33 Share today's trips | SC-DRV-TOTALS | screens/driver.md |
| SWF-34 Driver profile + notifications | SC-DRV-PROFILE | screens/driver.md |
| SWF-40 Labourer metrics | SC-LAB-DASH | screens/labourer.md |
| SWF-41 Weekly+monthly leaderboard | SC-LAB-HISTORY, SC-LEADERBOARD | screens/labourer.md, shared.md, data/money-engine.md |
| SWF-42 Working/absent history | SC-LAB-HISTORY | screens/labourer.md |
| SWF-43 Labourer profile + notifications | SC-LAB-PROFILE | screens/labourer.md |
| SWF-50 Daily summary / closure | SC-NOTIFICATIONS | architecture/notifications.md, data/money-engine.md |
| SWF-51 Notifications | SC-NOTIFICATIONS, role profiles | architecture/notifications.md |
| SWF-52 Money engine | SC-OWN-RATES, SC-DRV-TRIP, SC-LAB-DASH | data/money-engine.md |
| SWF-53 Trip numbering | SC-DRV-TRIP | data/data-model.md |
| SWF-54 Security foundation | all | security/security.md |
| SWF-55 Profile photo | SC-*PROFILE, SC-PROFILE | screens/shared.md, data/data-model.md |

## Task/product requirements coverage
Every requirement listed in `docs/product/features.md` appears above with a screen mapping, and every screen in `docs/screens/` maps to at least one requirement. There are no orphan features and no orphan screens in this specification.
