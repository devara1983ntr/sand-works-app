# STATUS & BLOCKERS — SAND WORKS Implementation

Status: **SPECIFIED.** This is the source of truth for task state and classification. Uses AGENT.md §8 vocabulary: EXISTING / SPECIFIED / MISSING / BLOCKED / PROPOSED.

## Application functionality
All application functionality is **SPECIFIED** (not implemented — this repo is documentation). No application code exists in this repository.

## Implementation task status
All P<T> tasks are **NOT-STARTED** (planning) until a coding agent marks them IN-PROGRESS/DONE with completion evidence. Default NOT-STARTED. No task is fabricated as DONE.

## Classification of areas
| Area | Status |
|---|---|
| Product/screens/business rules/UX/design | SPECIFIED |
| Money engine, closure, leaderboards, attendance, temporary access | SPECIFIED (domain) |
| Auth/approval/RBAC | SPECIFIED (backend-emulator) |
| Cloud Functions / Storage / scheduled closure | SPECIFIED but **BLOCKED** for real use until Firebase plan (Blaze) decided |
| Real FCM push | SPECIFIED but **BLOCKED** until FCM project creds |
| App Check / Crashlytics production | SPECIFIED but **BLOCKED** until real project |
| Release/signing | SPECIFIED but **BLOCKED** until release keystore (owner) |
| Profile photo (Storage) | SPECIFIED but **BLOCKED** if plan lacks Storage |
| Emergency warning silent/DND override | **NOT supported** (never claim) — compliant behavior only |
| SEO (web) | **Out of scope** by design |

## Blockers register (external inputs — do not fabricate)
| Blocker | Area affected | Smallest input |
|---|---|---|
| Firebase project + config (real) | P3/P4/P6/P22/P26 production verify | owner creates project |
| Firebase plan decision (Spark vs Blaze) | Cloud Functions, Storage, scheduled closure | owner decides plan |
| FCM project creds | real push notifications | provided with project |
| Release signing keystore (dedicated) | private APK release | owner generates keystore |
| Approved copy/UX decisions | notification copy, final mockups | owner approval |
| Asset discrepancy (masters) | — | **NONE — masters are 1536×1536 and unambiguous in this repo** (see brandreport/assets.md) |

## Rule
An area depending on a BLOCKED item must be authored/emulator-tested to its boundary and reported, never faked. All other areas are fully specified and buildable to READY once Phase dependencies are met.
