# TRACEABILITY-MATRIX — SAND WORKS

Status: SPECIFIED. Direction 1: requirement → feature → screen → data → backend → security → test → task. Direction 2: every task maps back to a real requirement. No orphan requirements/tasks.

## Requirement → Feature → Screen → Task (representative, authoritative set)
| Requirement | Feature | Screen | Backend/op | Security | Test | Task |
|---|---|---|---|---|---|---|
| Auth lifecycle | SWF-01/03/04 | AUTH screens | auth ops | backend authn | P3 tests | P3T1-4 |
| Approval-before-access | SWF-02 | Approvals/Pending | approve/reject CF | owner-only | rules | P4T3 |
| No admin; Mansingh=DRIVER | SWF-02/54 | all | role model | roles matrix | escalation | P4T1, P23T1 |
| Tractor registry | SWF-13 | Tractor screens | tractor ops | owner write | rules | P7T1-2 |
| Trips + numbering | SWF-06/31/53 | Trip screens | create/number CF | driver own/owner | function/UI | P8T1-3 |
| Money engine + snapshot | SWF-52/15 | Rate/Accrual | rate config CF | owner config | unit | P9T1 |
| Daily accrued closure | SWF-50 | closure/summary | closure CF | server authority | idempotency | P9T2 |
| Attendance | SWF-14/42 | Attendance | attendance ops | owner correct | rules | P10T1-2 |
| OWNER capabilities | SWF-10..19 | OWNER.md | owner ops | owner-only+audit | UI/rules | P11T1-6 |
| DRIVER capabilities | SWF-30..34 | DRIVER.md | driver ops | own scope | UI/rules | P12T1-5 |
| LABOURER read-only | SWF-40..43 | LABOURER.md | reads | read-only | rules/UI | P13T1-5 |
| Notifications A–F | SWF-51 | Notifications | FCM send CF | per-user | notification | P14T1-2 |
| Emergency warning | SWF-19 | Warning | alert CF | owner-only | alert | P15T1 |
| Messaging | SWF-19 | Message | message CF | owner broadcast | msg | P16T1 |
| Leaderboards honest | SWF-41 | Leaderboard | leaderboard CF | backend | rank | P17T1-2 |
| Search/filter/sort | — | lists | queries | rules-match | query | P18T1-2 |
| Profile/photo | SWF-55 | Profile | photo ops | self/owner | storage | P19T1-2 |
| Export | SWF-17 | Export | export CF | owner-only | export | P20T1 |
| Error/network | SWF-50 (UX) | all | — | no fake success | resilience | P21T1-2 |
| Observability | NFR | all | Crashlytics | no PII | — | P22T1 |
| Security hardening | SWF-54 | all | rules/CF | attack suite | security | P23T1 |
| Performance | NFR | all | queries | — | perf | P24T1 |
| Testing | — | all | — | — | full matrix | P25T1 |
| Release | NFR | — | deploy | signing | release | P26T1-3 |

## Screen ↔ task coverage
Every screen in SCREEN-CATALOG.md is produced within the phase assigned (P11 OWNER, P12 DRIVER, P13 LABOURER, P3/P4 auth, P14 notifications, etc.). No screen is orphaned; no task lacks a requirement.
