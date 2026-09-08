# Screens — SAND WORKS

This folder completely documents every required screen of the SAND WORKS app.

Each screen entry states: purpose, who sees it (role), the actions it exposes, the data it shows, the states it must handle (loading / empty / error / forbidden / submitting), and any security rule.

## Read order
1. `auth.md` — **sign in, sign up, forgot password**, approval-pending & session screens.
2. `navigation.md` — the app shell and how roles move between screens.
3. `owner.md` — every OWNER screen.
4. `driver.md` — every DRIVER screen.
5. `labourer.md` — every LABOURER screen.
6. `shared.md` — screens seen by more than one role (trip detail, leaderboard, profile, notifications).

## Naming
Screens are referred to by stable IDs (e.g. `SC-AUTH-SIGNIN`, `SC-OWN-DASH`, `SC-DRV-TRIP`). The feature catalogue (`docs/product/features.md`) and the navigation doc reference the same IDs, so every requirement maps to a screen and vice versa.
