# DEPLOYMENT & FIREBASE PLAN DEPENDENCIES — SAND WORKS

Status: **SPECIFIED.** Clearly separates environments and plan dependencies. No real secrets included.

## Environments
- **Local development:** Android Studio, debug signing, local emulator or a dedicated dev Firebase project.
- **Firebase Emulator Suite:** Firestore/Auth/Functions emulation for tests — no production data.
- **Test environment:** a separate Firebase project (owner-provided) for integration.
- **Production Firebase:** owner-provided project with Auth, Firestore, App Check, FCM, Crashlytics (+ Storage/Cloud Functions/Analytics per plan).
- **Private APK release:** signed with the dedicated SAND WORKS release keystore; distributed privately (sideload/private channel).

## Firebase project setup (owner-provided inputs)
- Create Firebase project; enable Authentication (email/password); Firestore; App Check (Play Integrity); Cloud Messaging; Crashlytics; Analytics (only if justified); Storage and Cloud Functions only if the plan supports them.
- Provide `google-services.json`/config via secure env (never committed).

## Plan dependencies (do not assume free-plan availability)
| Capability | Notes |
|---|---|
| Firestore | core, available |
| Authentication | core |
| FCM | push; requires project creds |
| App Check | available (Play Integrity for release) |
| Crashlytics | requires project |
| Analytics | optional; no PII; only if justified |
| **Cloud Functions** | **Blaze/paid plan required** for scheduled daily closure, server-authoritative ops, export generation. If unavailable → documented honest fallbacks (idempotent owner-triggered closure), never fake server authority. |
| **Storage** | **Blaze/paid plan required** for profile photos/export files. If unavailable → profile photo feature marked unavailable (not faked). |
Documented as environment/release dependencies; the implementation stops at that boundary (AGENT.md §9).

## Deployment steps (production)
1. Apply Firestore Security Rules + indexes.
2. Deploy Cloud Functions (as plan supports).
3. Configure Authentication, App Check, FCM.
4. Verify rules/functions via emulator then production smoke tests (seed a test user only).
5. Set environment separation; no cross-env data.
6. Build + sign release APK (dedicated keystore from secrets); verify integrity; install on device.
7. Rollback: revert functions via prior deployment; APK rollback = reinstall prior signed APK (same key).
8. Backups: Firestore export/scheduled backup per plan; keep org data retrievable.
9. Disaster recovery: documented restore procedure.
10. Monitoring: Crashlytics + (optional) minimal analytics; function logs.

## Guardrails
- No real secrets in docs/config.
- Production vs test separation.
- Owner retains Firebase ownership/access.
