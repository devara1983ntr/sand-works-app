# Implementation Control Plane — SAND WORKS

Status: **SPECIFIED.** Small, independently verifiable tasks. An independent senior Kotlin+Jetpack Compose coding agent builds task-by-task in dependency order. No giant "build the entire app" task.

## Task contract template (every task carries)
ID · objective · requirements · dependencies · affected screens · affected data · backend requirements · security requirements · acceptance criteria · test requirements · completion evidence · blockers · next task/dependency.

## Phases (26) — see PHASES.md
1 Project foundation · 2 Design system & assets · 3 Authentication · 4 User/role/approval system · 5 Firestore data layer · 6 Backend/security rules · 7 Tractor management · 8 Trip management · 9 Money/accrual engine · 10 Attendance · 11 OWNER experience · 12 DRIVER experience · 13 LABOURER experience · 14 Notifications · 15 Emergency warning · 16 Messaging · 17 Leaderboards · 18 Search/filter/sort · 19 Profile/photo · 20 Export · 21 Error/network resilience · 22 Observability · 23 Security hardening · 24 Performance · 25 Complete testing · 26 Release preparation.

## References
- DEPENDENCY-GRAPH.md, ROADMAP.md, TRACEABILITY-MATRIX.md, STATUS.md.

## Status classification & blockers
See STATUS.md. Items requiring owner/Firebase inputs are recorded, not fabricated. Do not claim DONE without completion evidence + tests.
