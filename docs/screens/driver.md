# DRIVER Screens

The driver operates trips and is responsible for recording them accurately. All driver data is **own-scope** — the driver sees their own trips and totals, never another person's money.

## SC-DRV-DASH — Driver dashboard (primary)
- **Shows:** today's trips; the tractor currently selected for the day; labourers assigned to the driver's trips today; today's summary; recent trips.
- **Primary action:** a prominent **+ ADD TRIP** button.
- **States:** loading / empty (no trips today — honest) / error / offline (retry) / submitting.

## SC-DRV-TRIP — Add / edit trip (own)
- **Purpose:** record a working trip.
- **Fields:** date; time; tractor (chosen from the owner's **active** tractor registry); labourers present (from active labourers); rate (auto-shown as the current snapshot, editable only per the owner's configuration rule); total; trip number (auto-assigned, **backend-authoritative**, collision-safe).
- **Driver scope:** a driver may edit their **own** permitted trips (corrections to the record the driver is accountable for). Editing follows optimistic-concurrency/conflict handling: if the record changed concurrently, the user is told and chooses, never silently overwritten.
- **Validation:** tractor must exist & be active; labourers must exist & be eligible; rate snapshot is immutable after the record is confirmed.
- **States:** idle / submitting / validation-error / conflict / **backend-rejected** (e.g. disallowed change) / network-error.
- **Security:** writes are authorised by the backend against role + ownership + approval/expiry. A labourer can never reach this screen; a driver cannot change the rate rule.

## SC-DRV-TRIPS — My trips (history)
- **Shows:** the driver's own trip history with date range filter.
- **Actions:** open a trip to view detail; edit an own permitted trip.
- **States:** loading / empty / error / offline.

## SC-DRV-TOTALS — My totals
- **Shows:** the driver's own totals for the day/period: trip count, work count, money accrual figure.
- **Actions:** **Share today's trips** (standard share sheet / WhatsApp-optional) — shares only real, current values; no fabricated numbers.

## SC-DRV-PROFILE — Driver profile & notifications
- **Shows:** own profile (name, role, phone, status, photo where storage is available, own stats) and the driver's own targeted notifications (approval status, assignments, alerts, daily summaries).
- **Actions:** edit own allowed contact/profile fields (within owner-controlled bounds); view notifications.
- **Security:** own scope only; a driver cannot change their role/status.

## States common to all driver screens
Loading / Empty (honest) / Error / Offline-with-retry / Submitting / Conflict / Forbidden / Session-expired — every one truthful, never fake success.
