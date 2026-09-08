# PERFORMANCE & Stability — SAND WORKS

Status: **SPECIFIED.** Measurable targets; regression criteria in TESTING/CI.

## Targets
- Cold start: ≤ ~2–3 s on a mid-range device (screen first frame).
- Navigation: screen transition responsive (< ~300 ms perceived).
- Screen rendering: 60 fps target, no jank from list/image churn.
- Firestore reads: bounded per screen; paginated where large; no unbounded full-collection pulls.
- Query size: paginate trips/history (e.g. page size documented, e.g. 25–50); avoid loading all notifications.
- Image loading: Coil; thumbnails; downsampled; no giant master images loaded in UI.
- Notification processing: token refresh handled; no heavy main-thread work.
- Memory: no unbounded caches; release bitmap memory; list recycling via LazyColumn.
- Battery/network: minimal polling; pull-to-refresh not auto-loop; push-driven updates; WorkManager only where justified.
- APK size: **target 15–25 MB; practical upper boundary 50 MB**. Never remove important functionality solely for a number; do not add bloat.

## Monitoring & regression
- Baseline timing recorded in CI (debug/perf).
- Performance regression gate: if a change increases cold-start/scroll jank beyond threshold, fail review.
- Firestore usage reviewed for read-cost and rule-query compliance.
- Crash/ANR via Crashlytics (when provisioned) monitored.

## Observability
- Crashlytics (plan/credentials) for stability; minimal analytics (no PII) only if justified. See DEPLOYMENT/quality docs.
