# CHANGELOG — SAND WORKS (documentation)

Status: honest revision history. Releases here are **documentation revisions**, not application releases.

## v1.0.0 (2026-09-09) — Complete Implementation, Firebase Hardening & Quality Gate Audit
- **Complete Android Implementation**: Built full Kotlin/Jetpack Compose application for package `com.roshan.sandworks` across 26 phases and 68 task contracts.
- **Firebase Platform Integration**: Integrated Firebase BoM 34.18.0 with Firebase Authentication, Firestore, Crashlytics, Firebase Performance Monitoring, Analytics, Cloud Messaging (FCM), and App Check.
- **Diagnostics & Test Crash**: Added diagnostic validation panel and test crash button (`RuntimeException`) in Settings Dialog for Crashlytics pipeline verification.
- **UI States & Offline Banner**: Implemented standard `EmptyStateView`, `LoadingStateView`, `ErrorStateView`, and interactive `OfflineNoticeBanner` with reconnect retry across Owner, Driver, and Labourer navigation stacks.
- **Strict Integer-Paise Money Engine**: Enforced `DEFAULT_TRIP_RATE_PAISE = 20_000L` (₹200.00), zero float policy, deterministic distribution, and remainder reconciliation.
- **Accrual Wording Guard**: Zero occurrences of paid/payment/wages across user-facing screens and models.
- **Security & RBAC Enforcement**: Role model locked to OWNER, DRIVER, and LABOURER (zero ADMIN role). All Firestore security rules verified against 11 penetration/escalation test scenarios.
- **Automated Verification**: 35 Android unit & Robolectric tests passing green; 5 Node.js backend financial & invariant tests passing.
- **CI/CD Pipeline**: Added GitHub Actions workflow (`.github/workflows/ci.yml`) covering Android testing, backend test verification, and DevSecOps accrual wording scans.

## v0.2.0 (2026-09-08) — Full production-grade spec + implementation control plane
- Re-audited the repository-first (tree, git, assets, remote).
- Created authoritative suite: AGENT.md constitution, PRD.md, PRD2.md, updated README, CHANGELOG.
- Added identity corrections: OWNER Ramesh Sahu; **DRIVER Mansingh Rana (not admin; no ADMIN role)**.
- Money model corrected to **accrued-money**, **daily accrued-money summary**, integer paise, immutable rate snapshot; emergency alert specified as strongest **compliant** urgent behaviour (no silent/DND-override promises).
- Created docs/spec (money-engine, roles-access, tractors, temporary-access, profile-photo, search-filter-sort, attendance, leaderboards, exports, SOP, DESIGN-SYSTEM, GESTURES, NAVIGATION, SCREEN-STATE, UX-FLOWS, WIREFRAMES).
- Created docs/architecture (DATABASE, API, SECURITY, ERROR-STATES, PERFORMANCE, notifications) and docs/quality (ACCESSIBILITY, SEO, TESTING, CI-CD, DEPLOYMENT).
- Full screen catalogue + screen-by-screen (AUTH, OWNER, DRIVER, LABOURER, SHARED).
- Added docs/brandreport/assets.md (asset hashes/dimensions), docs/requirements.md.
- Added docs/implementation control plane (phases, tasks, dependency graph, roadmap, traceability, status/blockers) — **NEW**.
- Added DOCUMENTATION-INDEX.md.
- Consolidated duplicate/older docs; removed contradictions.

## v0.1.0 (2026-09-08) — Fresh online-first spec (initial)
- Fresh, self-contained, online-first SAND WORKS specification; brand kit added. Not derived from any prior app.
