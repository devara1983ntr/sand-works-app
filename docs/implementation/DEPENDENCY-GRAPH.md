# DEPENDENCY-GRAPH — SAND WORKS Implementation

Status: SPECIFIED.

```
P1 Foundation
 └─ P2 Design system/assets
 └─ P3 Authentication ─┐
P5 Firestore data      ├─ P4 User/role/approval
 └─ P6 Backend/rules   ┘
P7 Tractors ─┐
P8 Trips     ├─ P9 Money/accrual engine
P10 Attendance┘
P11 OWNER  ─┐ (depend on P1-10)
P12 DRIVER  ├── P14 Notifications ─ P15 Emergency warning ─ P16 Messaging
P13 LABOURER┘    │
P17 Leaderboards (needs P9 trips data)
P18 Search/filter/sort (applies to P11/12/13 lists)
P19 Profile/photo
P20 Export (needs P9)
P21 Error/network resilience (cross-cutting; retrofits all screens)
P22 Observability ─ P23 Security hardening ─ P24 Performance ─ P25 Complete testing ─ P26 Release
```

## Critical path
P1 → P2 → P3/P5/P6 → P4 → P7/P8/P10 → P9 → (P11‖P12‖P13) → P14 → P15/P16 → P17 → P18/P19/P20 → P21 → P22 → P23 → P24 → P25 → P26.

## Parallelisable
P7, P8, P10 after P5/P6; P11/P12/P13 after P9; P17/P18/P19/P20 after their data deps; P21 retrofits across screens.
## External deps (not tasks)
Firebase project (real) gates P3/P4/P6/P14/P15/P16/P19/P20/P22/P26 production verification; Blaze gates CF/Storage features; release keystore gates P26. See STATUS.md.
