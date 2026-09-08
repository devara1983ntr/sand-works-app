# Shared Screens

Screens more than one role can reach. Every shared screen re-scopes data to the viewing role.

## SC-TRIP-DETAIL — Trip detail
- **Who:** owner (any org trip), driver (own trips).
- **Shows:** date/time, tractor, driver, participating labourers, rate snapshot, total, trip number.
- **Actions:** owner/driver may edit an own permitted trip (conflict-handled). A viewer sees only what their role allows.
- **Security:** role + org + ownership checked before the record is shown.

## SC-LEADERBOARD — Weekly & monthly leaderboard
- **Who:** all (each sees what their role allows).
- **Shows:** weekly (resets each week) and monthly (resets each month) leaderboards, top 3, deterministic tie-break, from real persisted trips. Own position shown to drivers/labourers.
- **Rule:** no fabricated ranks when fewer than 3 are eligible.
- **Security:** derived by the backend from persisted trips; the client cannot invent entries.

## SC-NOTIFICATIONS — Notification centre
- **Who:** all (own notifications only).
- **Shows:** per-user, role-targeted notifications of types:
  - A daily earnings summary (accrued wording)
  - B operational alert (owner)
  - C approval outcome (approved/rejected)
  - D trip assignment
  - E temporary-assignment expiry
  - F operational/other
- **Actions:** open a notification → deep link to the relevant screen (re-validated for auth/role/org/ownership); mark read.
- **Security:** notifications are targeted per user and sent by the backend; a notification never contains another person's private money figures (no cross-user money broadcast).

## SC-PROFILE — Profile (any role)
- **Shows:** the signed-in user's own name, role, phone, status, photo (where storage is available), and own stats.
- **Actions:** edit allowed own fields within owner-controlled bounds.
- **Security:** own record only.

## SC-ABOUT — About
- **Who:** all.
- **Shows:** SAND WORKS brand, version, the single-owner/private nature, and how to contact the owner. Uses the locked logo.
