# Navigation & App Shell

The app is online-first and role-aware. After sign-in, each role gets its own dashboard as the home destination.

## Top-level destinations by role
- **OWNER:** Home (dashboard) · Work/Trips · Tractors · People (drivers/labourers/approvals) · Money · Reports · More (settings, audit).
- **DRIVER:** Home (dashboard + ADD TRIP) · My Trips · My Totals · More (profile).
- **LABOURER:** Home (dashboard — read-only metrics) · My History · More (profile).

## Rules of movement
1. **Auth-first:** all destinations are behind sign-in. No operational screen is reachable without a valid, approved session.
2. **Role-scoped:** the destination set is fixed by role. A labourer never sees write actions; a driver never sees owner-only screens; the owner never sees a "labourer" version of anything.
3. **Deep links / shared content** (e.g. a notification, a shared report, a password-reset link) are re-validated against auth + role + organisation + ownership + existence before showing content. If the target is not allowed, the user gets an honest NotFound/Forbidden state — never a guessed screen.
4. **Back & system behaviour:** the system back button and in-app back always behave predictably; process death and rotation restore to the correct destination.

## Authentication-state routing table
| Auth state | Destination |
|---|---|
| No session | SC-AUTH-WELCOME |
| Signed in, role OWNER, active | Owner dashboard |
| Signed in, role DRIVER, approved | Driver dashboard |
| Signed in, role LABOURER, approved | Labourer dashboard |
| Pending approval | SC-AUTH-PENDING |
| Disabled / suspended / expired | SC-SESSION-BLOCKED → sign in |

## Deep-link re-validation guard (security)
Every deep link resolves to an intended target, then the app confirms: signed in? correct role? correct organisation? owns the resource? resource exists? Only if all pass is the content shown. This prevents cross-role and cross-org access through shared links.
