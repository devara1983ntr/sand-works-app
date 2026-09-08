# Architecture — SAND WORKS (online-first)

## Platform
- **App:** Android native, **Kotlin + Jetpack Compose**, Material 3.
- **Application id / package:** `com.roshan.sandworks`.
- **Backend:** **Firebase** — Authentication, Cloud Firestore (data), Cloud Storage (profile photos / exported files where enabled), Cloud Functions (server-authoritative operations), Cloud Messaging (notifications), App Check, Crashlytics.
- **Model:** **online-first.** Firestore is the authoritative store. Devices read from and write to the live backend through security rules. This is a deliberate contrast to offline-first: there is no local-primary store and no offline queue acting as the source of truth.

## Layer overview (clean architecture)
1. **UI layer (Compose):** screens + view models. One screen per destination from `docs/screens/`. UI shows truthful states and never fabricates success.
2. **Domain layer:** pure business logic — money engine maths, distribution rules, eligibility, trip rules — independent of Firebase. Unit-testable.
3. **Data layer:** repository contracts implemented against the backend (Firestore reads; Cloud Functions for privileged writes). Also non-privileged local caching only for UX (e.g. remembering session), never as a correctness source.

## Server-authoritative operations (Cloud Functions)
The following are never computed or authorised only on the client — the backend is authoritative:
- Trip numbering (collision-safe).
- Owner provisioning / role grant.
- Driver & labourer approval.
- Rate & money-rule snapshot at record time.
- Money distribution and daily accrual.
- Daily closure (per organisation+date, idempotent).
- Weekly/monthly leaderboards.
- Temporary-assignment expiry enforcement.
- Alert send and notifications.
- Export (PDF/CSV) and profile-photo handling (where storage enabled).
- Audit log creation.

## Concurrency & integrity
- Optimistic concurrency with a revision/version on mutable records; on conflict the user is shown the situation and chooses — never a silent last-writer-wins overwrite.
- Idempotency keys on server-authoritative operations so retries never double-apply (critical for daily closure and money).
- Money is integer currency (no floating point).

## Connectivity reality
- Online-first means screens show **loading / error / offline-with-retry** honestly when the network is unavailable; the user is never given a fake "saved" state.
- See `docs/quality/` for the expected behaviour under flaky networks.

## Non-functional targets
- Release APK target ≈ 15–25 MB (acceptable ≤ 50 MB); never trade security/reliability/a11y/integrity for size.
- Fast, reliable, accessible, secure — industry-level quality bar.
